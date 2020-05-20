const puppeteer = require('puppeteer')
const User = require('../../models/User')
const { decryptPlainText, encryptPlainText } = require('../../utils/crypto')

const loginToAS = async (asEmail, asPassword) => {
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
        await page.click('#mobileAlertStayLink')
        await page.waitFor(750)
        await browser.close()
        return true
    } catch (error) {
        return {error: "Error in group sync" + error}
    }
}


module.exports = (agenda) => {
    agenda.define('arbiter sync', {priority: 20}, async (job, done) => {
        let { asEmail, asPassword, userID } = job.attrs.data
        let user = await User.findById(userID)
        asPassword = decryptPlainText(asPassword)
        let tryLogin = await loginToAS(asEmail, asPassword)
        if(!tryLogin){
            user.jobs.asSyncStatus = 'invalid login'
        } else if(tryLogin){
            user.jobs.asSyncStatus = 'success'
            user.asPassword = encryptPlainText(asPassword)
            user.asEmail = asEmail
        } else {
            user.jobs.asSyncStatus = 'error'
        }
        await user.save()
        await job.remove()
        done()
    })
    
}