const express = require('express')
const router = new express.Router()
const { encryptPlainText } = require('../../utils/crypto')
const User = require('../../models/User')
const auth = require('../../middleware/auth')
const puppeteer = require('puppeteer')
'use strict'


const findGroups = (html) => {
    let groups = []
    for(let i = 0; i < html.length; i++){
        if(html[i].includes('</span>')){
            let name = html[i]
            let number = html[i]
            name = name.trim().split(/\\/).shift()
            name = name.split('').reverse().join('').split('>').shift()
            name = name.split('').reverse().join('').trim()
            
            number = number.split('</span>').shift()
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
        let [success, groupNamesTL] = tryLogin
        if(!success){
            return res.send({error: "Invalid Login!"})
        }
        user.asEmail = asEmail
        user.asPassword = encryptPlainText(asPassword)

        let groupNames = groupNamesTL
        
        //split just above the groups
        groupNames = groupNames.toString().split("switchViewsContainer").splice(1)
        groupNames = groupNames.join('').split('AccountDropDown').shift()
        groupNames = groupNames.replace('<div>', '***')
        groupNames = groupNames.split('***').pop()
        groupNames = groupNames.split('</div>')
        let groups = findGroups(groupNames)
        
        let currentGroups = user.groups
        console.log(currentGroups)
        console.log(groups[3].number)
        const findMatch = (group, currentGroups) => {
            for(let g = 0; g < currentGroups.length; g++){
                if(group.number === currentGroups[g].group.number){
                    return true
                }
            }
            return false
        }
        let newGroups = []
        groups.map((group) => {
            let isMatch = findMatch(group, currentGroups)
            if(!isMatch){
                newGroups.push(group)
            }
        })
        for(let z = 0; z < newGroups.length; z ++){
            let name = newGroups[z].name
            let number = newGroups[z].number
            user.groups = user.groups.concat({ group: { name, number } })
        }

        await user.save()
        res.send(user)
    } catch (error) {
        res.status(418).send({error: "Error from arbiter sync: " + error})
    }
    
})

module.exports = router