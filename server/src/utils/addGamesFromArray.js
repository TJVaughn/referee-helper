const Game = require('../models/Game')
const calculateDistance = require('../utils/calculateDistance')
const formatGameLocation = require('./formatGameLocation')
// const formattedHorizonSchedule = require('./formattedhorizonschedule')
const addArenasFromGames = require('./AddArenasFromGames')

const updateRefGroup = (games, groups) => {
    for(let i = 0; i < games.length; i ++){
        for(let x = 0; x < groups.length; x++){
            // console.log("Games i group: " + games[i].group)
            // console.log("Group x group number: " + groups[x].group.number)
            if(games[i].group.title === groups[x].group.number || games[i].group.value === groups[x].group.number){
                games[i].group.title = groups[x].group.name
                // console.log("MATCH! games i group is: " + games[i].group)
            }
        }
    }
    return games
}
const findArenasInDb = (newArenas, oldArenas) => {
    let arenasToBeAdded = []
    newArenas.map((arena) => {
        for(let i = 0; i < oldArenas.length; i ++){
            if(arena.name === oldArenas[i].name && arena.address === oldArenas[i].address){
                return true
            }
        }
        arenasToBeAdded.push(arena)
    })
    return arenasToBeAdded
}

const assignDistanceDataToGames = (arenas, games) => {
    //for every game, find it's matching arena and assign the arena distnace and duratin to the game
    for(let i = 0; i < games.length; i ++){
        for(let x = 0; x < arenas.length; x++){
            if(games[i].formattedLocation === arenas[x].name){
                games[i].distance = arenas[x].distance
                games[i].duration = arenas[x].duration
            }
        }
    }
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

        //FIrst we format all of the new games locations
        newGamesToBeAdded = await formatGameLocation(newGamesToBeAdded, user.state)
        // newGamesToBeAdded = formattedHorizonSchedule

        //Then we will remove any duplicate arenas
        let newUniqueArenasFromGames = addArenasFromGames(newGamesToBeAdded)

        //Now we will check the database to see if there are existing arenas
        let currentArenas = await user.arenas
        
        let newArenasNotInDb = []
        newArenasNotInDb = findArenasInDb(newUniqueArenasFromGames, currentArenas)

        //Now we need to calculate distance to these arenas
        newArenasNotInDb = await calculateDistance(user, newArenasNotInDb)

        //Next we will save those arenas to the databse
        await newArenasNotInDb.map((arena) => {
            user.arenas = user.arenas.concat({ 
                name: arena.name,
                address: arena.address,
                distance: arena.distance,
                duration: arena.duration
             })
            user.save()
        })
        let allArenas = user.arenas
        //Next we will assign those distances and durations to their respective games
        assignDistanceDataToGames(allArenas, newGamesToBeAdded)
        newGamesToBeAdded = await updateRefGroup(newGamesToBeAdded, user.groups)

        //Adding all new games to the database
        newGamesToBeAdded.map((item) => {
            let game = new Game({
                dateTime: item.dateTime,
                refereeGroup: item.group.title,
                level: item.level,
                fees: item.fees,
                gameCode: item.gameId,
                location: item.location,
                formattedLocation: item.formattedLocation,
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

        // Just had one of my games updated, Same code, same date, different time.
        // The software didn't recognize it as a duplicate because I haven't thought of that edge case
        // It added a new game even though it doesn't exist
        
        return newGamesToBeAdded
    } catch (error) {
        return `Error in add games from Array: ${error}`
    }   
    
}

module.exports = addGamesfromArray