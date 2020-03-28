const express = require('express')
const router = new express.Router()
const puppeteer = require('puppeteer')
const Game = require('../../models/Game')
const auth = require('../../middleware/auth')
const addGamesFromArray = require('../../utils/addGamesFromArray')
const { decryptPlainText } = require('../../utils/crypto')

const parseEachGame = (html, group) => {
    //Games array with each item in the array being a raw game
    // for each game we need to apply the same parsing code
    // then return the games as an array of JSON friendly objects
    try {
        html = html.split('</td')
        let game = {
            dateTime: '',
            level: html[3],
            home: html[4],
            away: html[5],
            location: html[6],
            fees: html[7],
            group: group,
            position: 'Referee',
            paid: false,
            gameId: html[0],
            paid: html[8]
            // whole: html
        }
        let date = html[1]
        let time = html[2]

        date = date.split('<br>').pop()
        date = date.replace(/\n/, '')
        date = date.toLowerCase()

        time = time.replace('</a>', '').split('').reverse().join('').split('>').shift()
        time = time.split('').reverse().join('')
        time = time.split('').reverse()
        time.splice(2, 0, ' ')
        time = time.join('').split('').reverse().join('')
        time = time.toLowerCase()
        game.dateTime = new Date(`${date} ${time}`)
        
        if(time.includes('t ba')){
            game.dateTime = new Date(`${date} 12:00 AM`)
        }

        game.level = game.level.split('').reverse().join('').replace(/\n/, '*').split('*').shift()
        game.level = game.level.split('').reverse().join('')

        game.home = game.home.replace('</a>', '').split('').reverse().join('').split('>').shift()
        game.home = game.home.split('').reverse().join('')

        game.away = game.away.replace('</a>', '').split('').reverse().join('').split('>').shift()
        game.away = game.away.split('').reverse().join('')

        game.location = game.location.split('</a>').shift()
        game.location = game.location.split('').reverse().join('').split('>').shift()
        game.location = game.location.split('').reverse().join('')

        game.fees = game.fees.split('').reverse().splice(0, 5)
        game.fees = game.fees.join('').split('').reverse().join('').replace('.', '')

        game.status = 'normal'

        if(game.fees.includes('nbsp')){
            game.fees = 0
            game.status = 'canceled'
        }
        // game.status = 'UPDATED'
        game.gameId = game.gameId.replace(/\"/, '*')
        game.gameId = game.gameId.split('*').splice(1, 1)
        game.gameId = game.gameId[0].split('-').splice(1, 1)
        game.gameId = game.gameId[0].split(/\"/).shift()

        game.paid = game.paid.split('</b>').splice(0, 2)

        game.paid.ref = game.paid[0]
        game.paid.ref = game.paid.ref.split('<i>').pop()

        game.paid.ass = game.paid[1]

        if(game.paid.ref === 'Payment Received'){
            game.paid.ass = game.paid.ass.split('<br>').pop()
            game.paid.ass = game.paid.ass.split('.').shift()
        } else {
            game.paid.ass = game.paid.ass.split('<i>').pop()
        }

        game.paid = {
            ref: game.paid.ref,
            ass: game.paid.ass
        }
        if(game.paid.ref === 'Payment Received' || game.paid.ass === 'Paid By Assignors Payroll' || game.paid.ass === 'PAID'){
            game.paid = true
        } else {
            game.paid = false
        }

        return game
    } catch (error) {
        return ({error: "Error from parseEachGame: " + error})
    }

}
const parseIntoGames = async (raw) => {
    try {
        raw = raw.toString().split('schedResults').splice(1)
        raw = raw.join('').split('<tbody').splice(6, 1)
        raw = raw.join('').split('<tr')
        const endSplice = raw.length - 6
        raw = raw.splice(2, endSplice)
        
        let gameContent = []
        for(let i = 0; i < raw.length; i++){
            if(raw[i].includes('Game Time')){
                gameContent.push(raw[i])
            }
        }
        return gameContent
    } catch (error) {
        return ({error: `Error From parser: ${error}`})
    }
}
const findRefGroup = (html) => {
    try {
        let group = []
        html = html.split(';')
        for(let i = 0; i<html.length; i++){
            if(html[i].includes('organization')){
                group.push(html[i])
            }
        }
        group = group.pop()
        group = group.split('=').pop()
        group = group.split(/"/).splice(1, 1)

        return group[0]
    } catch (error) {
        return {error: `Error in find Ref Group: ${error}`}
    }
    
}

const puppeteerFunction = async (username, password) => {
    try {
        const browser = await puppeteer.launch({ ignoreHTTPSErrors: true, headless: true, defaultViewport: {height: 1000, width: 1500}})
        const page = await browser.newPage()
        await page.setRequestInterception(true);
        page.on('request', request => {
            if (request.resourceType() === 'stylesheet') {
                request.abort();
            } else {
                request.continue();
            }
        })
        await page.goto('https://www.horizonwebref.com/?pageID=login', {waitUntil: 'networkidle2'})
        await page.click('#loginTable2 > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > input')
        await page.keyboard.type(username)
        await page.click("#password")
        await page.waitFor(750)
    
        await page.keyboard.type(password)
        await page.click('#loginsub')
    
        await page.content()
        await page.waitFor(500)
        await page.goto('https://www.horizonwebref.com/?pageID=1102')
        
        await page.click('#innerfiltbar')
        await page.waitFor(500)
        await page.click('#sdate2-display')
        await page.waitFor(500)
    
        await page.select('.ui-datepicker-year', '2018')
        await page.waitFor(500)
    
        await page.click('div.ui-datepicker-group:nth-child(1) > table:nth-child(2) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(7) > a:nth-child(1)')
        await page.waitFor(500)
    
        await page.click('#gobtn')
        await page.waitFor(1000)  
    
        const rawSchedule = await page.content()
        const refGroup = await findRefGroup(rawSchedule)
        let rawGames = await parseIntoGames(rawSchedule)
        let horizonSchedule = []
        rawGames.map((game) => {
            game = parseEachGame(game, refGroup)
            horizonSchedule.push(game)
        })
        let nextGames = []
        while (horizonSchedule.length % 50 === 0) {
            await page.click('#contentofpageid > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > center:nth-child(14) > a:nth-child(1) > img:nth-child(1)')
            await page.waitFor(1000)
            let nextPageRaw = await page.content()
            nextGames = await parseIntoGames(nextPageRaw)
            nextGames.map((game) => {
                game = parseEachGame(game, refGroup)
                horizonSchedule.push(game)
            })
        }
        // await page.screenshot({path: 'screenshot.png'})
        return horizonSchedule
    } catch (error) {
        return ({error: `Error From puppeteer: ${error}`})
    }
}

router.get('/api/horizon/schedule', auth, async (req, res) => {
    try {
        const username = req.user.hwrUsername
        const password = decryptPlainText(req.user.hwrPassword)
        const owner = req.user._id
        const currentSchedule = await Game.find({owner})
        let horizonSchedule = await puppeteerFunction(username, password)
        // res.send(horizonSchedule)
        let newGamesToBeAdded = await addGamesFromArray(horizonSchedule, "Horizon Web Ref", owner, currentSchedule)
        res.send(newGamesToBeAdded)
    } catch (error) {
        res.status(418).send({error: `Error in Horizon/Schedule/MAIN: ${error}`})
    }
})

module.exports = router