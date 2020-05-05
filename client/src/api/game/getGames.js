let offset = (new Date().getUTCHours()) - (new Date().getHours())

const getGames = async () => {
    // let res = await fetch(`/api/all-games?month=${month}&year=${year}`)
    let res = await fetch('/api/all-games')
    let [games, groups] = await res.json()
    console.log(offset)
    for(let i = 0; i < games.length; i++){
        games[i].dateTime = new Date(games[i].dateTime).setHours((new Date(games[i].dateTime).getHours()) + offset)
    }
    return [games, groups]
}
export default getGames;