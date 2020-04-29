const express = require('express')
const router = new express.Router()
const puppeteer = require('puppeteer')
const Game = require('../../models/Game')
const auth = require('../../middleware/auth')
const addGamesFromArray = require('../../utils/addGamesFromArray')
const { decryptPlainText } = require('../../utils/crypto')


const parseGame = (html) => {
    if(!html[0].includes("</a>")){
        html = html.splice(1)
    }
    let game = {
        gameId: html[0],
        group: {
            title: html[2],
            value: html[2],
        },
        position: html[3],
        dateTime: html[4],
        level: html[5],
        location: html[6],
        home: html[7],
        away: html[8],
        fees: html[9],
        status: html[10]
    }
    game.gameId = game.gameId.split('</a').shift()
    game.gameId = game.gameId.split('').reverse().splice(0, 8)
    game.gameId = game.gameId.reverse().join('').split('>').pop()

    game.group.value = game.group.value.split('</span>').shift()
    game.group.value = game.group.value.split('').reverse().join('').split('>').shift()
    game.group.value = game.group.value.split('').reverse().join('')

    game.group.title = game.group.title.split('title').splice(1, 1)
    game.group.title = game.group.title.join('').split(/\"/).splice(1, 1)
    game.group.title = game.group.title[0].trim()
    // game.group.title = game.group.title.split(/\"/).splice(7, 1)
    // game.group.title = game.group.title[0].trim()

    game.position = game.position.split('</span>').shift()
    game.position = game.position.split('').reverse().join('').split('>').shift()
    game.position = game.position.split('').reverse().join('')

    game.dateTime = game.dateTime.split('</span').shift()
    game.dateTime = game.dateTime.replace('<br>', '')
    game.dateTime = game.dateTime.split('').reverse().join('').split('>').shift()
    game.dateTime = game.dateTime.split('').reverse().join('').toLowerCase().replace(/sat|sun|mon|tue|wed|thu|fri/, '')
    game.dateTime = new Date(game.dateTime)

    game.level = game.level.split('evel').pop()
    game.level = game.level.split('</span').shift()
    game.level = game.level.split('>').pop()
    
    game.location = game.location.split('</a>').shift()
    game.location = game.location.split('').reverse().join('').split('>').shift()
    game.location = game.location.split('').reverse().join('')
    
    game.home = game.home.split('</a>').shift()
    game.home = game.home.split('').reverse().join('').split('>').shift()
    game.home = game.home.split('').reverse().join('')

    game.away = game.away.split('</span>').shift()
    game.away = game.away.split('').reverse().join('').split('>').shift()
    game.away = game.away.split('').reverse().join('')
    
    game.fees = game.fees.split('</span>').shift()
    game.fees = game.fees.split('').reverse().join('').split('>').shift()
    game.fees = game.fees.split('').reverse().join('').replace('$', '').replace('.', '')

    if(game.status){
        game.status = game.status.split('</span>').shift()
        game.status = game.status.split('').reverse().join('').split('>').shift()
        game.status = game.status.split('').reverse().join('')
    }
    if(!game.status){
        game.status = "normal"
    }
    return game
}

const getArbiterSchedule = async (email, pass) => {
    try {
        const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--window-size=1500,825', 
            '--no-sandbox'
        ]
    })
    const page = await browser.newPage()
    await page.setViewport({
        width: 1500,
        height: 825,
        deviceScaleFactor: 1
    })
    await page.goto('https://www1.arbitersports.com/shared/signin/signin.aspx')
    await page.waitFor(1000)
    await page.click('#txtEmail')
    await page.keyboard.type(email)
    await page.click('#txtPassword')
    await page.keyboard.type(pass)
    await page.click('#ctl00_ContentHolder_pgeSignIn_conSignIn_btnSignIn')
    if(page.url() === 'https://www1.arbitersports.com/shared/signin/signin.aspx') {
        return { error: "Invalid Login"}
    }
    await page.waitFor(1000)

    await page.goto('https://www1.arbitersports.com/Official/GameScheduleEdit.aspx')
    await page.waitFor(750)
    await page.screenshot({path: './screenshot.png'})
    await page.click('#mobileAlertStayLink')
    await page.waitFor(750)

    await page.click('tr.alternatingItems:nth-child(7)')
    await page.waitFor(500)
    await page.goto('https://www1.arbitersports.com/Official/GameScheduleEdit.aspx')

    await page.content()
    await page.select('#ddlDateFilter', '9')
    await page.click('#btnApplyFilter')
    await page.waitFor(3000)
    
    let response = await page.content()
    response = response.toString()
    response = response.split('ctl00_ContentHolder_pgeGameScheduleEdit_conGameScheduleEdit_dgGames')
    response = response.splice(2)
    response = response.join('').split('ctl00_ContentHolder_pgeGameScheduleEdit_conGameScheduleEdit_lnkTrigger')
    response = response.splice(0, 1)
    await browser.close()
    return response
    } catch (error) {
        return ({error: `Error From puppeteer: ${error}`})
    }
    
}

const htmlItemToJson = (item) => {
    item = item.split('<td')
    item = parseGame(item)
    return item
}


router.get('/api/arbiter/schedule', auth, async (req, res) => {
    try {
        const userEmail = req.user.asEmail
        const userPass = decryptPlainText(req.user.asPassword)
        const owner = req.user
        const currentSchedule = await Game.find({owner})
        let startTime = Date.now()
        let htmlSchedule = await getArbiterSchedule(userEmail, userPass)
        if(htmlSchedule.error){
            return res.send({error: "Error: " + htmlSchedule.error})
        }
        let endTime = Date.now()
        let secsElapsed = Math.floor((endTime - startTime) / 1000)
        console.log("Got Arbiter Schedule: " + secsElapsed)
        if(htmlSchedule.error){
            return res.send({error: "Invalid Login"})
        }
        startTime = Date.now()
        let allGamesHtmlArray = htmlSchedule.join('').split('<tr')
        let arbiterSchedule = []
        allGamesHtmlArray.map((item) => {
            item = htmlItemToJson(item)
            arbiterSchedule.push(item)
        })

        const newGamesToBeAdded = await addGamesFromArray(arbiterSchedule, "Arbiter Sports", owner, currentSchedule)
        endTime = Date.now()
        secsElapsed = Math.floor((endTime - startTime) / 1000)
        console.log("Parsing Time: " + secsElapsed)
        res.send(newGamesToBeAdded)
    } catch (error) {
        res.status(418).send({error: `Error in Arbiter/Schedule/MAIN: ${error}`})
    }
    
})

module.exports = router