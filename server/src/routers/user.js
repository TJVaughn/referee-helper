const express = require('express')
const router = new express.Router()

const User = require('../models/User')
const auth = require('../middleware/auth')

// CREATE
router.post('/api/user', async (req, res) => {

})
// LOGIN
router.post(`/api/user/login`, async (req, res) => {

})

// LOG OUT ONE

// LOG OUT ALL

// UPDATE USER WITH AUTH

// UPDATE USER PASS -- FORGOT PASS -- USE USER EMAIL

// READ PROFILE
router.get(`/api/user/me`, auth, async (req, res) => {

})

module.exports = router