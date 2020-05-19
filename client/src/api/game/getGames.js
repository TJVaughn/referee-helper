// let offset = (new Date().getUTCHours()) - (new Date().getHours())
// console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
// offset = new Date().getTimezoneOffset() / 60
// console.log(new Date().toTimeString())
const getGames = async () => {
    // let res = await fetch(`/api/all-games?month=${month}&year=${year}`)
    let res = await fetch('/api/all-games')
    res = await res.json()
    if(res.error){
        return {error: res.error}
    }
    let [games, groups] = res
    // console.log(offset)
    // for(let i = 0; i < games.length; i++){
    //     games[i].dateTime = new Date(games[i].dateTime).setHours((new Date(games[i].dateTime).getHours()) + offset)
    // }
    return [games, groups]
}
export default getGames;