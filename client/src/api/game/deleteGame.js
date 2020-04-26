const deleteGame = async (id) => {
    const req = await fetch(`/api/game/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const game = await req.json()
    if(game.error){
        return {error: 'Error in deleting game, server error'}
    }
    return game
}
export default deleteGame