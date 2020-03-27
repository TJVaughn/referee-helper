const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Game = require('../models/Game')
const multer = require('multer')
const superagent = require('superagent')

// CREATE GAME
router.post('/api/game', auth, async (req, res) => {
    const game = new Game({
        ...req.body,
        owner: req.user._id,
        status: "normal",
        paid: false
    })
    try {
        const owner = req.user._id
        const currentSchedule = await Game.find({owner})
        let duplicates = currentSchedule.filter((current) => {
            let gameDate = game.dateTime.toString().split().splice(0, 15)
            gameDate = gameDate.join('')
            let currDate = current.dateTime.toString().split().splice(0, 15)
            currDate = currDate.join('')
            // console.log("New Game dateTime: ", gameDate)
            // console.log("Current dateTime: ", currDate)
            if(gameDate === currDate) {
                return true
            }
            return false
        })
        if(duplicates.length === 0){
            await game.save()
            res.send(game)
        } else {
            res.send({_message: "Game already exists"})
        }

    } catch (error) {
        res.status(418).send({error: "Error from create game: " + error})
    }
})

// READ SINGLE GAME BY ID
router.get('/api/game/:id', auth, async (req, res) => {
    const _id = req.params.id
    const user = req.user
    try {
        const game = await Game.findOne({owner: user._id, _id})
        if(!game){
            res.status(404).send({error: "Game not found"})
        }
        res.send(game)
    } catch (error) {
        res.status(418).send(error)
    }
})

// UPDATE GAME BY ID
router.patch('/api/game/:id', auth, async (req, res) => {
    const user = req.user
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = [
        "dateTime", "completed", "fees", "status", "refereeGroup", "location", "platform", "level", "milage", "paid"
    ]
    const isValidUpdate = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if(!isValidUpdate){
        return res.status(418).send({error: "Invalid Update"})
    }
    try {
        const game = await Game.findOne({owner: user._id, _id})
        if(!game){
            return res.status(404).send({error: "Game not found"})
        }
        updates.forEach((update) => {
            game[update] = req.body[update]
        })
        await game.save()
        res.send(game)
    } catch (error) {
        res.status(500).send(error)
    }
})

// DELETE GAME BY ID
router.delete('/api/game/:id', auth, async (req, res) => {
    const _id = req.params.id
    const user = req.user
    try {
        const game = await Game.findOneAndDelete({owner: user._id, _id})
        res.send(game)
    } catch (error) {
        res.status(418).send(error)
    }
})
const callMapsApi = async (today, user, games) => {
    try {
        for(let i = 0; i < games.length; i++){
            if(!games[i].distance 
                && games[i].dateTime.getDate() === today.getDate()
                && games[i].dateTime.getMonth() === today.getMonth()
                && games[i].dateTime.getFullYear() === today.getFullYear()){
                    let mapsAPIURL = `https://maps.googleapis.com/maps/api/distancematrix/json?key=${process.env.MAPS_KEY}&origins=${user.street}${user.city}${user.state}&destinations=${encodeURI(games[i].location)}&units=imperial`
                    let response = await superagent.get(mapsAPIURL)
                    response.res.text = JSON.parse(response.res.text)
                    // console.log(response.res.text)
                    games[i].distance = response.res.text.rows[0].elements[0].distance.text
                    games[i].duration = response.res.text.rows[0].elements[0].duration.text
                    games[i].save()
                    console.log("CALLED MAPS API")
            }
        }
    } catch (error) {
        return {error: "Error from Maps API: " + error}
    }
}

// GET ALL GAMES WITH SORTING FEATURES
router.get('/api/all-games', auth, async (req, res) => {
    
    try {
        const games = await Game.find({ owner: req.user._id })
        if(!games){
            games = []
            return res.send(games)
        }
        games.sort((a, b) => {
            return b.dateTime - a.dateTime
        })
        let today = new Date()
        await callMapsApi(today, req.user, games)
        let monthYear = new Date()
        let gamesByMonth = []
        if(req.query.month){
            let num = req.query.month.split('-').pop()
            monthYear = monthYear.setMonth((today.getMonth() - num))
            monthYear = new Date(monthYear)
            // console.log(monthYear.getMonth())
        }
        for(let x = 0; x < games.length; x ++){
            if(games[x].dateTime.getMonth() === monthYear.getMonth() && monthYear.getFullYear() === games[x].dateTime.getFullYear()) {
                gamesByMonth.push(games[x])
            }   
        }
        res.send(gamesByMonth)
    } catch (error) {
        res.status(500).send({error: "Error from get all games: " + error})
    }
})

//ADD games from CSV import
const upload = multer({
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(csv)$/)){
            return cb(new Error("File must be .csv"))
        }
        cb(undefined, true)
    }
})
router.post('/api/games/import', auth, upload.single('schedule'), async (req, res) => {
    const buffer = req.file.buffer
    let schedule = buffer.toString()
    schedule = schedule.split(/,/)
    schedule = schedule.filter((item) => {
        return item
    })
    schedule = schedule.map((item) => {
        return item = item.split(/\r|\n|\"/).join('').trim()
    })
    const findFirstDate = (array) => {

        for(let i = 0; i < array.length; i++){
            if(array[i].includes("/") && new Date(array[i]).toString() !== 'Invalid Date'){
                return i
            }
        }

        return "no date found"
    } 
    let firstDateIndex = findFirstDate(schedule)
    schedule = schedule.splice(firstDateIndex)
    console.log(encodeURI('Stamford Twin Rinks, East'))

    res.send(schedule)
}, (error, req, res, next) => {
    res.status(418).send({error: error.message})
})

module.exports = router