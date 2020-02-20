const express = require('express')
const router = new express.Router()
const Arena = require('../models/Arena')
const auth = require('../middleware/auth')

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

//CREATE
// router.post('/api/arena', auth, async (req, res) => {

// })

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