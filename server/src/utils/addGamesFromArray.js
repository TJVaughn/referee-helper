const Game = require('../models/Game')
const calculateDistance = require('../utils/calculateDistance')

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

            if(gameIm.fees === currgame.fees){
                return
            } else {
                if(gameIm.paid){
                    currgame.paid = gameIm.paid
                }
                currgame.status = gameIm.status
                gamesToBeUpdated.push(currgame)
            }

        })
        // Calculate Distance and Duration here
        // All Schedule syncing will ultimately call this
        //Takes in current array of new games
        // Returns new array of games with appended distance and duration
        
        await calculateDistance(user, newGamesToBeAdded, currentSchedule)

        //Adding all new games to the database
        newGamesToBeAdded.map((item) => {
            let game = new Game({
                dateTime: item.dateTime,
                refereeGroup: item.group,
                level: item.level,
                fees: item.fees,
                gameCode: item.gameId,
                location: item.location,
                position: item.position,
                home: item.home,
                away: item.away,
                platform,
                owner: user._id,
                status: item.status,
                paid: item.paid,
                distance: item.distance,
                duration: item.duration
            })

            game.save()
        })
        gamesToBeUpdated.map((game) => {
            game.save()
        })

        //Getting parallel save error for two games. 
        // 10/14/18, 5:30 PM CPCT
        // Second 1/18/19 South Kent game 
        // The reason for this is that they have the same date and time as the game prior

        // Just had one of my games updated, Same code, same date, different time.
        // The software didn't recognize it as a duplicate because I haven't thought of that edge case
        // It added a new game even though it doesn't exist
        
        return newGamesToBeAdded
    } catch (error) {
        return `Error in add games from Array: ${error}`
    }   
    
}

module.exports = addGamesfromArray