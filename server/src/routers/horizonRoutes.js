const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')

//start login sync
//login sync status

//start schedule sync -- schedule sync status

//start blocks == blocks status

router.get('/api/horizon/schedule', auth, async (req, res) => {

})

module.exports = router