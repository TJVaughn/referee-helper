const express = require('express')
const router = new express.Router()
const https = require('https')
const puppeteer = require('puppeteer')

const getArbiterSchedule = async (email, pass) => {
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
    await page.setRequestInterception(true)
    page.on('request', (request) => {
        if(request.resourceType == 'stylesheet'){
            request.abort()
        } else {
            request.continue()
        }
    })
    return await page.content()
}

router.get('/api/arbiter/schedule', async (req, res) => {
    const userEmail = req.body.email
    const userPass = req.body.password
    let htmlSchedule = await getArbiterSchedule(userEmail, userPass)
    htmlSchedule = htmlSchedule.toString()
    htmlSchedule = htmlSchedule.toLowerCase().split('<tbody>')
    let unimportant = htmlSchedule.splice(0, 6)
    unimportant = htmlSchedule.splice(1, 3)
    // Now we just have the schedule table in HTML
    // We need to remove all of the html elements from this
    htmlSchedule = htmlSchedule.toString().split('')
    let filteredSchedule = htmlSchedule.filter((item) => {
        return item
    })
    filteredSchedule = filteredSchedule.join('').split('<tr')
    unimportant = filteredSchedule.splice(0, 1)
    unimportant = filteredSchedule.pop()
    unimportant = filteredSchedule.shift()
    filteredSchedule = filteredSchedule.join('').split('<br>').join('').split('</td>').join('').split('</span>').join('').split(`>`)
    unimportant = filteredSchedule.splice(0, 3)
    unimportant = filteredSchedule.splice(1, 10)
    unimportant = filteredSchedule.splice(2, 2)
    unimportant = filteredSchedule.splice(3, 1)
    unimportant = filteredSchedule.splice(4, 1)
    unimportant = filteredSchedule.splice(5, 1)
    unimportant = filteredSchedule.splice(6, 2)
    unimportant = filteredSchedule.splice(7, 2)
    unimportant = filteredSchedule.splice(8, 1)
    unimportant = filteredSchedule.splice(9, 9)
    let game = filteredSchedule.splice(0, 9)

    // game = game.toString()
    console.log(game)
    let trimmedGame = []
    let newGame = game.forEach((item) => {
        item = item.toString().split('</a')
        trimmedGame = item.unshift(item[0])
        console.log(trimmedGame)
    })
    // game = game.filter((item) => {return item})
    // game = game.join('').split('<').join('').split(',').join('').trim().split('').join('').trim().split('')
    res.send(trimmedGame)
})

module.exports = router