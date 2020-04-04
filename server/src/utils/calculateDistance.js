const superagent = require('superagent')

const calculateDistance = async (user, arenas) => {
    try {
        for(let i = 0; i < arenas.length; i++){

            // let mapsAPIURL = `https://maps.googleapis.com/maps/api/distancematrix/json?key=${process.env.MAPS_KEY}&origins=${user.street}${user.city}${user.state}&destinations=${encodeURI(arenas[i].name)}&units=imperial`
            // let response = await superagent.get(mapsAPIURL)
            // console.log("CALLED MAPS API")
            // response.res.text = JSON.parse(response.res.text)
            // arenas[i].distance = response.res.text.rows[0].elements[0].distance.text
            // arenas[i].duration = response.res.text.rows[0].elements[0].duration.text

            arenas[i].distance = i + 1;
            arenas[i].duration = i + 6;
            console.log(`Arena in calculate Miles: ${arenas[i].name}, ${arenas[i].street}`)
            // console.log(`Distance: ${arenas[i].distance}, duration: ${arenas[i].duration}`)
        }
        
        // game.duration = "10"
        // game.distance = "4"
        return arenas
    } catch (error) {
        return {error: "Error from Maps API: " + error}
    }
}
module.exports = calculateDistance;

// const resultOfFormatLocation = [
//     {
//       name: 'Chelsea Piers Connecticut',
//       address: '1 Blachley Rd, Stamford, CT 06902, United States'
//     },
//     {
//       name: 'Chelsea Piers Connecticut',
//       address: '1 Blachley Rd, Stamford, CT 06902, United States'
//     },
//     {
//       name: 'Chelsea Piers Connecticut',
//       address: '1 Blachley Rd, Stamford, CT 06902, United States'
//     },
//     {
//       name: 'Chelsea Piers Connecticut',
//       address: '1 Blachley Rd, Stamford, CT 06902, United States'
//     },
//     {
//       name: 'Chelsea Piers Connecticut',
//       address: '1 Blachley Rd, Stamford, CT 06902, United States'
//     },
//     {
//       name: 'Chelsea Piers Connecticut',
//       address: '1 Blachley Rd, Stamford, CT 06902, United States'
//     },
//     {
//       name: 'Icenter Salem',
//       address: '60 Lowell Rd, Salem, NH 03079, United States'
//     },
//     {
//       name: 'Icenter Salem',
//       address: '60 Lowell Rd, Salem, NH 03079, United States'
//     },
//      {
//        name: 'Icenter Salem',
//        address: '60 Lowell Rd, Salem, NH 03079, United States'
//      },
//      {
//        name: 'Icenter Salem',
//        address: '60 Lowell Rd, Salem, NH 03079, United States'
//      },
//      {
//        name: 'Icenter Salem',
//        address: '60 Lowell Rd, Salem, NH 03079, United States'
//      },
//      {
//        name: 'Icenter Salem',
//        address: '60 Lowell Rd, Salem, NH 03079, United States'
//      },
//      {
//        name: 'Stamford Twin Rinks',
//        address: '1063 Hope St, Stamford, CT 06907, United States'
//      },
//      {
//        name: 'Stamford Twin Rinks',
//        address: '1063 Hope St, Stamford, CT 06907, United States'
//      },
//      {
//        name: 'Stamford Twin Rinks',
//        address: '1063 Hope St, Stamford, CT 06907, United States'
//      },
//      {
//        name: 'Stamford Twin Rinks',
//        address: '1063 Hope St, Stamford, CT 06907, United States'
//      },
//      {
//        name: 'Brewster Ice Arena',
//        address: '63 Fields Ln, Brewster, NY 10509, United States'
//      },
//      {
//        name: 'Chelsea Piers Connecticut',
//        address: '1 Blachley Rd, Stamford, CT 06902, United States'
//      },
//      {
//        name: 'Chelsea Piers Connecticut',
//        address: '1 Blachley Rd, Stamford, CT 06902, United States'
//      },
//      {
//        name: 'Stamford Twin Rinks',
//        address: '1063 Hope St, Stamford, CT 06907, United States'
//      },
//      {
//        name: 'Admiral Stockdale Arena',
//        address: 'South Kent, CT 06785, United States'
//      },
//      {
//        name: 'Admiral Stockdale Arena',
//        address: 'South Kent, CT 06785, United States'
//      },
//      {
//        name: 'Admiral Stockdale Arena',
//        address: 'South Kent, CT 06785, United States'
//      },
//      {
//        name: 'Admiral Stockdale Arena',
//        address: 'South Kent, CT 06785, United States'
//      },
//      {
//        name: 'Admiral Stockdale Arena',
//        address: 'South Kent, CT 06785, United States'
//      }
// ]

// const formatLocation = async (games, state) => {
//     // let arenas = []
//     // for(let i = 0; i < games.length; i++){
//     //     try {
//     //         // console.log(games[i].location + " hockey rink " + state)
//     //         const mapsPlaceUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURI(games[i].location + " hockey rink " + state)}&inputtype=textquery&key=${process.env.MAPS_KEY}&fields=formatted_address,name`
//     //         let response = await superagent.get(mapsPlaceUrl)
//     //         response = JSON.parse(response.res.text)
//     //         // console.log(response.candidates)
//     //         games[i].formattedLocation = response.candidates[0].name
//     //         let arena = {
//     //             name: response.candidates[0].name,
//     //             address: response.candidates[0].formatted_address
//     //         }
//     //         console.log(arena)
//     //         arenas.push(arena)
//     //     } catch (error) {
//     //         // console.log(error)
//     //         games[i].formattedLocation = games[i].location
//     //     }
//     // }
//     // return {games: games, arenas: arenas}
//     return {games: games, arenas: resultOfFormatLocation }
// }

// // const findUniqueArenas = (games) => {
// //     let arenas = []
// //     for(let i = 0; i < games.length; i++){
// //         arenas.push(games[i].formattedLocation)
// //     }
// //     // console.log(arenas)
// //     let uniques = [...new Set(arenas)]

// //     return uniques
// // }   
// const calculateMiles = async (user, arenas) => {
//     try {
//         for(let i = 0; i < arenas.length; i++){


//             // let mapsAPIURL = `https://maps.googleapis.com/maps/api/distancematrix/json?key=${process.env.MAPS_KEY}&origins=${user.street}${user.city}${user.state}&destinations=${encodeURI(arenas[i].name)}&units=imperial`
//             // let response = await superagent.get(mapsAPIURL)
//             // console.log("CALLED MAPS API")
//             // response.res.text = JSON.parse(response.res.text)
//             // arenas[i].distance = response.res.text.rows[0].elements[0].distance.text
//             // arenas[i].duration = response.res.text.rows[0].elements[0].duration.text


//             arenas[i].distance = i + 1;
//             arenas[i].duration = i + 6;
//             console.log(`Arena in calculate Miles: ${arenas[i].name}, ${arenas[i].street}`)
//             // console.log(`Distance: ${arenas[i].distance}, duration: ${arenas[i].duration}`)
//         }
        
//         // game.duration = "10"
//         // game.distance = "4"
//         return arenas
//     } catch (error) {
//         return {error: "Error from Maps API: " + error}
//     }
// }

// const assignDistanceToGames = (mapsData, newGames) => {
//     //Iterate over every game
//     for(let i = 0; i < newGames.length; i++){
//         // Iterate over every arena for every game
//         for(let x = 0; x < mapsData.length; x++){
//             if(newGames[i].formattedLocation === mapsData[x].name){
//                 newGames[i].distance = mapsData[x].distance
//                 newGames[i].duration = mapsData[x].duration
//             }
//         }
//     }
//     return newGames
// }

// // const checkDbForMatchingLocations = (arenas, currentSchedule) => {
// //     let matchedArenas = []
// //     for(let i = 0; i < arenas.length; i ++){
// //         // Then if there is a match in the db we will assign it a distance
// //         for(let x = 0; x < currentSchedule.length; x ++){
// //             //Iterates over every game in the DB for each new Game
// //             if(arenas[i].name === currentSchedule[x].formattedLocation){
// //                 arenas[i].distance = currentSchedule[x].distance
// //                 arenas[i].duration = currentSchedule[x].duration
// //                 // console.log(`In Check DB: Name: ${arenas[i].name}, Distance: ${arenas[i].distance}, Duration: ${arenas[i].duration}`)
// //                 matchedArenas.push(arenas[i])
// //             }
// //         }
// //     }
// //     return matchedArenas
// // }

// const formatArenas = (arenas) => {
//     // console.log("Format arenas: " + arenas)
//     let formattedArenas = []

//     for (let i = 0; i < arenas.length; i++){
//         let address = arenas[i].address
//         let street = address.split(',').shift()
//         let city = address.split(',').splice(1, 1)
//         let state = address.split(',').splice(2, 1)
//         state = state.join('').split(' ').shift()
//         let zipcode = address.split(',').splice(2, 1)
//         zipcode = zipcode.join('').split(' ').pop()

//         let arena = {
//             name: arenas[i].name,
//             street,
//             city,
//             state,
//             zipcode,
//             distance: 0,
//             duration: 0
//         }
//         // console.log(`Arena in formatArenas(): ${arena}`)
//         formattedArenas.push(arena)
//         // console.log(`Name: ${arena.name}, Distance: ${arena.distance}`)
//     }
//     return formattedArenas
// }

// const checkUserForDuplicateArenas = async (currArenas, newArenas) => {
//     const arenasToAdd = []
//     for(let i = 0; i < newArenas.length; i++){
//         for(let x = 0; x < currArenas.length; x ++){
//             if(newArenas[i].name !== currArenas[x].name && newArenas[i].street !== currArenas[x].street) {
//                 arenasToAdd.push(newArenas[i])
//             }
//         }
//     }
//     return arenasToAdd
// }

// const calculateDistance = async (newGames, userID) => {
//     try {
//         const user = await User.findById(userID)
//         if(!user){
//             throw new Error("No user found")
//         }
//         //First, no matter what, we will format the locations on the games
//         //   and we will return the game with formatted name, as well as arena address
//         const gamesWithFormattedLocationsAndArenas = await formatLocation(newGames, user.state)
//         // console.log(`Games with formatted locations: ${gamesWithFormattedLocationsAndArenas[0]}`)
//         gamesWithFormattedLocationsAndArenas.arenas.map((arena) => {
//             console.log(`Arenas from above: ${arena.name}, ${arena.address}`)

//         })
//         let uniqueArenas = gamesWithFormattedLocationsAndArenas.arenas
//         //Then we will remove duplicates from the arenas array
//         uniqueArenas = [...new Set(uniqueArenas.name)]
//         uniqueArenas.map((arena) => {
//             console.log(`Unique arenas: ${arena.name}, ${arena.address}`)

//         })

//         //Then we will format the arenas to work with the model
//         let uniqueFormattedArenas = formatArenas(uniqueArenas)
//         // console.log(`Unique formatted arenas: ${uniqueFormattedArenas}`)

//         //Then we will check if there are any arenas on the user currently
//         const currentArenas = user.arenas
//         console.log(`Current Arenas on the user: ${currentArenas.length}`)

//         if(currentArenas.length > 0) {
//             //There are arenas on the user
//             //Then we will check for duplicates
//             uniqueFormattedArenas = checkUserForDuplicateArenas(currentArenas, uniqueFormattedArenas)
//             console.log(`Unique formatted arena 0 after checking user for duplicates, should be blank rn: ${uniqueFormattedArenas[0]}`)
//         }
//         //NO ARENAS ON THE USER
//         //Then we will just add all the new arenas to the user
        
//         //Once we have the new arenas, lets calc miles
//         // While doing this, we will zero out distance if it's greater that 150
//         let newUniqueArenas = calculateMiles(user, uniqueFormattedArenas)
//         newUniqueArenas.map((arena) => {
//             console.log(`New Unique arenas after miles are calc'd: ${arena}`)

//         })

//         //Now that we have new, unique arenas with distance calc'd, Let's save them to the user

//         for(let i = 0; i < newUniqueArenas.length; i ++){
//             user.arenas = user.arenas.concat({
//                 name: newUniqueArenas[i].name,
//                 street: newUniqueArenas[i].street,
//                 city: newUniqueArenas[i].city,
//                 state: newUniqueArenas[i].state,
//                 zipcode: newUniqueArenas[i].zipcode,
//                 distance: newUniqueArenas[i].distance,
//                 duration: newUniqueArenas[i].duration
//             })
//         }
//         console.log(`User after arenas have been concattenated: ${user.arenas}`)
//         await user.save()

//         newGames = assignDistanceToGames(newUniqueArenas, newGames)
//         newGames.map((game) => {
//             console.log(`New Games with new distance assigned to them: ${game}`)
//         })
//         return newGames




//         // // If there aren't any games in the current database
//         // if(currentSchedule.length < 1){
//         //     console.log("Database is empty")
//         //     //First lets format all the game locations
//         //     newgames = await formatLocation(newGames, user.state)
//         //     // console.log(newgames)

//         //     // Then we will check for duplicate arenas 
//         //     let arenas = findUniqueArenas(newGames)
//         //     // console.log(arenas)

//         //     arenas = formatArenas(arenas)
//         //     // console.log(arenas)

//         //     //Then we will do a maps API call from the users address to the arenas on the list
//         //     let mapsData = await callMapsApi(user, arenas)
//         //     // console.log(mapsData)


//         //     //Then we will use that data to assign distance and duration to list of games
//         //     newGames = assignDistanceToGames(mapsData, newGames)
//         //     // console.log(newGames)
//         //     return newGames
//         // }

//         // console.log("Database has games")
//         // //First we need to format the game locations of the new games
//         // newGames = await formatLocation(newGames, user.state)
//         // // console.log("New Games with formatted location: " + newGames)

//         // // Then we will widdle down the new arenas to uniques
//         // let arenas = findUniqueArenas(newGames)
//         // // console.log("Unique arenas: "+ arenas)

//         // // Then we will format the arenas to be objects
//         // arenas = formatArenas(arenas)
//         // // console.log("Current arenas: " + typeof arenas)
//         // // Then we will see if there is another game with the same formatted location
//         // let matchedArenas = checkDbForMatchingLocations(arenas, currentSchedule)
//         // // console.log("Current arenas after checking for match: " + arenas)


//         // //If there isn't any matching in the Database, call the maps api for the new arenas
//         // let newArenas = []
//         // for(let i = 0; i < arenas.length; i++ ) {
//         //     if(arenas[i].distance === 0){
//         //         // console.log(`New arena name: ${arenas[i].name}`)
//         //         newArenas.push(arenas[i])
//         //     }
//         // }

//         // newArenas = await callMapsApi(user, newArenas)
//         // // console.log("New arenas: " + newArenas)
//         // let allArenas = []
//         // matchedArenas.forEach((arena) => {
//         //     allArenas.push(arena)
//         // })
//         // newArenas.forEach((arena) => {
//         //     allArenas.push(arena)
//         // })
//         // // console.log("all arenas: " + allArenas)

//         // newGames = assignDistanceToGames(allArenas, newGames)
//         // return newGames
//     } catch (error) {
//         return {error: "Error in calculate distance: " + error}
//     }
// }


// //first lets format all the arenas, on the game
// //when we do that, we will also get the address data for the arenas
// // which will return the game with the formatted location as well as the arena data
// //then we will see if there are other arenas in the database with the same information
// // if there aren't we will add the arena to an array(to be added to user)
// // then, if it is a new arena, we will calc distance to that arena from the users current address
// // if the distance is over 150 miles, 0 it, and ask the official to set the distance for that rink
// //then we will save the arena data to the user, and return the games with the correct distance





//     // NO ARENAS IN THE DATABASE
//     // For each games distance
//     // If the game doesnt have a distance
//     // It will see if there is another game in the database that does have a distance to The SAME LOCATION
//     // AKA iterate over every game, 
//     // If there is another game with the same arena, and distance is calculated, 
//     // the curr game will adopt the other games distance and duration
//     // Otherwise it will call the Google distance matrix API
//     // And assign the games distance with that
//     // ++ Only calls Maps distance matrix API for each arena (Around $0.15 all time unless official moves)
//     // ++ Database remains as lean as possible, no arenas
//     // ++ Database cost will remain low
//     // -- For each game, there will be more functions called when it is imported, slowing down the already slow process
//     // -- There's more code and more work, possibly creating more bugs