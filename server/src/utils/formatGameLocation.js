const superagent = require('superagent')

const formatGameLocation = async (games, state) => {
    for(let i = 0; i < games.length; i++){
        try {
            // console.log(games[i].location + " hockey rink " + state)
            const mapsPlaceUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURI(games[i].location + " hockey rink " + state)}&inputtype=textquery&key=${process.env.MAPS_KEY}&fields=formatted_address,name`
            let response = await superagent.get(mapsPlaceUrl)
            response = JSON.parse(response.res.text)
            console.log(response)
            games[i].formattedLocation = response.candidates[0].name
            games[i].locationAddress = response.candidates[0].formatted_address
        } catch (error) {
            games[i].formattedLocation = games[i].location
            games[i].locationAddress = ""
        }
        
    }

    return games
}
module.exports = formatGameLocation