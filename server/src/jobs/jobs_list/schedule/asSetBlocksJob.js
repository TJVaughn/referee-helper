const puppeteer = require('puppeteer')
const User = require('../../../models/User')
const Event = require('../../../models/Event')
const asLogin = require('../../jobsHelpers/arbiter/asLogin')
const { decryptPlainText } = require('../../../utils/crypto')
const removePastEvents = require('../../jobsHelpers/removePastEvents')

const setBlockDates = async (game, page) => {
    // let blockDate = '06/01/2020'
    let blockDate = new Date(game.dateTime).toLocaleDateString()
    const deleteText = async () => {
        for(let x = 0; x < 10; x++){
            await page.keyboard.down('Backspace')
            await page.keyboard.down('Delete')
        }
    }
    await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_txtFromDay')
    await deleteText()
    await page.keyboard.type(blockDate)
    await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_txtToDay')
    await deleteText()
    await page.keyboard.type(blockDate)
}
const formatTime = (time) => {
    let hours = ''
    let minutes = ''
    let ampm = ''

    time = new Date(time)
    hours = time.getHours()
    minutes = time.getMinutes()
    if(hours > 12){
        ampm = 'PM'
        hours = hours - 12
    } else if (hours === 12){
        ampm = 'PM'
    } else {
        ampm = 'AM'
    }
    if(minutes < 10){
        minutes = `0${minutes}`
    }

    time = `${hours}:${minutes} ${ampm}`
    console.log(time)

    return time
}

const setBlockTimes = async (game, page) => {
    //12:00 AM to 11:45 PM 
    let blockStartTime = formatTime(game.dateTime)
    let blockEndTime = new Date(game.dateTime)
    if(blockEndTime.getHours() > 21){
        blockEndTime = '11:45 PM'
    } else {
        blockEndTime = blockEndTime.setHours(blockEndTime.getHours() + 2)
        blockEndTime = formatTime(blockEndTime)
    }
    await page.select('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_ddlFromTime', blockStartTime)
    await page.select('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_ddlToTime', blockEndTime)
}

const setBlocks = async (browserWSEndpoint, futureGames) => {
    if(futureGames.length < 1){
        return {error: 'No future games'}
    }
    const browser = await puppeteer.connect({browserWSEndpoint})
    const page = await browser.newPage()
    await page.setViewport({
        height: 825,
        width: 1500
    })
    await page.waitFor(1000)
    await page.goto('https://www1.arbitersports.com/Official/BlockDates.aspx')
    await page.waitFor(1500)

    const tryOne = async () => {
        for(let i = 2; i < 20;){
            if(page.url() !== 'https://www1.arbitersports.com/Official/BlockDates.aspx'){
                await page.click('#switchviews')
                await page.waitFor(1000)
                await page.click(`#roleMenu > div > ul > div.switchViews > ul:nth-child(${i}) > li > a`)
                await page.waitFor(1000)
                await page.goto('https://www1.arbitersports.com/Official/BlockDates.aspx')
                await page.waitFor(1000)
                i += 2
            } else {
                return 
            }
        }
        
    }
    await tryOne()
    await page.click('#ctl00_ContentHolder_pgeBlockDates_sbrAction_rbtPartDay')
    await page.waitFor(2000)
    await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_chkSun')
    await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_chkMon')
    await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_chkTue')
    await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_chkWed')
    await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_chkThu')
    await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_chkFri')
    await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_chkSat')

    for(let i = 0; i < futureGames.length; i++){
        await setBlockDates(futureGames[i], page)
        await setBlockTimes(futureGames[i], page)
        await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_btnRangeApply')
        await page.waitFor(1500)
    }

    await browser.close()
    return
}

module.exports = (agenda) => {
    agenda.define('asSetBlocksJob', async (job, done) => {
        const user = await User.findById(job.attrs.data.userID)
        if(!user){
            console.log("error user not found")
            await job.remove()
            return done()
        }
        const browserWSEndpoint = await asLogin(user.asEmail, decryptPlainText(user.asPassword))
        let futureGames = await Event.find({owner: user._id})
        futureGames = removePastEvents(futureGames)
        console.log('future games')
        console.log(futureGames)
        const blocks = await setBlocks(browserWSEndpoint, futureGames)
        user.jobs.asBlockStatus = 'complete'
        await user.save()
        done()
    })
}