const express = require('express')
const router = new express.Router()
const puppeteer = require('puppeteer')
const Game = require('../../models/Game')
const auth = require('../../middleware/auth')
const { encryptPlainText, decrpytPlainText } = require('../../utils/crypto')

const removePastGames = (games) => {
    const today = new Date()
    let futureGames = []

    for(let i = 0; i < games.length; i++){
        // console.log("Game: ", games[i].dateTime)
        if(games[i].dateTime > today){
            futureGames.push(games[i])
        }
    }
    return futureGames;
}

const setBlocks = async (email, pass, futureGames) => {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--window-size=1500,825'
        ]
    })
    const page = await browser.newPage()
    await page.setViewport({
        height: 825,
        width: 1500
    })
    await page.goto('https://www1.arbitersports.com/shared/signin/signin.aspx');
    await page.click('#txtEmail')
    await page.keyboard.type(email)
    await page.click('#txtPassword')
    await page.keyboard.type(pass)
    await page.click('#ctl00_ContentHolder_pgeSignIn_conSignIn_btnSignIn')
    await page.waitFor(1000)
    if(page.url() === 'https://www1.arbitersports.com/shared/signin/signin.aspx') {
        return { error: "Invalid Login"}
    }
    // if(page.click('#mobileAlertStayLink')){
    //     await page.click('#mobileAlertStayLink')
    // }
    await page.goto('https://www1.arbitersports.com/Official/GameScheduleEdit.aspx')
    await page.waitFor(1000)
    await page.click('tr.alternatingItems:nth-child(7)')
    await page.waitFor(500)
    await page.goto('https://www1.arbitersports.com/Official/BlockDates.aspx')
    await page.waitFor(500)
    await page.click('#ctl00_ContentHolder_pgeBlockDates_sbrAction_rbtPartDay')
    await page.waitFor(2000)
    await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_chkSun')
    await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_chkMon')
    await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_chkTue')
    await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_chkWed')
    await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_chkThu')
    await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_chkFri')
    await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_chkSat')

    // iterate over the current games array and set appropriate blocks
    for(let i = 0; i < futureGames.length; i++){
        let blockStartDate = futureGames[i].dateTime.toLocaleDateString()
        console.log("Block Start Date: ", blockStartDate)
        await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_txtFromDay')
        for(let x = 0; x < 10; x++){
            await page.keyboard.down('Backspace')
            await page.keyboard.down('Delete')
        }
        await page.keyboard.type(blockStartDate)
        await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_txtToDay')
        for(let x = 0; x < 10; x++){
            await page.keyboard.down('Backspace')
            await page.keyboard.down('Delete')
        }
        await page.keyboard.type(blockStartDate)

        let gameStartTime = futureGames[i].dateTime
        // console.log("Game Start: ", gameStartTime.toLocaleTimeString())

        let blockStart = gameStartTime.setHours(gameStartTime.getHours() - 2)
        blockStart = new Date(blockStart)

        if(blockStart.getMinutes() !== (15 || 30 || 45)){
            let blockMins = blockStart.getMinutes();
            if(blockMins >= 45 && blockMins < 59){
                blockStart.setMinutes(45)
            } else if(blockMins >= 30){
                blockStart.setMinutes(30)
            } else if(blockMins >= 15){
                blockStart.setMinutes(15)
            } else {
                blockStart.setMinutes(0)
            }
            blockStart = new Date(blockStart)
        }

        let blockStartTime = blockStart;
        let blockEndTime = blockStart;

        blockStartTime = blockStartTime.toLocaleTimeString().split('').reverse()
        blockStartTime.splice(3, 3)
        blockStartTime = blockStartTime.join('').split('').reverse().join('')
        
        // console.log("Block Start: ", blockStartTime)
        await page.select('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_ddlFromTime', blockStartTime)
        await page.waitFor(500)

        blockEndTime = blockEndTime.setHours(blockEndTime.getHours() + 5)
        blockEndTime = new Date(blockEndTime)

        blockEndTime = blockEndTime.toLocaleTimeString()
        blockEndTime = blockEndTime.split('').reverse()
        blockEndTime.splice(3, 3)
        blockEndTime = blockEndTime.join('').split('').reverse().join('')
        
        // console.log("Block End Time", blockEndTime)
        // await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_ddlToTime')
        await page.select('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_ddlToTime', blockEndTime)
        await page.waitFor(500)

        await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_btnRangeApply')
        await page.waitFor(1500)
    }

    let response = await page.content()
    return response
}

router.get('/api/arbiter/blocks', auth, async (req, res) => {
    // Gets all of your games in the database
    // Checks if the game is today, or in the future -- adds to array
    // If so, for every game in that array we will execute a block generation
    // Go to AS
    // Login
    // Navigate to blocks page
    // Iterate over array 
    try {
        const games = await Game.find({owner: req.user._id})
        let futureGames = removePastGames(games)
        const asPass = decrpytPlainText(req.user.asPassword)
        console.log(asPass)
        let response = await setBlocks(req.user.asEmail, asPass, futureGames)
        res.send(response)
    } catch (error) {
        res.status(418).send({error: `Error from api/arbiter/blocks: ${error}`})
    }
    
})

module.exports = router;