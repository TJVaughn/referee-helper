const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    dateTime: {
        type: String,
        required: true
    },
    type: {
        type: String
    },
    location: {
        type: String
    },
    status: {
        type: String
    },
    platform: {
        type: String
    },
    gameCode: {
        type: String
    },
    hasBlock: {
        type: Boolean
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Event = mongoose.model("Event", eventSchema)

module.exports = Event