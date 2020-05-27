const puppeteer = require('puppeteer')
const User = require('../../../models/User')
const Event = require('../../../models/Event')
const asLogin = require('../../jobsHelpers/arbiter/asLogin')
const  { decryptPlainText } = require('../../../utils/crypto')

const setBlocks = async (browserWSEndpoint, futureGames) => {
    const browser = await puppeteer.connect({browserWSEndpoint})
    const page = await browser.newPage()
    await page.setViewport({
        height: 825,
        width: 1500
    })
    await page.waitFor(1000)
    await page.goto('https://www1.arbitersports.com/Official/GameScheduleEdit.aspx')
    await page.waitFor(1000)
    await page.click('#ctl00_ContentHolder_pgeDefault_conDefault_dgAccounts > tbody > tr:nth-child(2) > td:nth-child(1)')
    await page.waitFor(500)
    await page.goto('https://www1.arbitersports.com/Official/BlockDates.aspx')
    await page.waitFor(500)
    await page.click('#ctl00_ContentHolder_pgeBlockDates_sbrAction_rbtPartDay')
    await page.waitFor(2000)
    await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_chkSun')
    await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_chkMon')
    await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_chkTue')
    await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_chkWed')
    await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_chkThu')
    await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_chkFri')
    await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_chkSat')

    let blocksCreatedArr = []
    // iterate over the current games array and set appropriate blocks
    console.log(futureGames[0].dateTime)
    for(let i = 0; i < futureGames.length; i++){
        let blockStartDate = new Date(futureGames[i].dateTime).toLocaleDateString()
        console.log("Block Start Date: ", blockStartDate)
        await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_txtFromDay')
        for(let x = 0; x < 10; x++){
            await page.keyboard.down('Backspace')
            await page.keyboard.down('Delete')
        }
        await page.keyboard.type(blockStartDate)
        await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_txtToDay')
        for(let x = 0; x < 10; x++){
            await page.keyboard.down('Backspace')
            await page.keyboard.down('Delete')
        }
        await page.keyboard.type(blockStartDate)

        let gameStartTime = futureGames[i].dateTime
        // console.log("Game Start: ", gameStartTime.toLocaleTimeString())

        let blockStart = gameStartTime.setHours(gameStartTime.getHours() - 1)
        blockStart = new Date(blockStart)

        if(blockStart.getMinutes() !== (15 || 30 || 45)){
            let blockMins = blockStart.getMinutes();
            if(blockMins >= 45 && blockMins < 59){
                blockStart.setMinutes(45)
            } else if(blockMins >= 30){
                blockStart.setMinutes(30)
            } else if(blockMins >= 15){
                blockStart.setMinutes(15)
            } else {
                blockStart.setMinutes(0)
            }
            blockStart = new Date(blockStart)
        }

        let blockStartTime = blockStart;
        let blockEndTime = blockStart;

        blockStartTime = blockStartTime.toLocaleTimeString().split('').reverse()
        blockStartTime.splice(3, 3)
        blockStartTime = blockStartTime.join('').split('').reverse().join('')
        
        // console.log("Block Start: ", blockStartTime)
        await page.select('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_ddlFromTime', blockStartTime)
        await page.waitFor(500)

        blockEndTime = blockEndTime.setHours(blockEndTime.getHours() + 3)
        blockEndTime = new Date(blockEndTime)

        blockEndTime = blockEndTime.toLocaleTimeString()
        blockEndTime = blockEndTime.split('').reverse()
        blockEndTime.splice(3, 3)
        blockEndTime = blockEndTime.join('').split('').reverse().join('')
        
        // console.log("Block End Time", blockEndTime)
        // await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_ddlToTime')
        await page.select('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_ddlToTime', blockEndTime)
        await page.waitFor(500)

        await page.click('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_btnRangeApply')
        await page.waitFor(1500)
        gameStartTime = gameStartTime.setHours(gameStartTime.getHours() + 1)
        gameStartTime = new Date(gameStartTime)
        blocksCreatedArr.push({
            gameStartTime,
            blockStartTime,
            blockEndTime,
            gameData: futureGames[i]
        })
    }

    await page.content()
    await browser.close()

    return blocksCreatedArr
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
        const futureGames = await Event.find({owner: user._id})
        console.log(futureGames)
        const blocks = await setBlocks(browserWSEndpoint, futureGames)
        done()
    })
}