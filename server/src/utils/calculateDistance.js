const superagent = require('superagent')

const calculateDistance = async (user, arenas) => {
    try {
        let num = user.hasCalledDistanceMatrixApi
        for(let i = 0; i < arenas.length; i++){
            if(!arenas[i].distance){
                let mapsAPIURL = `https://maps.googleapis.com/maps/api/distancematrix/json?key=${process.env.MAPS_KEY}&origins=${user.street}${user.city}${user.state}&destinations=${encodeURI(arenas[i].address)}&units=imperial`
                let response = await superagent.get(mapsAPIURL)
                num += 1
                console.log("CALLED MAPS API " + num)
                response.res.text = JSON.parse(response.res.text)
                let distance = response.res.text.rows[0].elements[0].distance.text
                let duration = response.res.text.rows[0].elements[0].duration.text
                distance = distance.split('mi').shift()
                distance = distance.trim().split('.')
                if(distance.length === 1){
                    distance = distance[0] + "0"
                    distance = parseInt(distance)
                } else if(distance.length === 2){
                    distance = distance.join('')
                    distance = parseInt(distance)
                }
                // console.log(duration)
                if(duration.includes('hour')){
                    let hours = duration
                    hours = hours.split('hour').shift()
                    hours = hours.trim()
                    hours = parseInt(hours)
                    hours *= 60
                    let mins = duration
                    mins = mins.split(' ').splice(2, 1)
                    mins = parseInt(mins)
                    duration = hours + mins
                } else {
                    let mins = duration
                    mins = mins.split(' ').shift()
                    mins = parseInt(mins)
                    duration = mins
                }
                if(distance === NaN){
                    distance = 0
                    duration = 0
                }
                arenas[i].distance = distance;
                arenas[i].duration = duration;
                // console.log(`Arena in calculate Miles: ${arenas[i].name},`)
                // console.log(`Distance: ${arenas[i].distance}, duration: ${arenas[i].duration}`)
            }
        }
        
        // game.duration = "10"
        // game.distance = "4"
        return { arenas, num }
    } catch (error) {
        return {error: "Error from Maps API: " + error}
    }
}
module.exports = calculateDistance;
