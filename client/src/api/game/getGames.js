const getGames = async () => {
    // let res = await fetch(`/api/all-games?month=${month}&year=${year}`)
    let res = await fetch('/api/all-games')
    let [games, groups] = await res.json()
    return [games, groups]
}
export default getGames;