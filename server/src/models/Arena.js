const mongoose = require('mongoose')

const arenaSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        trim: true
    },
    street: {
        required: true,
        type: String,
        trim: true
    },
    city: {
        required: true,
        type: String,
        trim: true
    },
    state: {
        required: true,
        type: String,
        trim: true
    },
    zipCode: {
        required: true,
        type: Number,
        trim: true
    },
    country: {
        required: true,
        type: String,
        trim: true
    },
    directionsToRefRoom: {
        type: String
    }
}, {
    timestamps: true
})

const Arena = mongoose.model("Arena", arenaSchema)

module.exports = Arena