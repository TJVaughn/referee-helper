const puppeteer = require('puppeteer')

const asLogin = async (asEmail, asPassword, sync = false) => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
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
        // await page.click('#mobileAlertStayLink')
        await page.waitFor(750)
        if(sync){
            await browser.close()
            return true
        }
        const browserEndpoint = browser.wsEndpoint()
        await browser.disconnect()
        return browserEndpoint
    } catch (error) {
        return {error: "Error in group sync" + error}
    }
}

module.exports = asLogin