const express = require('express')
const router = new express.Router()
const puppeteer = require('puppeteer')
// const Game = require('../../models/Game')
const auth = require('../../middleware/auth')

const getProfile = async (email, password) => {
    const browser = await puppeteer.launch({headless: true})
    const page = await browser.newPage()
    await page.setViewport({
        width: 2000,
        height: 1500,
        deviceScaleFactor: 1
    })
    await page.goto('https://www1.arbitersports.com/shared/signin/signin.aspx');
    await page.click('#txtEmail')
    await page.keyboard.type(email)
    await page.click('#txtPassword')
    await page.keyboard.type(password)
    await page.click('#ctl00_ContentHolder_pgeSignIn_conSignIn_btnSignIn')
    await page.content()
    if(page.url() === 'https://www1.arbitersports.com/shared/signin/signin.aspx') {
        return { error: "Invalid Login"}
    }
    await page.click('#mobileAlertStayLink')
    await page.goto('https://www1.arbitersports.com/Official/OfficialEdit.aspx')
    await page.click('tr.alternatingItems:nth-child(7)')
    await page.content()
    await page.goto('https://www1.arbitersports.com/Official/OfficialEdit.aspx')
    await page.content()
    // await page.click('#ctl00_ContentHolder_pgeOfficialEdit_conOfficialEdit_txtFirstName')
    // const response = await page.$$('#ctl00_ContentHolder_pgeOfficialEdit_conOfficialEdit_txtFirstName')
    const response = await page.content()
    return response
}

const parseHtml = (data) => {
    data = data.toString().split('ctl00_ContentHolder_pgeOfficialEdit_conOfficialEdit_pnlSideBar').pop()
    data = data.toString().split('<tbody').splice(2)
    data = data.toString().split('<tr').splice(3)
    data = {
        fName: data[0],
        lName: data[2],
        email: data[6],
        phone: data[9],
        street: data[14],
        city: data[16],
        country: data[17],
        state: data[18],
        postalCode: data[19]
    }
    data.fName = data.fName.split('text').pop()
    data.fName = data.fName.split('').splice(9)
    data.fName = data.fName.join('')

    return data
} 

router.post('/api/arbiter/profile', auth, async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    // const userId = req.user._id

    try {
        const rawProfile = await getProfile(email, password)
        if(rawProfile.error){
            return res.send({error: "Invalid Login"})
        }
        const parsedProfile = parseHtml(rawProfile)

        res.send(parsedProfile)
    } catch (error) {
        res.status(418).send(error)
    }

})

module.exports = router