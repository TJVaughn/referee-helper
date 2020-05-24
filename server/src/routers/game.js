const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Game = require('../models/Game')
const multer = require('multer')
const Arena = require('../models/Arena')
const addGamesFromArray = require('../utils/addGamesFromArray')

//Create Event

//Read Single Event by ID

//Update Event

//Delete Event

//Get all Events

const addRHGroup = (groups, newGroup) => {
    for(let i = 0; i < groups.length; i++){
        if(groups[i].group.name === newGroup){
            return true
        }
    }
    return false
}
// CREATE GAME
router.post('/api/game', auth, async (req, res) => {
    try {
        let arena = await Arena.find({owner: req.user._id, name: req.body.location})
        // console.log(arena)
        if(!req.body.refereeGroup){
            req.body.refereeGroup = 'Referee Helper'
        }
        const game = new Game({
            ...req.body,
            distance: 0,
            duration: 0,
            owner: req.user._id,
            status: "normal",
            paid: false
        })
        const isRH = addRHGroup(req.user.groups, req.body.refereeGroup)
        if(!isRH){
            req.user.groups.push({group: {name: req.body.refereeGroup}})
        }
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
            await req.user.save()
            await game.save()
            return res.status(201).send(game)
        } else {
            return res.send({_message: "Game already exists"})
        }

    } catch (error) {
        return res.status(418).send({error: "Error from create game: " + error})
    }
})

// READ SINGLE GAME BY ID
router.get('/api/game/:id', auth, async (req, res) => {
    try {
        const user = req.user
        console.log(req.params.id)
        const game = await Game.findOne({_id: req.params.id, owner: user._id})

        if(!game){
            return res.status(404).send({error: "Game not found"})
        }
        return res.send(game)
    } catch (error) {
        return res.status(500).send({error: "Error in read single game by ID: " + error})
    }
})

// UPDATE GAME BY ID
router.patch('/api/game/:id', auth, async (req, res) => {
    const user = req.user
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = [
        "dateTime", "completed", "fees", "status", "refereeGroup", "location", "platform", "level", "distance", "duration", "paid"
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
        return res.send(game)
    } catch (error) {
        return res.status(500).send(error)
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
        res.status(500).send({error: 'Error in deleting game'})
    }
})


// GET ALL GAMES WITH SORTING FEATURES
router.get('/api/all-games', auth, async (req, res) => {
    try {
        // console.log(JSON.stringify(req.headers))
        const games = await Game.find({ owner: req.user._id })
        if(!games){
            games = []
            return res.send(games)
        }
        games.sort((a, b) => {
            //asc
            return a.dateTime - b.dateTime
            //desc
            return b.dateTime - a.dateTime
        })

        // let monthYear = new Date()
        // monthYear = monthYear.setHours(0, 0, 0, 0)
        // monthYear = new Date(monthYear)
        
        let gamesByMonth = []
        if(req.query.month){
            let month = req.query.month
            let year = req.query.year;
            monthYear = new Date(year, month, 1, 12, 0, 0)
            // console.log(monthYear)
            for(let x = 0; x < games.length; x ++){
                if(games[x].dateTime.getMonth() === monthYear.getMonth() && monthYear.getFullYear() === games[x].dateTime.getFullYear()) {
                    gamesByMonth.push(games[x])
                }   
            }
            res.send([gamesByMonth, req.user.groups])
        }
        res.send([games, req.user.groups])
        
    } catch (error) {
        res.status(500).send({error: "Error from get all games: " + error})
    }
})

//import many games
router.post('/api/games/add-many', auth, async (req, res) => {
    try {
        let startTime = Date.now()
        const currentSchedule = await Game.find({owner: req.user._id})
        const [ newGames, gamesTBUpdated ] = await addGamesFromArray(req.body.schedule, req.body.platform, req.user, currentSchedule)
        let secsElapsed = Math.floor((Date.now() - startTime) / 100)
        console.log(secsElapsed)
        res.send([ newGames, gamesTBUpdated ])
    } catch (error) {
        res.status(500).send({error: "Error from add-many games: " + error})
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