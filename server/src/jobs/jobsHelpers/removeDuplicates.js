const Event = require('../../models/Event')

const removeDuplicates = async (dateTime, location, gameCode) => {
    let unMatched = []
    let matches = await Event.find({dateTime, location, gameCode})
    if(matches.length > 0){
        return 
    }
    return matches
}

module.exports = removeDuplicates