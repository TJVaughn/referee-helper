const express = require('express')
const router = new express.Router()
// const puppeteer = require('puppeteer')
// const { decryptPlainText } = require('../../utils/crypto')
const auth = require('../../middleware/auth')

// const getProfile = async (email, password) => {
//     const browser = await puppeteer.launch({headless: true,
//         args: [
//             '--window-size=1500,825', '--no-sandbox'
//         ]})
//     const page = await browser.newPage()
//     await page.setViewport({
//         width: 2000,
//         height: 1500,
//         deviceScaleFactor: 1
//     })
//     await page.goto('https://www1.arbitersports.com/shared/signin/signin.aspx');
//     await page.click('#txtEmail')
//     await page.keyboard.type(email)
//     await page.click('#txtPassword')
//     await page.keyboard.type(password)
//     await page.click('#ctl00_ContentHolder_pgeSignIn_conSignIn_btnSignIn')
//     await page.content()
//     if(page.url() === 'https://www1.arbitersports.com/shared/signin/signin.aspx') {
//         return { error: "Invalid Login"}
//     }
//     await page.click('#mobileAlertStayLink')
//     await page.goto('https://www1.arbitersports.com/Official/OfficialEdit.aspx')
//     await page.click('tr.alternatingItems:nth-child(7)')
//     await page.content()
//     await page.goto('https://www1.arbitersports.com/Official/OfficialEdit.aspx')
//     await page.content()
//     // await page.click('#ctl00_ContentHolder_pgeOfficialEdit_conOfficialEdit_txtFirstName')
//     // const response = await page.$$('#ctl00_ContentHolder_pgeOfficialEdit_conOfficialEdit_txtFirstName')
//     const response = await page.content()
//     return response
// }

// const parseSingle = (single) => {
//     try {
//         single = single.split('text').pop()
//         single = single.split('').splice(9)
//         single = single.join('').replace(/\"/, "*").split("*").shift()
//         return single
//     } catch (error) {
//         return {error: "Error in sync arbiter profile: " + error}
//     }
// }

// const parseHtml = (data) => {
//     try {
//         data = data.toString().split('ctl00_ContentHolder_pgeOfficialEdit_conOfficialEdit_pnlSideBar').pop()
//         data = data.toString().split('<tbody').splice(2)
//         data = data.toString().split('<tr').splice(3)

//         data = {
//             fName: parseSingle(data[0]),
//             lName: parseSingle(data[2]),
//             asEmail: parseSingle(data[6]),
//             phone: (data[9]),
//             street: parseSingle(data[14]),
//             city: parseSingle(data[16]),
//             state: (data[18]),
//             postalCode: (data[19])
//         }
//         data.phone = data.phone.split('text').splice(1, 1)
//         data.phone = data.phone.toString().split('').splice(9, 12)
//         data.phone = data.phone.join('')
        
//         data.state = data.state.split('selected').splice(2)
//         data.state = data.state.toString().split('</option').shift()
//         data.state = data.state.split('>').pop()

//         data.postalCode = data.postalCode.split('text').splice(1, 1)
//         data.postalCode = data.postalCode.toString().split('').splice(9, 5)
//         data.postalCode = data.postalCode.join('')

//         return data
//     } catch (error) {
//         return {error}
//     }
// } 

router.get('/api/arbiter/profile', auth, async (req, res) => {
    return {error: "Feature coming soon!"}
    // const email = req.user.asEmail
    // const password = decryptPlainText(req.user.asPassword)
    // const user = req.user
    // try {
    //     const rawProfile = await getProfile(email, password)
    //     if(rawProfile.error){
    //         return res.send({error: "Invalid Login"})
    //     }
    //     const parsedProfile = parseHtml(rawProfile)
    //     const updates = Object.keys(parsedProfile)
    //     updates.forEach((update) => {
    //         user[update] = parsedProfile[update]
    //     })
    //     await user.save()
    //     res.send(user)
    // } catch (error) {
    //     res.status(418).send({error: `Error in Arbiter/Profile/MAIN: ${error}`})
    // }
})

module.exports = router