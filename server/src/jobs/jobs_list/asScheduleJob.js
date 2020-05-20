const puppeteer = require('puppeteer')
const parseArbiterSchedule = require('../jobs_helpers/parseArbiterSchedule')
const addGamesFromArray = require('../../utils/addGamesFromArray')
const Game = require('../../models/Game')
const User = require('../../models/User')
const { decryptPlainText } = require('../../utils/crypto')
const asLogin = require('../jobs_helpers/asLogin')

const getArbiterSchedule = async (browserWSEndpoint) => {
    try {
        const browser = await puppeteer.connect({browserWSEndpoint})
        const page = await browser.newPage()
        await page.waitFor(750)
        await page.goto('https://www1.arbitersports.com/Official/GameScheduleEdit.aspx')
        await page.waitFor(750)
        await page.click('#ctl00_ContentHolder_pgeDefault_conDefault_dgAccounts > tbody > tr:nth-child(2)')
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


const asScheduleJobFunction = async (userID) => {
    try {
        const user = await User.findOne({_id: userID})
        const email = user.asEmail
        const pass = decryptPlainText(user.asPassword)
        const browserEndpoint = await asLogin(email, pass)
        const rawSchedule = await getArbiterSchedule(browserEndpoint)
        const parsedSchedule = await parseArbiterSchedule(rawSchedule)
        const currentSchedule = Game.find({owner: userID})
        const games = await addGamesFromArray(parsedSchedule, "Arbiter Sports", user, currentSchedule)
        return games
    } catch (error) {
        console.log(error)
        return {error: "Error is as schedule job: " + error}
    }
}


module.exports = (agenda) => {
    agenda.define('arbiter schedule', async (job, done) => {
        let { user } = job.attrs.data
        await asScheduleJobFunction(user)
        done()
    })
    agenda.on('success:arbiter schedule', async job => {
        let user = await User.findOne({_id: job.attrs.data.user})
        user.jobs.asScheduleStatus = 'success'
        user.save()
        job.save()
        console.log(`Successfully added schedule for user: ${job.attrs.data.user}`)
    })
    agenda.on('fail:arbiter schedule', async job => {
        let user = await User.findOne({_id: job.attrs.data.user})
        user.jobs.asScheduleStatus = 'fail'
        await user.save()
        await job.save()
    })
}