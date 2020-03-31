const superagent = require('superagent')


    // NO ARENAS IN THE DATABASE
    // For each games distance
    // If the game doesnt have a distance
    // It will see if there is another game in the database that does have a distance to The SAME LOCATION
    // AKA iterate over every game, 
    // If there is another game with the same arena, and distance is calculated, 
    // the curr game will adopt the other games distance and duration
    // Otherwise it will call the Google distance matrix API
    // And assign the games distance with that
    // ++ Only calls Maps distance matrix API for each arena (Around $0.15 all time unless official moves)
    // ++ Database remains as lean as possible, no arenas
    // ++ Database cost will remain low
    // -- For each game, there will be more functions called when it is imported, slowing down the already slow process
    // -- There's more code and more work, possibly creating more bugs



const formatLocation = async (games, state) => {
    for(let i = 0; i < games.length; i++){
        try {
            // console.log(games[i].location + " hockey rink " + state)
            const mapsPlaceUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURI(games[i].location + " hockey rink " + state)}&inputtype=textquery&key=${process.env.MAPS_KEY}&fields=formatted_address,name`
            let response = await superagent.get(mapsPlaceUrl)
            response = JSON.parse(response.res.text)
            // console.log(response.candidates[0].name)
            games[i].formattedLocation = response.candidates[0].name
        } catch (error) {
            // console.log(error)
            games[i].formattedLocation = games[i].location
        }
    }
    return games
}

const findUniqueArenas = (games) => {
    let arenas = []
    for(let i = 0; i < games.length; i++){
        arenas.push(games[i].formattedLocation)
    }
    // console.log(arenas)
    let uniques = [...new Set(arenas)]

    return uniques
}   
const callMapsApi = async (user, arenas) => {
    try {
        for(let i = 0; i < arenas.length; i++){
            //we will call maps api for each arena and input the data below
            //for now we will save money in testing by manually adding that data
            let mapsAPIURL = `https://maps.googleapis.com/maps/api/distancematrix/json?key=${process.env.MAPS_KEY}&origins=${user.street}${user.city}${user.state}&destinations=${encodeURI(arenas[i].name)}&units=imperial`
            let response = await superagent.get(mapsAPIURL)
            console.log("CALLED MAPS API")
            response.res.text = JSON.parse(response.res.text)
            arenas[i].distance = response.res.text.rows[0].elements[0].distance.text
            arenas[i].duration = response.res.text.rows[0].elements[0].duration.text
            // arenas[i].distance = i + 1;
            // arenas[i].duration = i + 6;
            console.log(`Distance: ${arenas[i].distance}, duration: ${arenas[i].duration}`)
        }
        
        // game.duration = "10"
        // game.distance = "4"
        return arenas
    } catch (error) {
        return {error: "Error from Maps API: " + error}
    }
}

const assignDistanceToGames = (mapsData, newGames) => {
    //Iterate over every game
    for(let i = 0; i < newGames.length; i++){
        // Iterate over every arena for every game
        for(let x = 0; x < mapsData.length; x++){
            if(newGames[i].formattedLocation === mapsData[x].name){
                newGames[i].distance = mapsData[x].distance
                newGames[i].duration = mapsData[x].duration
            }
        }
    }
    return newGames
}

const checkDbForMatchingLocations = (arenas, currentSchedule) => {
    let matchedArenas = []
    for(let i = 0; i < arenas.length; i ++){
        // Then if there is a match in the db we will assign it a distance
        for(let x = 0; x < currentSchedule.length; x ++){
            //Iterates over every game in the DB for each new Game
            if(arenas[i].name === currentSchedule[x].formattedLocation){
                arenas[i].distance = currentSchedule[x].distance
                arenas[i].duration = currentSchedule[x].duration
                console.log(`In Check DB: Name: ${arenas[i].name}, Distance: ${arenas[i].distance}, Duration: ${arenas[i].duration}`)
                matchedArenas.push(arenas[i])
            }
        }
    }
    return matchedArenas
}

const formatArenas = (arenas) => {
    // console.log("Format arenas: " + arenas)
    let formattedArenas = []

    for (let i = 0; i < arenas.length; i++){
        let arena = {
            name: arenas[i],
            distance: 0,
            duration: 0
        }
        formattedArenas.push(arena)
        console.log(`Name: ${arena.name}, Distance: ${arena.distance}`)
    }
    return formattedArenas
}

const calculateDistance = async (user, newGames, currentSchedule) => {
    try {
        // If there aren't any games in the current database
        if(currentSchedule.length < 1){
            console.log("Database is empty")
            //First lets format all the game locations
            newgames = await formatLocation(newGames, user.state)
            // console.log(newgames)


            // Then we will check for duplicate arenas 
            let arenas = findUniqueArenas(newGames)
            console.log(arenas)

            arenas = formatArenas(arenas)
            console.log(arenas)

            //Then we will do a maps API call from the users address to the arenas on the list
            let mapsData = await callMapsApi(user, arenas)
            console.log(mapsData)


            //Then we will use that data to assign distance and duration to list of games
            newGames = assignDistanceToGames(mapsData, newGames)
            // console.log(newGames)
            return newGames
        }

        console.log("Database has games")
        //First we need to format the game locations of the new games
        newGames = await formatLocation(newGames, user.state)
        console.log("New Games with formatted location: " + newGames)

        // Then we will widdle down the new arenas to uniques
        let arenas = findUniqueArenas(newGames)
        console.log("Unique arenas: "+ arenas)

        // Then we will format the arenas to be objects
        arenas = formatArenas(arenas)
        console.log("Current arenas: " + typeof arenas)
        // Then we will see if there is another game with the same formatted location
        let matchedArenas = checkDbForMatchingLocations(arenas, currentSchedule)
        // console.log("Current arenas after checking for match: " + arenas)


        //If there isn't any matching in the Database, call the maps api for the new arenas
        let newArenas = []
        for(let i = 0; i < arenas.length; i++ ) {
            if(arenas[i].distance === 0){
                console.log(`New arena name: ${arenas[i].name}`)
                newArenas.push(arenas[i])
            }
        }

        newArenas = await callMapsApi(user, newArenas)
        // console.log("New arenas: " + newArenas)
        let allArenas = []
        matchedArenas.forEach((arena) => {
            allArenas.push(arena)
        })
        newArenas.forEach((arena) => {
            allArenas.push(arena)
        })
        // console.log("all arenas: " + allArenas)

        newGames = assignDistanceToGames(allArenas, newGames)
        return newGames
    } catch (error) {
        return {error: "Error in calculate distance: " + error}
    }
}

module.exports = calculateDistance;