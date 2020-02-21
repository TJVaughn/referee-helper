const express = require('express')
const router = new express.Router()
const https = require('https')

router.get('/api/arbiter/schedule', async (req, res) => {
    const url = new URL('https://www1.arbitersports.com/Official/GameScheduleEdit.aspx')
    const newUrl = new URL('https://www1.arbitersports.com/shared/signin/signin.aspx?RedirectUrl=/Official/GameScheduleEdit.aspx')
    const options = {
        auth: 'hauck.trevor@gmail.com:aLivenFree@88!',
        method: 'POST'
    }
    const request = https.request(newUrl, options, (response) => {
        console.log("Status: \n", response.statusCode)
        console.log("Headers: \n", response.headers)

        response.on('data', (d) => {
            res.send(d)
        })
    })
    request.on("error", (err) => {
        console.log(err)
    })
    request.end()
})

module.exports = router