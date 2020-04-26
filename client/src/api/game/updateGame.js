const updateGame = async (id, {data}) => {
    const req = await fetch(`/api/game/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const game = await req.json()
    if(game.error){
        return {error: 'Error in updating game, server error: ' + game.error}
    }
    return game
}
export default updateGame