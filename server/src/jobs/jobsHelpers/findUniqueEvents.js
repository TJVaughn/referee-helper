const Event = require('../../models/Event')

const findUniqueEvents = async (events) => {
    let uniques = []
    for(let i = 0; i < events.length; i++){
        let match = await Event.find({dateTime: events[i].dateTime, location: events[i].location, gameCode: events[i].gameCode})
        if(match.length < 1){
            uniques.push(events[i])
        }
    }
    return uniques
}

module.exports = findUniqueEvents