const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Event = require('../models/Event')

// Manually Create Event
router.post('/api/event', auth, async (req, res) => {
    try {
        let values = [...Object.values(req.body)]
        values.forEach(val => {
            if(typeof val !== 'string' && typeof val !== 'number'){
                return res.status(400).send({error: "Invalid data type"})
            }
        })
        
        const event = new Event({
            dateTime: req.body.dateTime,
            type: req.body.type,
            location: req.body.location,
            gameCode: req.body.gameCode,
            hasBlock: false,
            platform: 'Referee Helper',
            owner: req.user._id
        })
        await event.save()
        return res.status(201).send(event)
    } catch (error) {
        return res.status(418).send({error: "Error from create game: " + error})
    }
})
//Read Single Event by ID
router.get('/api/event/:id', auth, async (req, res) => {
    try {
        const event = await Event.findOne({_id: req.params.id, owner: req.user._id})
        if(!event){
            return res.status(404).send({error: "Event not found"})
        }
        return res.send(event)
    } catch (error) {
        return res.status(500).send({error: "Error in read single event by ID: " + error})
    }
})
//Update Event by ID
router.patch('/api/event/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = [
        "dateTime", "location", "platform", "type"
    ]
    const isValidUpdate = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if(!isValidUpdate){
        return res.status(418).send({error: "Invalid Update"})
    }
    try {
        const event = await Event.findOne({owner: req.user._id, _id: req.params.id})
        if(!event){
            return res.status(404).send({error: "Event not found"})
        }
        updates.forEach((update) => {
            event[update] = req.body[update]
        })
        await event.save()
        return res.send(event)
    } catch (error) {
        return res.status(500).send({error: "Error in update event by ID"})
    }
})
//Delete Event
router.delete('/api/event/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id
        const event = await Game.findOneAndDelete({owner: req.user._id, _id})
        return res.send(event)
    } catch (error) {
        return res.status(500).send({error: 'Error in deleting event'})
    }
})
//Get all Events
router.get('/api/all-events', auth, async (req, res) => {
    try {
        const events = await Event.find({ owner: req.user._id })
        if(!events){
            events = []
            return res.send(events)
        }
        events.sort((a, b) => {
            //asc
            return a.dateTime - b.dateTime
            //desc
            return b.dateTime - a.dateTime
        })
        return res.send(events)
        
    } catch (error) {
        return res.status(500).send({error: "Error from get all events: " + error})
    }
})

module.exports = router