const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Game = require('../models/Game')

// CREATE GAME
router.post('/api/game', auth, async (req, res) => {
    const game = new Game({
        ...req.body,
        owner: req.user._id,
        status: "normal"
    })
    try {
        await game.save()
        res.send(game)
    } catch (error) {
        res.status(418).send(error)
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
        "dateTime", "completed", "fees", "status", "refereeGroup", "location", "platform", "level"
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

// GET ALL GAMES WITH SORTING FEATURES
// router.get(`/api/game/all-games`, auth, async (req, res) => {

// })

module.exports = router