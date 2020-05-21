const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/User')
const Game = require('../../src/models/Game')

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

const game1 = {
    _id: new mongoose.Types.ObjectId(),
    dateTime: "4/15/20 9:45:00 PM",
    location: "Stamford Twin Rinks",
    fees: 5000,
    owner: user1._id
}
const game2 = {
    _id: new mongoose.Types.ObjectId(),
    dateTime: "5/15/20 9:45:00 PM",
    location: "Stamford Twin Rinks",
    fees: 5000,
    owner: user1._id
}
const game3 = {
    _id: new mongoose.Types.ObjectId(),
    dateTime: "4/15/20 9:45:00 PM",
    location: "Stamford Twin Rinks",
    fees: 5000,
    owner: user2._id
}
const game4 = {
    _id: new mongoose.Types.ObjectId(),
    dateTime: "5/15/20 9:45:00 PM",
    location: "Stamford Twin Rinks",
    fees: 5000,
    owner: user2._id
}

const setupDB = async () => {
    await User.deleteMany()
    await new User(user1).save()
    await new User(user2).save()
    await Game.deleteMany({})

    await new Game(game1).save()
    await new Game(game2).save()
    await new Game(game3).save()
    await new Game(game4).save()
}

module.exports = {user1, user2, game1, game2, game3, game4, setupDB}