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
router.post(`/api/user/login`, async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        user.token = token
        const cookieExpires = setExpireTime(14)
        let secure = ''
        await user.save()
        res.setHeader('Set-Cookie', `AuthToken=${token};HttpOnly;expires=${cookieExpires};path=/;${secure}`)
        res.send(user)
    } catch (error) {
        res.status(401).send({error: "Unable to login"})
    }
    
})
// READ PROFILE
router.get(`/api/user/me`, auth, async (req, res) => {
    const user = req.user
    res.send(user)
})

// LOG OUT ONE

// LOG OUT ALL
router.post('/api/user/logout-all', auth, async (req, res) => {
    const user = req.user
    req.user.tokens = []
    await user.save()
    res.send(user)
})
// UPDATE USER WITH AUTH

// UPDATE USER PASS -- FORGOT PASS -- USE USER EMAIL



module.exports = router