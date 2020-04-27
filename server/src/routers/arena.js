const express = require('express')
const router = new express.Router()
const Arena = require('../models/Arena')
const Game = require('../models/Game')
const auth = require('../middleware/auth')
const superagent = require('superagent')
const addArenasFromGames = require('../utils/AddArenasFromGames')
const calculateDistance = require('../utils/calculateDistance')

const removeDuplicateArenas = (newArenas, oldArenas) => {
    let arenasToBeAdded = []
    let arenasToBeUpdated = []
    newArenas.map((arena) => {
        for(let i = 0; i < oldArenas.length; i ++){
            if(arena.name === oldArenas[i].name){
                return arenasToBeUpdated.push(arena)
            }
        }
        arenasToBeAdded.push(arena)
    })
    return {arenasToBeAdded, arenasToBeUpdated}
}

router.get('/api/arena/add-arenas-from-schedule', auth, async (req, res) => {
    try {
        const arenas = await Arena.find({owner: req.user._id})
        const schedule = await Game.find({owner: req.user._id})
        let newArenas = addArenasFromGames(schedule)
        let oldAndNewArenas = removeDuplicateArenas(newArenas, arenas)
        let arenasToBeAdded = oldAndNewArenas.arenasToBeAdded
        let distanceData = await calculateDistance(req.user, arenasToBeAdded)
        arenasToBeAdded = distanceData.arenas
        arenasToBeUpdated = oldAndNewArenas.arenasToBeUpdated
        arenasToBeUpdated.map((arena) => {
            superagent.patch(`/api/arena/${arena._id}`)
            .send({
                "name": arena.name,
                "address": arena.address,
                "distance": arena.distance,
                "duration": arena.duration
            })
            .set('accept', 'json')
            .end((err, res) => {
                if(err){
                    return err
                }
                return res
            });
        })
        let calledMapsDistanceAPI = distanceData.num
        req.user.hasCalledDistanceMatrixApi = calledMapsDistanceAPI
        await req.user.save()
        arenasToBeAdded.map((arena) => {
            let newArena = new Arena({ 
                name: arena.name,
                address: arena.address,
                distance: arena.distance,
                duration: arena.duration,
                owner: req.user._id,
             })
            newArena.save()
        })
        res.send(arenasToBeAdded)
    } catch (error) {
        res.status(500).send({error: `Error from api/arena/add-arenas-from-schedule: ${error}`})
    }
})
router.get('/api/arena/assign-distance-to-games', auth, async (req, res) => {
    try {
        const arenas = await Arena.find({ owner: req.user._id })
        const games = await Game.find({ owner: req.user._id })
    
        const assignDistanceDataToGames = (arenas, games) => {
            //for every game, find it's matching arena and assign the arena distnace and duratin to the game
            for(let i = 0; i < games.length; i ++){
                for(let x = 0; x < arenas.length; x++){
                    if(games[i].formattedLocation === arenas[x].name){
                        games[i].distance = arenas[x].distance
                        games[i].duration = arenas[x].duration
                    }
                }
            }
            return games
        }   
    
        let updatedGames = assignDistanceDataToGames(arenas, games)
        updatedGames.map((game) => {
            game.save()
        })
        res.send(updatedGames)
    } catch (error) {
        res.status(500).send({error: `Error from api/arena/assign distance to games: ${error}`})
    }

})

// CREATE
router.post('/api/arena', auth, async (req, res) => {
    try {
        const location = req.body.location
        const mapsPlaceUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURI(location)}&inputtype=textquery&key=${process.env.MAPS_KEY}&fields=formatted_address,name`
        const response = await superagent.get(mapsPlaceUrl)
        let text = JSON.parse(response.res.text)
        // console.log(text)
        let name = text.candidates[0].name

        text = text.candidates[0].formatted_address
        text = text.split(',')

        let street = text[0]
        let city = text[1]
        let country = text[3]
        text[2] = text[2].trim()
        text[2] = {
            zip: text[2].split('').splice(3, 5).join(''),
            state: text[2].split('').splice(0, 2).join('')
        }
        let zipCode = text[2].zip
        let state = text[2].state
        
        const arena = new Arena({
            name: name,
            distance: req.body.distance,
            duration: req.body.duration,
            street: street,
            city: city,
            state: state,
            zipCode: zipCode,
            country: country,
            address: `${street}, ${city}, ${state}, ${zipCode}, ${country}`,
            owner: req.user._id
        })
        const allArenas = await Arena.find({})
        // res.send(allArenas)

        const isMatch = (arena) => {
            for(let i = 0; i < allArenas.length; i++){
                if(allArenas[i].street === arena.street
                    && allArenas[i].city === arena.city
                    && allArenas[i].zipCode === arena.zipCode
                    && allArenas[i].country === arena.country){
                        return true
                }
            }
            return false
        }
        if(!isMatch(arena)){
            let arenas = []
            arenas.push(arena)
            // let distanceData = await calculateDistance(req.user, arenas)
            // let distance = distanceData.arenas[0].distance
            // let duration = distanceData.arenas[0].duration

            // arena.distance = distance
            // arena.duration = duration
            // req.user.hasCalledDistanceMatrixApi = distanceData.num
            await req.user.save()
            await arena.save()
            return res.send(arena)
        }
        res.send({error: "Arena already exists"})

    } catch (error) {
        res.status(500).send({error: "Error from MAIN: path='/api/arena': " + error})
    }
})

//UPDATE BY ID
router.patch('/api/arena/:id', auth, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = [
        "distance", "duration", "address", "name", "directionsToRefRoom"
    ]
    const isValidUpdate = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if(!isValidUpdate){
        return res.status(418).send({error: "Invalid Update"})
    }
    try {
        const arena = await Arena.findOne({owner: req.user._id, _id})
        if(!arena){
            return res.status(404).send({error: "Arena not found"})
        }
        updates.forEach((update) => {
            arena[update] = req.body[update]
        })
        await arena.save()
        res.send(arena)
    } catch (error) {
        res.status(500).send(error)
    }
})

//GET ARENA by ID
// router.get('/api/arena/:id', auth, async (req, res) => {
    
// })

//GET ALL ARENAS
router.get('/api/arena/all', auth, async (req, res) => {
    try {
        let arenas = await Arena.find({owner: req.user._id})
        if(!arenas){
            arenas = []
        }
        res.send(arenas)
    } catch (error) {
        res.status(500).send({error: "Error in get all arenas: " + error})
    }
})

//DELETE ARENA
// router.delete('/api/arena/:id', auth, async (req, res) => {
    
// })

module.exports = router