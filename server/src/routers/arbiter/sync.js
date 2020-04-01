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
    const groupNames = await page.content()

    await browser.close()
    return [true, groupNames]
}

const findGroups = (html) => {
    let groups = []
    for(let i = 0; i < html.length; i++){
        if(html[i].includes('</span>')){
            let name = html[i]
            let number = html[i]
            name = name.split('<span').shift()
            name = name.split('').reverse().join('').split('>').shift()
            name = name.split('').reverse().join('')
            
            number = number.split('</span>').join('')
            number = number.split('').reverse().join('').split('>').shift()
            number = number.split('').reverse().join('')
            let group = {
                name: name,
                number: number
            }
            groups.push(group)
        }
    }
    return groups
}

router.post('/api/arbiter/sync', auth, async (req, res) => {
    try {
        const asEmail = req.body.asEmail
        const asPassword = req.body.asPassword
        const user = await User.findById(req.user._id)
        let tryLogin = await loginToAS(asEmail, asPassword)
        if(!tryLogin){
            return res.send({error: "Invalid Login!"})
        }
        user.asEmail = asEmail
        user.asPassword = encryptPlainText(asPassword)


        tryLogin = tryLogin.toString().split("ctl00_MiniAccounts1_MsgLabel").splice(1)
        tryLogin = tryLogin.join('').split('dgAccounts').shift()
        tryLogin = tryLogin.replace('<div>', '***')
        tryLogin = tryLogin.split('***').pop()
        tryLogin = tryLogin.split('</div>')
        let groups = findGroups(tryLogin)

        for(let x = 0; x < groups.length; x ++){
            let name = groups[x].name
            let number = groups[x].number
            user.groups = user.groups.concat({ group: { name, number } })
        }
       
        // user.groups = groups.map((group) => {
        //     user.groups.concat({group})
        // })
        await user.save()
        res.send(user)
    } catch (error) {
        res.status(418).send({error: "Error from arbiter sync: " + error})
    }
    
})

module.exports = router