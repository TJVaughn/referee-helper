const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    dateTime: {
        type: mongoose.Schema.Types.Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    formattedLocation: {
        type: String
    },
    locationAddress: {
        type: String
    },
    distance: {
        type: Number
    },
    duration: {
        type: Number
    },
    refereeGroup: {
        type: String
    },
    status: {
        type: String
    },
    platform: {
        type: String
    },
    level: {
        type: String
    },
    fees: {
        type: Number
    },
    paid: {
        type: Boolean
    },
    gameCode: {
        type: String
    },
    position: {
        type: String
    },
    homeTeam: {
        type: String
    },
    awayTeam: {
        type: String
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Game = mongoose.model("Game", gameSchema)

module.exports = Game