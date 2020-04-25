import getRequest from "../../../utils/getRequest"

export default async function getGame(id){
    const game = await getRequest(`game/${id}`)
    console.log(game)
    return game
}