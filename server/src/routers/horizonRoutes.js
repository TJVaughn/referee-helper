const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')

router.get('/api/horizon/schedule', auth, async (req, res) => {

})

module.exports = router