const Event = require('../../models/Event')

const addEventsfromArray = async (newGames, platform, owner) => {
    try {
        if(!newGames || !platform || !owner){
            throw new Error("All params are required")
        }
        await newGames.map(async(item) => {
            let event = new Event({
                dateTime: item.dateTime,
                gameCode: item.gameCode,
                location: item.location,
                platform,
                owner,
                status: item.status,
                type: "game"
            })
            await event.save()
        })
        return newGames
    } catch (error) {
        return {error: `Error in add games from Array: ${error}`}
    }
}
module.exports = addEventsfromArray