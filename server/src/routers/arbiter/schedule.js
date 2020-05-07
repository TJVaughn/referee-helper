const express = require('express')
const router = new express.Router()
const Game = require('../../models/Game')
const auth = require('../../middleware/auth')
const addGamesFromArray = require('../../utils/addGamesFromArray')
const { decryptPlainText } = require('../../utils/crypto')
const  { arbiterScheduleLogin, arbiterScheduleSetAllGames, getArbiterSchedule } = require('./functions/getArbiterSchedule')
const parseSchedule = require('./functions/parseSchedule')
const superagent = require('superagent')
// const arbiterLogin = require('./functions/arbiterLogin')

router.get('/api/arbiter/schedule/login', auth, async (req, res) => {
    try {
        const userEmail = req.user.asEmail
        const userPass = decryptPlainText(req.user.asPassword)
        const browserWSEndpoint = await arbiterScheduleLogin(userEmail, userPass)
        return res.send({browserWSEndpoint})
        
    } catch (error) {
        res.status(500).send({error: `Error in Arbiter/Schedule/login: ${error}`})
    }
    
})
router.post('/api/arbiter/schedule/set-schedule', auth, async (req, res) => {
    try {   
        const browserWSEndpoint = req.body.browserWSEndpoint
        await arbiterScheduleSetAllGames(browserWSEndpoint)
        return res.send({browserWSEndpoint})
    } catch (error) {
        res.status(500).send({error: `Error in Arbiter/Schedule/setSchedule: ${error}`})
    }
})
router.post('/api/arbiter/schedule/schedule', auth, async (req, res) => {
    try {
        let startTime = Date.now()
        let htmlSchedule = await getArbiterSchedule(req.body.browserWSEndpoint)
        if(htmlSchedule.error){
            return res.send({error: "Error: " + htmlSchedule.error})
        }
        const parsedSchedule = await parseSchedule(htmlSchedule)
        let endTime = Date.now()
        let secsElapsed = Math.floor((endTime - startTime) / 1000)
        console.log("Got Arbiter Schedule: " + secsElapsed)
        res.send(parsedSchedule)
    } catch (error) {
        res.status(500).send({error: `Error in Arbiter/Schedule/schedule: ${error}`})
    }

})

// router.post('/api/arbiter/schedule/', auth, async (req, res) => {
//     try {
//         console.log("Starting parse")
//         let startTime = Date.now()
//         const owner = req.user
//         const currentSchedule = await Game.find({owner})
//         let [htmlSchedule] = req.body.schedule
//         htmlSchedule = htmlSchedule.split('ctl00_ContentHolder_pgeGameScheduleEdit_conGameScheduleEdit_dgGames')
//         htmlSchedule = htmlSchedule.splice(2)
//         htmlSchedule = htmlSchedule.join('').split('ctl00_ContentHolder_pgeGameScheduleEdit_conGameScheduleEdit_lnkTrigger')
//         htmlSchedule = htmlSchedule.splice(0, 1)

//         if(htmlSchedule.error){
//             return res.send({error: "Invalid Login"})
//         }
//         let allGamesHtmlArray = htmlSchedule.join('').split('<tr')
//         let arbiterSchedule = []
//         allGamesHtmlArray.map((item) => {
//             item = htmlItemToJson(item)
//             arbiterSchedule.push(item)
//         })

//         const newGamesToBeAdded = await addGamesFromArray(arbiterSchedule, "Arbiter Sports", owner, currentSchedule)
//         let endTime = Date.now()
//         secsElapsed = Math.floor((endTime - startTime) / 1000)
//         console.log("Parsing Time: " + secsElapsed)
//         res.send(newGamesToBeAdded)
//     } catch (error) {
//         res.status(500).send({error: `Error in Arbiter/Schedule/parse: ${error}`})
//     }
// })

module.exports = router