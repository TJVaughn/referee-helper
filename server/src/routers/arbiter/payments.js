const express = require('express')
const router = new express.Router()
// const puppeteer = require('puppeteer')
// const Game = require('../../models/Game')
const auth = require('../../middleware/auth')
// const { decryptPlainText } = require('../../utils/crypto')

// const parseHTML = async (html) => {
//     let payData = html
//     payData = payData.splice(2)

//     payData = payData.map((item) => {
//         return item.trim()
//     })
//     payData = payData.filter((i) => {
//         if(i){
//             return i
//         }
//     })
//     payData = payData.splice(0, payData.length - 1)

//     let eachPaymentArrOfObj = []
//     while(payData.length > 0){
//         let eachGame = payData.splice(0, 6)
//         eachPaymentArrOfObj.push({
//             transactionId: eachGame[0],
//             amount: eachGame[1],
//             status: eachGame[2],
//             created: eachGame[3],
//             executed: eachGame[4],
//             description: eachGame[5]
//         })
//         // console.log(eachGame)
//     }
//     // eachPaymentArrOfObj = eachPaymentArrOfObj.filter((payment) => {
//     //     if(!payment.amount.includes('-')){
//     //         return payment
//     //     }
//     // })
    
//     return eachPaymentArrOfObj
// }
// const trimHtmlData = async (html) => {
//     html = html.split('account-history-rows')
//     html = html.splice(1)
//     html = html[0].split('</tbody>').shift()
//     html = html.split('</td>').join('').split('<td>').join('').split('</tr>').join('').split('<tr class="child">').join('').split('<tr class="parent">').join('')
//     html = html.split('<td class="action"><i class="icon-more"></i>').join('').split('<td colspan="7">').join('').split(/\n/)
//     return html
// }

// const getArbiterPaymentData = async (email, pass) => {
//     try {
//         const browser = await puppeteer.launch({
//             headless: true,
//             args: [
//                 '--no-sandbox'
//             ]
//         })
//         const page = await browser.newPage()
//         await page.setViewport({
//             width: 1500,
//             height: 825,
//             deviceScaleFactor: 1
//         })
//         await page.goto('https://www1.arbitersports.com/shared/signin/signin.aspx');
//         await page.click('#txtEmail')
//         await page.keyboard.type(email)
//         await page.click('#txtPassword')
//         await page.keyboard.type(pass)
//         await page.click('#ctl00_ContentHolder_pgeSignIn_conSignIn_btnSignIn')
//         await page.waitFor(500)
//         if(page.url() === 'https://www1.arbitersports.com/shared/signin/signin.aspx') {
//             return { error: "Invalid Login"}
//         }
//         await page.waitFor(500)
//         await page.click('#mobileAlertStayLink')
//         await page.waitFor(500)
//         // await page.screenshot({path: './screenshotb4.png'})
    
//         await page.waitFor(500)
//         await page.click('#ctl00_ContentHolder_pgeDefault_conDefault_dgAccounts_ctl02_lblType2')
//         await page.waitFor(500)
//         await page.goto('https://www1.arbitersports.com/arbiterone/arbiterpay/dashboard')
//         await page.waitFor(500)
//         await page.goto('https://www1.arbitersports.com/ArbiterOne/ArbiterPay/AccountHistory')
//         await page.waitFor(500)
//         // await page.screenshot({path: './screenshotb4.png'})
//         await page.click('.as_pageSizer > button:nth-child(1)')
//         await page.waitFor(750)
//         await page.click('.as_pageSizer > ul:nth-child(2) > li:nth-child(6) > a:nth-child(1)')
//         await page.waitFor(500)
    
//         // SET TIME FRAME
//         await page.click('#filter-startdate')
//         await page.waitFor(300)
//         await page.click('.ui-icon-circle-triangle-w')
//         await page.click('.ui-icon-circle-triangle-w')
//         await page.click('.ui-icon-circle-triangle-w')
//         await page.click('.ui-icon-circle-triangle-w')
//         await page.click('.ui-icon-circle-triangle-w')
//         await page.click('.ui-icon-circle-triangle-w')
//         await page.click('.ui-icon-circle-triangle-w')
//         await page.click('.ui-icon-circle-triangle-w')
//         await page.click('.ui-icon-circle-triangle-w')
//         await page.click('.ui-icon-circle-triangle-w')
//         await page.click('.ui-icon-circle-triangle-w')
//         await page.click('.ui-icon-circle-triangle-w')
//         await page.waitFor(500)
//         await page.click('.ui-datepicker-calendar > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(7) > a:nth-child(1)')
//         await page.click('button.large.dark')
//         await page.waitFor(500)
    
//         let response = await page.content()
//         let trimmedData = await trimHtmlData(response)
        
//         // DATA BECOMES AN ARRAY OF OBJECTS
//         let data = await parseHTML(trimmedData)
    
//         let nextPage;
//         let nxtPageTrimmed;
//         let nxtPageData;
//         let btnChild = 2
//         while(data.length % 50 === 0){
//             // SECOND PAGE
//             await page.click(`.as_pager > button:nth-child(${btnChild})`)
//             await page.waitFor(500)
//             nextPage = await page.content()
//             nxtPageTrimmed = await trimHtmlData(nextPage)
//             nxtPageData = await parseHTML(nxtPageTrimmed)
    
//             for(let i = 0; i < nxtPageData.length; i++){
//                 data.push(nxtPageData[i])
//             }
//             btnChild += 1;
//         }
//         data = data.filter((game) => {
//             if(!game.amount.includes('-')){
//                 return game
//             }
//         })
        
//         await browser.close()
//         return data
//     } catch (error) {
//         return {error: "Error in puppeteer function 'get arbiter payment data' " + error}
//     }
    
// }
// const findGameIdMatch = async (currentSchedule, paymentData) => {
//     let matchedGames = []

//     for (let i = 0; i < currentSchedule.length; i++){
//         //iterates through the entire schedule
//         for(let x = 0; x < paymentData.length; x++){
//             //iterates through all the payment data
//             if(currentSchedule[i].platform === 'Arbiter Sports' && paymentData[x].description.includes(currentSchedule[i].gameCode)){
//                 // console.log("MATCHED GAME: ", currentSchedule[i])
//                 // console.log("Payment DESC: ", paymentData[x])
//                 matchedGames.push(currentSchedule[i])
//             }
//         }
//     }

//     let uniques = [...new Set(matchedGames)]
//     // console.log(uniques.length)
//     return uniques
// }

router.get('/api/arbiter/payments', auth, async (req, res) => {
    try {
        return {error: "Feature coming soon!"}
        // const owner = req.user._id
        // const email = req.user.asEmail
        // const password = decryptPlainText(req.user.asPassword)
        // const currentSchedule = await Game.find({owner})
        // const paymentData = await getArbiterPaymentData(email, password)
        // if(paymentData.error) return res.status(500).send({error: "Error: " + paymentData.error})
        // // console.log(paymentData)
        // let matchedGames = await findGameIdMatch(currentSchedule, paymentData)

        // matchedGames.map(async (game) => {
        //     game.paid = true
        //     await game.save()
        // })
        // // console.log(matchedGames.length)
        // res.send(matchedGames)
        // // res.send(paymentData)
    } catch (error) {
        res.status(418).send({error: `Error in Arbiter/Payments/MAIN: ${error}`})
    }
})

module.exports = router;
