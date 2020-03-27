const express = require('express')
const router = new express.Router()
const { encryptPlainText, decrpytPlainText } = require('../../utils/crypto')
const User = require('../../models/User')
const auth = require('../../middleware/auth')

router.post('/api/arbiter/sync', auth, async (req, res) => {
    try {
        const asEmail = req.body.asEmail
        const asPassword = req.body.asPassword
        const user = await User.findById(req.user._id)
        user.asEmail = asEmail
        user.asPassword = encryptPlainText(asPassword)
        await user.save()
        res.send(user)
    } catch (error) {
        res.status(418).send({error: "Error from arbiter sync: " + error})
    }
    
})

module.exports = router