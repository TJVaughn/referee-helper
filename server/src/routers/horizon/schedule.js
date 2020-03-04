const express = require('express')
const router = new express.Router()
const puppeteer = require('puppeteer')
const Game = require('../../models/Game')
const auth = require('../../middleware/auth')


const parseEachGame = html => {
    //Games array with each item in the array being a raw game
    // for each game we need to apply the same parsing code
    // then return the games as an array of JSON friendly objects
    try {
        html = html.split('</td')
        let game = {
            dateTime: '',
            type: html[3],
            home: html[4],
            away: html[5],
            arena: html[6],
            fees: html[7]
            // paid: html[8]
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

        game.type = game.type.split('').reverse().join('').replace(/\n/, '*').split('*').shift()
        game.type = game.type.split('').reverse().join('')

        game.home = game.home.replace('</a>', '').split('').reverse().join('').split('>').shift()
        game.home = game.home.split('').reverse().join('')

        game.away = game.away.replace('</a>', '').split('').reverse().join('').split('>').shift()
        game.away = game.away.split('').reverse().join('')

        game.arena = game.arena.split('</a>').shift()
        game.arena = game.arena.split('').reverse().join('').split('>').shift()
        game.arena = game.arena.split('').reverse().join('')

        game.fees = game.fees.split('').reverse().splice(0, 5)
        game.fees = game.fees.join('').split('').reverse().join('').replace('.', '')

        game.status = 'normal'

        if(game.fees.includes('nbsp')){
            game.fees = 0
            game.status = 'canceled'
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
        const refGroup = findRefGroup(rawSchedule)
        let rawGames = await parseIntoGames(rawSchedule)
        let horizonSchedule = []
        rawGames.map((game) => {
            game = parseEachGame(game)
            horizonSchedule.push(game)
        })
        let nextGames = []
        while (horizonSchedule.length % 50 === 0) {
            await page.click('#contentofpageid > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > center:nth-child(14) > a:nth-child(1) > img:nth-child(1)')
            await page.waitFor(1000)
            let nextPageRaw = await page.content()
            nextGames = await parseIntoGames(nextPageRaw)
            nextGames.map((game) => {
                game = parseEachGame(game)
                horizonSchedule.push(game)
            })
        }
        await page.screenshot({path: 'screenshot.png'})
        return {schedule: horizonSchedule, group: refGroup}
    } catch (error) {
        return ({error: `Error From puppeteer: ${error}`})
    }
}

router.post('/api/horizon/schedule', auth, async (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password
        const owner = req.user._id
        const currentSchedule = await Game.find({owner})
        let response = await puppeteerFunction(username, password)
        let horizonSchedule = response.schedule
        let newGamesToBeAdded = []

        const findMatchInDb = (object) => {
            for(let num = 0; num < currentSchedule.length; num++){
                if(object.dateTime.toString() === currentSchedule[num].dateTime.toString()){
                    return true
                }
            }
            return false
        }

        if(!horizonSchedule) {
            horizonSchedule = []
        }
        horizonSchedule.map((game) => {
            let isMatch = findMatchInDb(game)
            if(!isMatch){
                // console.log("NEW GAME ", item.gameId)
                return newGamesToBeAdded.push(game)
            }
            // console.log("Duplicate Game: ", item.gameId)
        })
        if(newGamesToBeAdded.length === 0){
            newGamesToBeAdded = []
        }
        newGamesToBeAdded.map((item) => {
                let game = new Game({
                    dateTime: item.dateTime,
                    refereeGroup: response.group,
                    level: item.type,
                    fees: item.fees,
                    location: item.arena,
                    home: item.home,
                    away: item.away,
                    platform: "Horizon Web Ref",
                    owner,
                    status: item.status,
                    paid: false
                })

                game.save()
        })
        res.send(newGamesToBeAdded)

    } catch (error) {
        res.status(418).send({error: "Error from main: " + error})
    }
})

module.exports = router