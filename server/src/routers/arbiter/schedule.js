const express = require('express')
const router = new express.Router()
const puppeteer = require('puppeteer')
const Game = require('../../models/Game')
const auth = require('../../middleware/auth')
const addGamesFromArray = require('../../utils/addGamesFromArray')
const { encryptPlainText, decrpytPlainText } = require('../../utils/crypto')


const parseGame = (html) => {
    if(!html[0].includes("</a>")){
        html = html.splice(1)
    }
    let game = {
        gameId: html[0],
        group: html[2],
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

    game.group = game.group.split('</span>').shift()
    game.group = game.group.split('').reverse().join('').split('>').shift()
    game.group = game.group.split('').reverse().join('')

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
    let response = ''
    const browser = await puppeteer.launch({headless: true})
    const page = await browser.newPage()
    await page.setViewport({
        width: 2000,
        height: 1500,
        deviceScaleFactor: 1
    })
    await page.goto('https://www1.arbitersports.com/shared/signin/signin.aspx');
    await page.click('#txtEmail')
    await page.keyboard.type(email)
    await page.click('#txtPassword')
    await page.keyboard.type(pass)
    await page.click('#ctl00_ContentHolder_pgeSignIn_conSignIn_btnSignIn')
    await page.content()
    if(page.url() === 'https://www1.arbitersports.com/shared/signin/signin.aspx') {
        return { error: "Invalid Login"}
    }
    await page.click('#mobileAlertStayLink')
    await page.goto('https://www1.arbitersports.com/Official/GameScheduleEdit.aspx')
    await page.content()
    await page.click('tr.alternatingItems:nth-child(7)')
    await page.content()
    await page.goto('https://www1.arbitersports.com/Official/GameScheduleEdit.aspx')

    await page.content()
    await page.select('#ddlDateFilter', '9')
    await page.click('#btnApplyFilter')
    await page.waitFor(5000)
    
    response = await page.content()
    response = response.toString()
    response = response.split('ctl00_ContentHolder_pgeGameScheduleEdit_conGameScheduleEdit_dgGames')
    response = response.splice(2)
    response = response.join('').split('ctl00_ContentHolder_pgeGameScheduleEdit_conGameScheduleEdit_lnkTrigger')
    response = response.splice(0, 1)
    return response
}

const htmlItemToJson = (item) => {
    item = item.split('<td')
    item = parseGame(item)
    return item
}


router.get('/api/arbiter/schedule', auth, async (req, res) => {
    const userEmail = req.user.asEmail
    const userPass = decrpytPlainText(req.user.asPassword)
    const owner = req.user._id
    
    try {
        const currentSchedule = await Game.find({owner})
        let htmlSchedule = await getArbiterSchedule(userEmail, userPass)
        if(htmlSchedule.error){
            return res.send({error: "Invalid Login"})
        }
        //at this point, we have the beginning to the end of all the schedule data
        //next we need to figure out how to single out all of the elements
        // EACH game is it's own TR
        let allGamesHtmlArray = htmlSchedule.join('').split('<tr')
        // EACH element starts with TD
        let arbiterSchedule = []
        allGamesHtmlArray.map((item) => {
            item = htmlItemToJson(item)
            arbiterSchedule.push(item)
        })
        //CHECK FOR DUPLICATES
        // ARBITER SCHEDULE ARRAY OF OBJECTS
        // DATABASE SCHEDULE ARRAY OF OBJECTS

        // FOR EVERY ITEM/OBJECT IN THE ARBITER ARRAY CHECK IF THERE IS A MATCH IN THE DATABASE
        // IF THERE IS A MATCH, DON'T ADD IT TO THE NEW ARRAY

        // arbiterSchedule = arbiterSchedule.splice(0, 5)
        const newGamesToBeAdded = await addGamesFromArray(arbiterSchedule, "Arbiter Sports", owner, currentSchedule)

        res.send(newGamesToBeAdded)
    } catch (error) {
        res.status(418).send({error: `Error in Arbiter/Schedule/MAIN: ${error}`})
    }
    
})

module.exports = router