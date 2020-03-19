const express = require('express')
const router = new express.Router()
const puppeteer = require('puppeteer')
const Game = require('../../models/Game')
const auth = require('../../middleware/auth')
const addGamesFromArray = require('../../utils/addGamesFromArray')


const parseHTML = async (html) => {
    let payData = html
    payData = payData.splice(2)

    payData = payData.map((item) => {
        return item.trim()
    })
    payData = payData.filter((i) => {
        if(i){
            return i
        }
    })
    payData = payData.splice(0, payData.length - 1)

    let eachPaymentArrOfObj = []
    while(payData.length > 0){
        let eachGame = payData.splice(0, 6)
        eachPaymentArrOfObj.push({
            transactionId: eachGame[0],
            amount: eachGame[1],
            status: eachGame[2],
            created: eachGame[3],
            executed: eachGame[4],
            description: eachGame[5]
        })
        // console.log(eachGame)
    }
    
    return eachPaymentArrOfObj
}

const getArbiterPaymentData = async (email, pass) => {
    const browser = await puppeteer.launch({
        // headless: false,
        // args: [
        //     '--window-size=1500,825'
        // ]
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
    await page.click('#mobileAlertStayLink')
    await page.screenshot({path: './screenshotb4.png'})

    await page.content()
    await page.click('#ctl00_ContentHolder_pgeDefault_conDefault_dgAccounts_ctl02_lblType2')
    await page.content()
    await page.goto('https://www1.arbitersports.com/arbiterone/arbiterpay/dashboard')
    await page.content()
    await page.goto('https://www1.arbitersports.com/ArbiterOne/ArbiterPay/AccountHistory')
    await page.content()
    await page.waitFor(750)
    await page.click('.as_pageSizer > button:nth-child(1)')
    await page.waitFor(750)
    await page.click('.as_pageSizer > ul:nth-child(2) > li:nth-child(6) > a:nth-child(1)')
    await page.waitFor(500)
    await page.screenshot({path: './screenshot.png'})

    let response = await page.content()
    response = response.split('account-history-rows')
    response = response.splice(1)
    response = response[0].split('</tbody>').shift()
    response = response.split('</td>').join('').split('<td>').join('').split('</tr>').join('').split('<tr class="child">').join('').split('<tr class="parent">').join('')
    response = response.split('<td class="action"><i class="icon-more"></i>').join('').split('<td colspan="7">').join('').split(/\n/)
    let data = parseHTML(response)
    return data
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