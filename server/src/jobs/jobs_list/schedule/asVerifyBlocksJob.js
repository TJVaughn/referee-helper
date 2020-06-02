const puppeteer = require('puppeteer')
const User = require('../../../models/User')
const asLogin = require('../../jobsHelpers/arbiter/asLogin')
const { decryptPlainText } = require('../../../utils/crypto')

const verifyBlocks = async (browserWSEndpoint) => {
    const browser = await puppeteer.connect({browserWSEndpoint})
    const page = await browser.newPage()
    await page.setViewport({
        height: 825,
        width: 1500
    })
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
    await page.waitFor(2000)
    await page.click('#ctl00_ContentHolder_pgeBlockDates_sbrReport_tlbPrint')
    await page.waitFor(2000)
    await page.select('#ctl00_ContentHolder_pgeBlockDates_conBlockDates_ddlFormat', '4')
    await page.waitFor(1000)
    let response = ''
    browser.on('targetcreated', async (target) => {
        console.log(target.url())
        await page.goto(target.url())

        response = await page.content()
        return
    })
    await page.click('#ctl00_ContentHolder_pgeBlockDates_navBlockDates_btnBeginPrint')
    await page.waitFor(5000)
    await browser.close()
    return response
}

module.exports = (agenda) => {
    agenda.define('asVerifyBlocksJob', async (job, done) => {
        const user = await User.findById(job.attrs.data.userID)
        if(!user){
            console.log("error user not found")
            await job.remove()
            return done()
        }
        const browserWSEndpoint = await asLogin(user.asEmail, decryptPlainText(user.asPassword))
        const blocks = await verifyBlocks(browserWSEndpoint)
        console.log(blocks)
        done()
    })
}