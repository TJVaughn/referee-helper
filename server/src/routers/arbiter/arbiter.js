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
    htmlSchedule = htmlSchedule.toLowerCase().split('>').join('').split('<').join('').split(' ')
    // htmlSchedule = htmlSchedule
    // for(let i = 0; i < htmlSchedule.length; i++){
    //     if(i === '<'){
    //         htmlSchedule = htmlSchedule.splice(i, 2)
    //     }
    // }
    // res.send(htmlSchedule)
    let filteredSchedule = htmlSchedule.filter((item) => {
        return item
    })
    res.send(filteredSchedule)
    // res.send(htmlSchedule)
})

module.exports = router