const puppeteer = require('puppeteer')
const parseSchedule = require('../functions/parseSchedule')
const addGamesFromArray = require('../../../utils/addGamesFromArray')
const Game = require('../../../models/Game')
const User = require('../../../models/User')
const { decryptPlainText } = require('../../../utils/crypto')

const getArbiterSchedule = async (email, pass) => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            args: [
                '--window-size=1500,825','--no-sandbox'
            ]
        })
        const page = await browser.newPage()
        await page.setViewport({
            height: 825,
            width: 1500
        })
        await page.goto('https://www1.arbitersports.com/shared/signin/signin.aspx')
        await page.waitFor(750)
        await page.click('#txtEmail')
        await page.keyboard.type(email)
        await page.click('#txtPassword')
        await page.keyboard.type(pass)
        await page.click('#ctl00_ContentHolder_pgeSignIn_conSignIn_btnSignIn')
        if(page.url() === 'https://www1.arbitersports.com/shared/signin/signin.aspx') {
            return { error: "Invalid Login"}
        }
        await page.waitFor(750)

        await page.goto('https://www1.arbitersports.com/Official/GameScheduleEdit.aspx')
        await page.waitFor(750)
        // await page.click('#mobileAlertStayLink')
        await page.waitFor(750)

        await page.click('tr.alternatingItems:nth-child(7)')
        await page.waitFor(500)
        await page.goto('https://www1.arbitersports.com/Official/GameScheduleEdit.aspx')
        await page.waitFor(750)
        await page.content()
        await page.select('#ddlDateFilter', '9')
        await page.click('#btnApplyFilter')
        await page.waitFor(4000)
        
        let response = await page.content()
        await browser.close()
        return response
    } catch (error) {
        return ({error: `Error From puppeteer: ${error}`})
    }
}


const asScheduleJob = async (userID) => {
    try {
        const user = await User.findOne({_id: userID})
        const email = user.asEmail
        const pass = decryptPlainText(user.asPassword)
        //get the arbiter schedule
        const rawSchedule = await getArbiterSchedule(email, pass)
        //parse the arbiter schedule
        const parsedSchedule = await parseSchedule(rawSchedule)
        //save the arbiter schedule to the database
        const currentSchedule = Game.find({owner: userID})
        const games = await addGamesFromArray(parsedSchedule, "Arbiter Sports", user, currentSchedule)
        return games
    } catch (error) {
        console.log(error)
        return {error: "Error is as schedule job: " + error}
    }
}

module.exports = asScheduleJob