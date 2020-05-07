const puppeteer = require('puppeteer')

const arbiterScheduleLogin = async (asEmail, asPassword) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--window-size=1500,825', '--no-sandbox'
            ]
        })
        const page = await browser.newPage()
        await page.setViewport({
            height: 825,
            width: 1500
        })
        await page.goto('https://www1.arbitersports.com/shared/signin/signin.aspx');
        await page.click('#txtEmail')
        await page.keyboard.type(asEmail)
        await page.click('#txtPassword')
        await page.keyboard.type(asPassword)
        await page.click('#ctl00_ContentHolder_pgeSignIn_conSignIn_btnSignIn')
        await page.waitFor(1000)
        if(page.url() === 'https://www1.arbitersports.com/shared/signin/signin.aspx') {
            await browser.close()
            return false
        }
        await page.goto('https://www1.arbitersports.com/Official/GameScheduleEdit.aspx')
        await page.waitFor(750)
        await page.click('#mobileAlertStayLink')
        await page.waitFor(750)
        await page.click('tr.alternatingItems:nth-child(7)')
        await page.waitFor(500)
        const browserWSEndpoint = browser.wsEndpoint()
        browser.disconnect()
        return browserWSEndpoint
    } catch (error) {
        return {error: 'error in arbiter login' + error}
    }
}
const arbiterScheduleSetAllGames = async (browserWSEndpoint) => {
    const browser = await puppeteer.connect({browserWSEndpoint})
    const page = await browser.newPage()
    await page.setViewport({
        height: 825,
        width: 1500
    })
    await page.goto('https://www1.arbitersports.com/Official/GameScheduleEdit.aspx')
    await page.waitFor(7000)
    await page.select('#ddlDateFilter', '9')
    await page.click('#btnApplyFilter')
    // const browserWSEndpoint2 = browser.wsEndpoint()
    browser.disconnect()
    return browserWSEndpoint
}

const getArbiterSchedule = async (browserWSEndpoint) => {
    try {
        const browser = await puppeteer.connect({browserWSEndpoint})
        const page = await browser.newPage()
        await page.setViewport({
            height: 825,
            width: 1500
        })
        await page.goto('https://www1.arbitersports.com/Official/GameScheduleEdit.aspx')
        await page.waitFor(5000)
        let response = await page.content()
        await browser.close()
        return response
        // const browser = await puppeteer.launch({
        // headless: false,
        // args: [
        //     '--window-size=414,736', 
        //     '--no-sandbox'
        // ]
        // })
        // const page = await browser.newPage()
        // await page.setViewport({
        //     width: 414,
        //     height: 736,
        //     deviceScaleFactor: 1
        // })
        // await page.goto('https://www1.arbitersports.com/shared/signin/signin.aspx')
        // await page.waitFor(750)
        // await page.click('#txtEmail')
        // await page.keyboard.type(email)
        // await page.click('#txtPassword')
        // await page.keyboard.type(pass)
        // await page.click('#ctl00_ContentHolder_pgeSignIn_conSignIn_btnSignIn')
        // if(page.url() === 'https://www1.arbitersports.com/shared/signin/signin.aspx') {
        //     return { error: "Invalid Login"}
        // }
        // await page.waitFor(750)

        // await page.goto('https://www1.arbitersports.com/Official/GameScheduleEdit.aspx')
        // await page.waitFor(750)
        // await page.click('#mobileAlertStayLink')
        // await page.waitFor(750)

        // await page.click('tr.alternatingItems:nth-child(7)')
        // await page.waitFor(500)
        // await page.goto('https://www1.arbitersports.com/Official/GameScheduleEdit.aspx')
        // await page.waitFor(750)
        // await page.content()
        // await page.select('#ddlDateFilter', '9')
        // await page.click('#btnApplyFilter')
        // await page.waitFor(4000)
        
        // let response = await page.content()
        // await browser.close()
        // return response
    } catch (error) {
        return ({error: `Error From puppeteer: ${error}`})
    }
}
module.exports = { arbiterScheduleLogin, arbiterScheduleSetAllGames, getArbiterSchedule}