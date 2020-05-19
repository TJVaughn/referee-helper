const express = require('express')
const router = new express.Router()
const auth = require('../../../middleware/auth')
const { decryptPlainText } = require('../../../utils/crypto')
const Game = require('../../../models/Game')
const removePastGames = require('../../functions/removePastGames')
const removePlatformGames = require('../../functions/removePlatformGames')
const setBlocks = require('./functions/setBlocks')


router.post('/api/horizon/blocks', auth, async (req, res) => {
    try {

        // const username = req.user.hwrUsername
        // const password = decryptPlainText(req.user.hwrPassword)
        // const owner = req.user
        // const currentSchedule = await Game.find({owner})
        // const futureGames = removePastGames(currentSchedule)
        // const allGamesNotOnThisPlatform = removePlatformGames(futureGames)
        // const hoursPrior = req.body.hoursPrior
        // const hoursAfter = req.body.hoursAfter
        // const allDayBlocksForEachGame = req.body.allDayBlocksForEachGame

        // const blocks = await setBlocks(username, password, allGamesNotOnThisPlatform, hoursPrior, hoursAfter, allDayBlocksForEachGame)
        res.send(job)
    } catch (error) {
        
    }
})

module.exports = router;