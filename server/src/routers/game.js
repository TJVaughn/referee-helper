const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Game = require('../models/Game')



router.post('/api/game', auth, async (req, res) => {
    const game = new Game({
        ...req.body,
        owner: req.user._id
    })
    try {
        await game.save()
        res.send(game)
    } catch (error) {
        res.status(418).send(error)
    }
})

module.exports = router