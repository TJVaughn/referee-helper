const puppeteer = require('puppeteer')
const User = require('../../../models/User')

const parseArbiterSchedule = require('../../jobsHelpers/arbiter/parseArbiterSchedule')
const addEventsFromArray = require('../../jobsHelpers/addEventsFromArray')
const removePastEvents = require('../../jobsHelpers/removePastEvents')
const asLogin = require('../../jobsHelpers/arbiter/asLogin')
const findUniqueEvents = require('../../jobsHelpers/findUniqueEvents')
const { decryptPlainText } = require('../../../utils/crypto')

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
        if(error instanceof puppeteer.errors.TimeoutError){
            return ({error: "Timeout Error"})
        }
        return ({error: `Error From puppeteer: ${error}`})
    }
}


const asScheduleJobFunction = async (userID) => {
    try {
        const user = await User.findById(userID)
        const email = user.asEmail
        const pass = decryptPlainText(user.asPassword)
        const browserWSEndpoint = await asLogin(email, pass)
        const rawSchedule = await getArbiterSchedule(browserWSEndpoint)
        const parsedSchedule = await parseArbiterSchedule(rawSchedule)
        const futureGames = removePastEvents(parsedSchedule)
        const newUniqueEvents = await findUniqueEvents(futureGames)
        const games = await addEventsFromArray(newUniqueEvents, "Arbiter Sports", userID)
        return games
    } catch (error) {
        return {error: "Error is as schedule job: " + error}
    }
}

module.exports = (agenda) => {
    agenda.define('asScheduleJob', {priority: 20}, async (job, done) => {
        let { userID } = job.attrs.data
        const res = await asScheduleJobFunction(userID)
        if(res.error){
            console.log(res.error)
        }
        done()
    })
    agenda.on('complete:asScheduleJob', async job => {
        let user = await User.findOne({_id: job.attrs.data.userID})
        user.jobs.asScheduleStatus = 'complete'
        await user.save()
        await job.remove()
        // await job.save()
    })
}