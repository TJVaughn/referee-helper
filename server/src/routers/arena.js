const express = require('express')
const router = new express.Router()
const Arena = require('../models/Arena')
const auth = require('../middleware/auth')
const superagent = require('superagent')

//Get PlaceID by search
// router.post('/api/search', auth, async (req, res) => {

    //user will post data to this request, or maybe just put it as a param
    //I will make sure that the user has an address, or maybe I will just require it on signup
    //Then from here I will make a server request to the maps API
    //Then I will grab the place ID
    //Then I will get the distance to the rink from the users address
    //I will also get the rink address details
    //Then I will return that data to the front end
    //Then I will handle errors if they exist


// })

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
            "name": name,
            "street": street,
            "city": city,
            "state": state,
            "zipCode": zipCode,
            "country": country
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
            await arena.save()
            res.send(arena)
        }
        res.send({error: "Arena already exists"})

    } catch (error) {
        res.status(500).send({err: "Error from MAIN: path='/api/arena': " + error})
    }
})

//UPDATE BY ID
// router.patch('/api/arena/:id', auth, async (req, res) => {
    
// })

//GET ARENA by ID
// router.get('/api/arena/:id', auth, async (req, res) => {
    
// })

//GET ALL ARENAS
// router.get('/api/arena/all', auth, async (req, res) => {
    
// })

//DELETE ARENA
// router.delete('/api/arena/:id', auth, async (req, res) => {
    
// })

module.exports = router