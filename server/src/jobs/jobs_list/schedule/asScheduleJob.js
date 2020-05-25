const puppeteer = require('puppeteer')
const User = require('../../../models/User')
const Event = require('../../../models/Event')

const parseArbiterSchedule = require('../../jobsHelpers/arbiter/parseArbiterSchedule')
const addEventsFromArray = require('../../../utils/addEventsFromArray')
const removePastGames = require('../../jobsHelpers/removePastGames')
const asLogin = require('../../jobsHelpers/arbiter/asLogin')
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
        const browserEndpoint = await asLogin(email, pass)
        const rawSchedule = await getArbiterSchedule(browserEndpoint)
        const parsedSchedule = await parseArbiterSchedule(rawSchedule)
        const futureGames = removePastGames(parsedSchedule)
        const newUniqueEvents = findUniqueEvents(futureGames)
        const games = await addEventsFromArray(newUniqueEvents, "Arbiter Sports")
        return games
    } catch (error) {
        // console.log(error)
        return {error: "Error is as schedule job: " + error}
    }
}

module.exports = (agenda) => {
    agenda.define('asScheduleJob', async (job, done) => {
        let { userID } = job.attrs.data
        await asScheduleJobFunction(userID)
        done()
    })
    agenda.on('complete:asScheduleJob', async job => {
        let user = await User.findOne({_id: job.attrs.data.userID})
        user.jobs.asScheduleStatus = 'complete'
        await user.save()
        await job.remove()
        // await job.save()
    })
    agenda.on('fail:asScheduleJob', async job => {
        // let user = await User.findOne({_id: job.attrs.data.user})
        // user.jobs.asScheduleStatus = 'fail'
        // await user.save()
        await job.remove()
    })
}