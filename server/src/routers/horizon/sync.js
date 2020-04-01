const express = require('express')
const router = new express.Router()
const auth = require('../../middleware/auth')
const { encryptPlainText } = require('../../utils/crypto')
const puppeteer = require('puppeteer')
const User = require('../../models/User')

const loginToHWR = async (username, password) => {
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
    await page.goto('https://www.horizonwebref.com/?pageID=login', {waitUntil: 'networkidle2'})
    await page.click('#loginTable2 > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > input')
    await page.keyboard.type(username)
    await page.click("#password")
    await page.waitFor(750)

    await page.keyboard.type(password)
    await page.click('#loginsub')
    await page.waitFor(1000)
    await page.goto('https://www.horizonwebref.com/?pageID=1108')
    await page.waitFor(750)
    if(page.url() === 'https://www.horizonwebref.com/?pageID=login'){
        await browser.close()
        return false
    }
    await page.click('#tab-9')
    await page.waitFor(1000)
    let groups = await page.content()
    await browser.close()
    return groups
}

const findGroups = (html) => {
    let groups = []
    for(let i = 0; i < html.length; i++) {
        let group = html[i].split('</td>').shift()
        group = group.split('').reverse().join('').split('>').shift()
        group = group.split('').reverse().join('')
        groups.push(group)
    }
    return groups
}

router.post('/api/horizon/sync', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if(!user){
            return res.status(404).send({error: "User not found!"})
        }
        const tryLogin = await loginToHWR(req.body.hwrUsername, req.body.hwrPassword)
        if(!tryLogin){
            return res.send({error: "Invalid Login!"})
        }
        user.hwrUsername = req.body.hwrUsername;
        user.hwrPassword = encryptPlainText(req.body.hwrPassword)
        let groups = tryLogin.split('cRow-10').pop()
        groups = groups.split('<tbody>').splice(1)
        groups = groups.join('').split('</tbody>').shift()
        groups = groups.replace('</tr>', "***").split('***').pop()
        groups = [groups]
        // groups = groups.push(groups)
        groups = findGroups(groups)

        for(let x = 0; x < groups.length; x ++){
            let name = groups[x]
            user.groups = user.groups.concat({ group: { name } })
        }
        await user.save()

        return res.send(user)
    } catch (error) {
        res.status(418).send({error: "Error in horizon sync: " + error})
    }
})


module.exports = router