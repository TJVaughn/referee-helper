const addArenasFromGames = (games) => {
    let allArenas = []
    for(let i = 0; i < games.length; i ++){
        let arena = `${games[i].formattedLocation}*${games[i].locationAddress}`
        allArenas.push(arena)
    }
    let uniques = [...new Set(allArenas)]

    let uniqueArenas = []
    for(let x = 0; x < uniques.length; x++){
        let val = uniques[x]
        let arena = {
            name: val.split('*').shift(),
            address: val.split('*').pop()
        }
        if(!arena.address){
            arena.address = arena.name
        }
        uniqueArenas.push(arena)
    }
    return uniqueArenas
}

module.exports = addArenasFromGames