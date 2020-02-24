const express = require('express')
const router = new express.Router()
const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')

const parseGame = (html) => {
    let game = {
        id: html[0],
        group: html[1],
        position: html[2],
        date: html[3],
        level: html[4],
        location: html[5],
        home: html[6],
        away: html[7],
        fee: html[8]
    }
    game.id = game.id.split('<').shift()
    game.group = game.group.replace(/(\n|\t)/, "***").split('***').shift()
    game.position = game.position.replace(/(\n|\t)/, "***").split('***').shift()
    game.date = game.date.replace(/(\n|\t)/, "***").split('***').shift()
    game.level = game.level.replace(/(\n|\t)/, "***").split('***').shift()
    game.location = game.location.split('<').shift()
    game.home = game.home.split('<').shift()
    game.away = game.away.replace(/(\n|\t)/, "***").split('***').shift()
    game.fee = game.fee.replace(/(\n|\t)/, "***").split('***').shift()
    return game
}

const removeUnnecessary = (array) => {
    let unimportant = []
    unimportant = array.splice(1, 10)
    unimportant = array.splice(2, 2)
    unimportant = array.splice(3, 1)
    unimportant = array.splice(4, 1)
    unimportant = array.splice(5, 1)
    unimportant = array.splice(6, 2)
    unimportant = array.splice(7, 2)
    unimportant = array.splice(8, 1)
    unimportant = array.splice(9, 9)
    delete unimportant;
    let gameToBeParsed = array.splice(0, 9)
    return gameToBeParsed
}
const removeUnnecessaryTwo = (array) => {
    let unimportant = []
    unimportant = array.splice(1, 9)
    unimportant = array.splice(2, 2)
    unimportant = array.splice(3, 1)
    unimportant = array.splice(4, 1)
    unimportant = array.splice(5, 1)
    unimportant = array.splice(6, 2)
    unimportant = array.splice(7, 2)
    unimportant = array.splice(8, 1)
    unimportant = array.splice(9, 9)
    delete unimportant;
    let gameToBeParsed = array.splice(0, 9)
    return gameToBeParsed
}

const removeUnnecessaryLast = (array) => {
    let unimportant = []
    unimportant = array.splice(1, 9)
    unimportant = array.splice(2, 2)
    unimportant = array.splice(3, 1)
    unimportant = array.splice(4, 1)
    unimportant = array.splice(5, 1)
    unimportant = array.splice(6, 2)
    unimportant = array.splice(7, 2)
    unimportant = array.splice(8, 1)
    unimportant = array.splice(9, 5)
    delete unimportant;
    let gameToBeParsed = array.splice(0, 9)
    return gameToBeParsed
}

const getArbiterSchedule = async (email, pass, getAll = false) => {
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
    await page.click('#mobileAlertStayLink')
    await page.goto('https://www1.arbitersports.com/Official/GameScheduleEdit.aspx')
    await page.content()
    await page.click('tr.alternatingItems:nth-child(7)')
    await page.content()
    await page.goto('https://www1.arbitersports.com/Official/GameScheduleEdit.aspx')

    if(getAll){
        await page.content()
        await page.select('#ddlDateFilter', '9')
        await page.click('#btnApplyFilter')
        await page.waitFor(5000)
        // await page.content()
        response = await page.content()
        response = response.toString()
        response = response.split('ctl00_ContentHolder_pgeGameScheduleEdit_conGameScheduleEdit_dgGames')
        response = response.splice(2)
        response = response.join('').split('ctl00_ContentHolder_pgeGameScheduleEdit_conGameScheduleEdit_lnkTrigger')
        response = response.splice(0, 1)
        //at this point, we have the beginning to the end of all the schedule data
        //next we need to figure out how to single out all of the elements
        return response
    }
    response = await page.content()
    response = response.toString()
    response = response.split('ctl00_ContentHolder_pgeGameScheduleEdit_conGameScheduleEdit_dgGames')
    response = response.splice(2)
    response = response.join('').split('ctl00_ContentHolder_pgeGameScheduleEdit_conGameScheduleEdit_lnkTrigger')
    response = response.splice(0, 1)
    return response
}

router.get('/api/arbiter/schedule', async (req, res) => {
    const userEmail = req.body.email
    const userPass = req.body.password
    let htmlSchedule = await getArbiterSchedule(userEmail, userPass)
    //at this point, we have the beginning to the end of all the schedule data
    //next we need to figure out how to single out all of the elements
    // EACH game is it's own TR
    htmlSchedule = htmlSchedule.join('').split('<tr')
    // EACH element starts with TD
    res.send(htmlSchedule)

})

router.get('/api/html-all', async (req, res) => {
    res.sendFile(path.join(__dirname + '/schedule.html'))
})

module.exports = router