const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/User')
const Event = require('../../src/models/Event')

const user1ID = new mongoose.Types.ObjectId()
const user1 = {
    _id: user1ID,
    name: "John",
    email: "john@example.com",
    password: "jumpingjohn",
    tokens: [{
        token: jwt.sign({ _id: user1ID }, process.env.JWT_SECRET)
    }]
}

const user2ID = new mongoose.Types.ObjectId()
const user2 = {
    _id: user2ID,
    name: "Bill",
    email: "bill@example.com",
    password: "bumpingbill",
    tokens: [{
        token: jwt.sign({ _id: user2ID }, process.env.JWT_SECRET)
    }]
}

const event1 = {
    _id: new mongoose.Types.ObjectId(),
    dateTime: "4/15/20 9:45:00 PM",
    location: "Stamford Twin Rinks",
    fees: 5000,
    owner: user1._id
}
const event2 = {
    _id: new mongoose.Types.ObjectId(),
    dateTime: "5/15/20 9:45:00 PM",
    location: "Stamford Twin Rinks",
    fees: 5000,
    owner: user1._id
}
const event3 = {
    _id: new mongoose.Types.ObjectId(),
    dateTime: "4/15/20 9:45:00 PM",
    location: "Stamford Twin Rinks",
    gameCode: "45567",
    fees: 5000,
    owner: user2._id
}
const event4 = {
    _id: new mongoose.Types.ObjectId(),
    dateTime: "5/26/20 9:45:00 PM",
    location: "Stamford Twin Rinks",
    gameCode: "45567",
    fees: 5000,
    owner: user2._id
}
const newEvent1 = {
    _id: new mongoose.Types.ObjectId(),
    dateTime: "5/27/20 9:45:00 PM",
    location: "Stamford Twin Rinks",
    gameCode: "2346",
    fees: 5000,
    owner: user2._id
}
const newEvent2 = {
    _id: new mongoose.Types.ObjectId(),
    dateTime: "5/26/20 9:45:00 PM",
    location: "Stamford Twin Rinks",
    gameCode: "45567",
    fees: 5000,
    owner: user2._id
}

const setupDB = async () => {
    await User.deleteMany()
    await new User(user1).save()
    await new User(user2).save()
    await Event.deleteMany({})

    await new Event(event1).save()
    await new Event(event2).save()
    await new Event(event3).save()
    await new Event(event4).save()
}

module.exports = {user1, user2, event1, event2, event3, event4, newEvent1, newEvent2, setupDB}