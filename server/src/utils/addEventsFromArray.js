const Event = require('../models/Event')

const addEventsfromArray = async (newGames, platform) => {
    try {
        if(!newGames){
            throw new Error("All params are required")
        }
        await newGames.map((item) => {
            let event = new Event({
                dateTime: item.dateTime,
                gameCode: item.gameCode,
                location: item.location,
                platform,
                owner: user._id,
                status: item.status,
                type: "game"
            })
            event.save()
        })
    } catch (error) {
        return {error: `Error in add games from Array: ${error}`}
    }
}
module.exports = addEventsfromArray