const express = require('express')
const router = new express.Router()
const puppeteer = require('puppeteer')
const Game = require('../../models/Game')
const auth = require('../../middleware/auth')

router.post('/api/horizon/schedule', auth, async (req, res) => {
    // const icalUrl = 'https://www.horizonwebref.com/syncICS?o=18XG&enc=4aa5c485bb4487de6dc293c742f652b988e5fe45'
    const username = req.body.username
    const password = req.body.password
    const browser = await puppeteer.launch({ ignoreHTTPSErrors: true, headless: true, defaultViewport: {height: 1000, width: 1500}})
    const page = await browser.newPage()
    await page.setRequestInterception(true);
    page.on('request', request => {
        if (request.resourceType() === 'style')
        request.abort();
        else
        request.continue();
    });
    await page.goto('https://www.horizonwebref.com/?pageID=login', {waitUntil: 'networkidle2'})
    await page.click('#loginTable2 > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > input')
    await page.keyboard.type(username)
    await page.click("#password")
    await page.waitFor(1000)

    await page.keyboard.type(password)
    await page.click('#loginsub')

    await page.content()
    await page.waitFor(1000)
    await page.goto('https://www.horizonwebref.com/?pageID=1102')
    
    await page.click('#innerfiltbar')
    await page.waitFor(1000)
    await page.click('#sdate2-display')
    await page.waitFor(1000)

    await page.select('.ui-datepicker-year', '2018')
    await page.waitFor(1000)

    await page.click('div.ui-datepicker-group:nth-child(1) > table:nth-child(2) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(7) > a:nth-child(1)')
    await page.waitFor(1000)

    await page.click('#gobtn')
    await page.waitFor(1000)
    await page.screenshot({path: 'screenshot.png'})

    let content = await page.content()
    content = content.toString().split('schedResults').splice(1)
    content = content.join('')
    res.send(content)
    await browser.close()
})

module.exports = router