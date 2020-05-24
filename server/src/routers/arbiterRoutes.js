const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const agenda = require('../jobs/agenda')
const { encryptPlainText } = require('../utils/crypto')

//start login sync
//login sync status

//start schedule sync -- schedule sync status

//start blocks == blocks status

router.post('/api/arbiter/sync', auth, async (req, res) => {
    const asEmail = req.body.asEmail
    let asPassword = req.body.asPassword
    asPassword = encryptPlainText(asPassword)
    await agenda.start()
    await agenda.schedule('2 seconds', 'arbiter sync', { asEmail, asPassword, userID: req.user._id})
    req.user.jobs.asSyncStatus = 'processing'
    req.user.save()
    res.send({message: "processing"})
})

router.get('/api/arbiter/sync-status', auth, async (req, res) => {
    try {
        let status = req.user.jobs.asSyncStatus
        if(status === 'complete'){
            return res.send({message: 'complete'})
        } else if(status === 'fail'){
            return res.send({message: 'fail'})
        } else if(status === 'invalid login'){
            return res.send({message: 'invalid login'})
        } else {
            res.send({message: "processing"})
        }
    } catch (error) {
        res.status(500).send({error: `Error in Arbiter/Sync-status: ${error}`})
    }
})

router.get('/api/arbiter/schedule', auth, async (req, res) => {
    try {
        await agenda.start()
        await agenda.schedule('2 seconds', 'arbiter schedule', { userID: req.user._id, status: "processing" })
        const jobs = await agenda.jobs()
        console.log(jobs.attrs)
        req.user.jobs.asScheduleStatus = 'processing'
        req.user.save()
        res.send({message: "processing"})
    } catch (error) {
        res.status(500).send({error: `Error in Arbiter/Schedule: ${error}`})
    }
})

router.get('/api/arbiter/schedule-status', auth, async (req, res) => {
    try {
        await agenda.start()
        const jobs = await agenda.jobs()
        console.log(jobs[0].attrs.data)
        let status = req.user.jobs.asScheduleStatus
        if(status === 'complete'){
            return res.send({message: 'complete'})
        } else if(status === 'fail'){
            return res.send({message: 'fail'})
        } else if(status === 'invalid login'){
            return res.send({message: 'invalid login'})
        } else {
            res.send({message: "processing"})
        }
    } catch (error) {
        res.status(500).send({error: `Error in Arbiter/Schedule-status: ${error}`})
    }
})

router.get('/api/arbiter/blocks', auth, async (req, res) => {
    try {
        await agenda.start()
        await agenda.schedule('2 seconds', 'arbiter blocks', { user: req.user._id})
    } catch (error) {
        res.status(500).send({error: `Error in Arbiter/blocks: ${error}`})
    }
})

// router.get('/api/arbiter/groups', auth, async(req, res) => {
//     try {
//         await agenda.start()
//         await agenda.schedule('2 seconds', 'arbiter groups', {userID: req.user._id})
//         req.user.jobs.asGroupStatus = 'processing'
//         req.user.save()
//         res.send({message: "processing"})
//     } catch (error) {
//         res.status(500).send({error: `Error in Arbiter/groups: ${error}`})
//     }
// })

// router.get('/api/arbiter/payments', auth, async (req, res) => {

// })

// router.get('/api/arbiter/profile', auth, async (req, res) => {

// })


module.exports = router