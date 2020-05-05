const puppeteer = require('puppeteer')
const arbiterLogin = async (asEmail, asPassword) => {
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
        const groupNames = await page.content()
        const cookies = await page._client.send('Network.getAllCookies')
        // await browser.close()
        browser.disconnect()
        return [true, groupNames, cookies, browserWSEndpoint]
    } catch (error) {
        return {error: 'error in arbiter login' + error}
    }

}
module.exports = arbiterLogin