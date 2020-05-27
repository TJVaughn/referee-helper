const puppeteer = require('puppeteer')
const $ = require('cheerio')

//iterate through and try groups with access to set blocks
const asTryGroups = async (browserWSEndpoint) => {
    const browser = await puppeteer.connect({browserWSEndpoint})
    const page = await browser.newPage()
    await page.setViewport({
        height: 825,
        width: 1500
    })
    await page.goto('https://www1.arbitersports.com/generic/default.aspx')
    await page.waitFor(1500)
    await page.click('#ctl00_ContentHolder_pgeDefault_conDefault_dgAccounts > tbody > tr:nth-child(2) > td:nth-child(1)')
    await page.waitFor(1000)
    await page.goto('https://www1.arbitersports.com/Official/BlockDates.aspx')
    await page.waitFor(1000)
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
    const browserWSEndpoint = browser.wsEndpoint()
    browser.disconnect()
    return browserWSEndpoint
}

module.exports = asTryGroups