const Game = require('../models/Game')

const updateRefGroup = (games, groups) => {
    for(let i = 0; i < games.length; i ++){
        for(let x = 0; x < groups.length; x++){
            if(games[i].group.title === groups[x].group.number || games[i].group.value === groups[x].group.number){
                games[i].group.title = groups[x].group.name
            }
        }
    }
    return games
}

const addGamesfromArray = async (schedule, platform, user, currentSchedule) => {

    try {
        if(!schedule){
            throw new Error("No schedule provided")
        }
        if(!currentSchedule){
            throw new Error("Error in current schedule")
        }
        const findMatchInDb = (object) => {
            for(let num = 0; num < currentSchedule.length; num++){
                if(object.gameId.toString().toLowerCase() === 'event' && object.dateTime.toString() === currentSchedule[num].dateTime.toString() && object.location === currentSchedule[num].location){
                    return num
                }
                if((object.gameId.toString().toLowerCase() !== 'event' && object.gameId === currentSchedule[num].gameCode) || (object.dateTime.toString() === currentSchedule[num].dateTime.toString() && object.location === currentSchedule[num].location)){
                    //If there is a match, return the current index
                    return num
                }
            }
            return false
        }
        let newGamesToBeAdded = []
        let gamesToBeUpdated = []
        schedule.map((gameIm) => {
            let isMatch = findMatchInDb(gameIm)
            if(!isMatch){
                return newGamesToBeAdded.push(gameIm)
            }
            //Duplicate, we need to update the game if the game info is different
            // if isMatch is not false, we get the index of the game in the current schedule array
            currgame = currentSchedule[isMatch]
            const updates = Object.keys(gameIm)
            updates.forEach((update) => {
                currgame[update] = gameIm[update]
            })

            return gamesToBeUpdated.push(currgame)

        })

        //FIrst we format all of the new games locations
        // newGamesToBeAdded = await formatGameLocation(newGamesToBeAdded, user.state)
        // newGamesToBeAdded = formattedHorizonSchedule

        newGamesToBeAdded = await updateRefGroup(newGamesToBeAdded, user.groups)

        //Adding all new games to the database
        await newGamesToBeAdded.map((item) => {
            let game = new Game({
                dateTime: item.dateTime,
                refereeGroup: item.group.title,
                level: item.level,
                fees: item.fees,
                gameCode: item.gameId,
                location: item.location,
                formattedLocation: item.formattedLocation,
                locationAddress: item.locationAddress,
                position: item.position,
                home: item.home,
                away: item.away,
                platform,
                owner: user._id,
                status: item.status,
                paid: item.paid,
                distance: 0,
                duration: 0
            })

            game.save()
        })
        gamesToBeUpdated.map((game) => {
            game.save()
        })

        // Just had one of my games updated, Same code, same date, different time.
        // The software didn't recognize it as a duplicate because I haven't thought of that edge case
        // It added a new game even though it doesn't exist
        
        return [newGamesToBeAdded, gamesToBeUpdated]
    } catch (error) {
        return `Error in add games from Array: ${error}`
    }   
    
}

module.exports = addGamesfromArray