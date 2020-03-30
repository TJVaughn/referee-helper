const superagent = require('superagent')

const callMapsApi = async (user, game) => {
    try {
        // let mapsAPIURL = `https://maps.googleapis.com/maps/api/distancematrix/json?key=${process.env.MAPS_KEY}&origins=${user.street}${user.city}${user.state}&destinations=${encodeURI(games[i].location)}&units=imperial`
        // let response = await superagent.get(mapsAPIURL)
        // console.log("CALLED MAPS API")
        // response.res.text = JSON.parse(response.res.text)
        // game.distance = response.res.text.rows[0].elements[0].distance.text
        // game.duration = response.res.text.rows[0].elements[0].duration.text
        game.duration = "10"
        game.distance = "4"
        return game
    } catch (error) {
        return {error: "Error from Maps API: " + error}
    }
}
const formatLocation = async (game) => {
    try {
        const mapsPlaceUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURI(game.location)}&inputtype=textquery&key=${process.env.MAPS_KEY}&fields=formatted_address,name`
        let response = await superagent.get(mapsPlaceUrl)
        response = JSON.parse(response.res.text)
        console.log(response.candidates[0].name)
        game.formattedLocation = response.candidates[0].name
        return game
    } catch (error) {
        console.log(error)
        return game.formattedLocation = game.location
    }
    
}

const calculateDistance = async (user, newGames, currentSchedule) => {

    // newGames.map(game => {
    //     console.log({
    //         dateTime: game.dateTime,
    //         refereeGroup: game.group,
    //         level: game.level,
    //         fees: game.fees,
    //         gameCode: game.gameId,
    //         location: game.location,
    //         position: game.position,
    //         home: game.home,
    //         away: game.away,
    //         owner: user._id,
    //         status: game.status,
    //         paid: game.paid
    //     })
    // })
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

    let updatedGames = []
    let numOfMatches = 0
    for(let i = 0; i < newGames.length; i++){
        console.log(newGames[i])
        await formatLocation(newGames[i])
        // console.log("New Game Schedule game location: " + newGames[i].location)
        if(!newGames[i].distance){
            for(let x = 0; x < currentSchedule.length; x++){
                // console.log("Current Schedule Game Location: "+ currentSchedule[x].location)
                if(currentSchedule[x].formattedLocation === newGames[i].formattedLocation){
                    numOfMatches += 1
                    newGames[i].duration = currentSchedule[x].duration
                    return newGames[i].distance = currentSchedule[x].distance
                }
            }
            updatedGames.push(await callMapsApi(user, newGames[i]))
        }
    }
    return updatedGames
}

module.exports = calculateDistance;