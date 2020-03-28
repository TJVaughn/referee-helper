const express = require('express')
const router = new express.Router()
const { encryptPlainText } = require('../../utils/crypto')
const User = require('../../models/User')
const auth = require('../../middleware/auth')
const puppeteer = require('puppeteer')

const loginToAS = async (asEmail, asPassword) => {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--window-size=1500,825'
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
    await browser.close()
    return true
}

router.post('/api/arbiter/sync', auth, async (req, res) => {
    try {
        const asEmail = req.body.asEmail
        const asPassword = req.body.asPassword
        const user = await User.findById(req.user._id)
        const tryLogin = await loginToAS(asEmail, asPassword)
        if(!tryLogin){
            return res.send({error: "Invalid Login!"})
        }
        user.asEmail = asEmail
        user.asPassword = encryptPlainText(asPassword)
        await user.save()
        res.send(user)
    } catch (error) {
        res.status(418).send({error: "Error from arbiter sync: " + error})
    }
    
})

module.exports = router