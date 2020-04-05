const mongoose = require('mongoose')

const arenaSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    street: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
    zipCode: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    distance: {
        type: Number
    },
    duration: {
        type: Number
    },
    directionsToRefRoom: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Arena = mongoose.model("Arena", arenaSchema)

module.exports = Arena