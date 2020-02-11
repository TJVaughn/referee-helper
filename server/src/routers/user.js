const express = require('express')
const router = new express.Router()

const User = require('../models/User')
const auth = require('../middleware/auth')
const { setExpireTime } = require('../utils/SetExpireTime')

// CREATE
router.post('/api/user', async (req, res) => {
    const user = new User(req.body)
    
    try {
        const cookieExpires = setExpireTime(14)
        let secure = ''
        if(process.env.NODE_ENV === 'production'){
            secure = 'secure;'
        }
        const token = await user.generateAuthToken()
        //SEND EMAIL CODE HERE
        res.setHeader('Set-Cookie', `AuthToken=${token};HttpOnly;expires=${cookieExpires};path=/;${secure}`)
        res.status(201).send({ user, token })
    } catch (error) {
       res.status(400).send(error) 
    }
    
})
// LOGIN
// router.post(`/api/user/login`, async (req, res) => {

// })

// LOG OUT ONE

// LOG OUT ALL

// UPDATE USER WITH AUTH

// UPDATE USER PASS -- FORGOT PASS -- USE USER EMAIL

// READ PROFILE
// router.get(`/api/user/me`, auth, async (req, res) => {

// })

module.exports = router