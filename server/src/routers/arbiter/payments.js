const express = require('express')
const router = new express.Router()
const puppeteer = require('puppeteer')
const Game = require('../../models/Game')
const auth = require('../../middleware/auth')
const addGamesFromArray = require('../../utils/addGamesFromArray')

const getArbiterPaymentData = async (email, pass) => {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--window-size=1500,825'
        ]
    })
    const page = await browser.newPage()
    await page.setViewport({
        width: 1500,
        height: 825,
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
    await page.waitFor(500)
    await page.click('#ctl00_ContentHolder_pgeDefault_conDefault_dgAccounts_ctl02_lblType2')
    await page.content()
    // await page.click('#mobileAlertStayLink')
    await page.goto('https://www1.arbitersports.com/arbiterone/arbiterpay/dashboard')
    await page.content()
    await page.goto('https://www1.arbitersports.com/ArbiterOne/ArbiterPay/AccountHistory')
    await page.content()
    await page.waitFor(500)

    await page.click('.as_pageSizer > button:nth-child(1)')
    await page.waitFor(500)
    await page.click('.as_pageSizer > ul:nth-child(2) > li:nth-child(6) > a:nth-child(1)')
    await page.waitFor(500)
    let response = await page.content()
    return response
}

router.post('/api/arbiter/payments', auth, async (req, res) => {
    try {
        const owner = req.user._id
        const email = req.body.email
        const password = req.body.password
        const currentSchedule = await Game.find({owner})
        const paymentData = await getArbiterPaymentData(email, password)
        res.send(paymentData)
    } catch (error) {
        res.status(418).send({error: `Error in Arbiter/Payments/MAIN: ${error}`})
    }
})

module.exports = router;