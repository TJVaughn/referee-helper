import React, { useEffect, useState } from 'react'
import getRequest from '../../../utils/getRequest'
import useInput from '../../../hooks/useInput'
import useToggle from '../../../hooks/useToggle'
import formatNumber from '../../../utils/formatNumber'

function GameDetails(props){
    const [ gameState, setGameState ] = useState({})
    const [ loading, setLoading ] = useToggle(true)
    const [ paid, setPaid ] = useToggle(false)
    async function getGame(){
        const game = await getRequest(`game/${props.id}`)
        console.log(game)
        setLoading(false)
        setGameState(game)
        setPaid(game.paid)
    }
    
    useEffect(() => {
        getGame()
    }, [])

    
    const updateGame = async () => {
        console.log({...formInput})
    }
    let { formInput, handleInputChange, handleSubmit } = useInput(updateGame) 

    
    function Form(){
        return (
            <form onSubmit={handleSubmit}>
                <input name="date" type="text" value={formInput.date} onChange={handleInputChange} />
                <input name="time" type="text" value={formInput.time} onChange={handleInputChange} defaultValue={new Date(gameState.dateTime).toLocaleTimeString()} />
                <input name="location" type="text" value={formInput.location} onChange={handleInputChange} defaultValue={gameState.location} />
                <input name="distance" type="text" value={formInput.distance} onChange={handleInputChange} defaultValue={`${formatNumber(gameState.distance * 10)}`} />
                <input name="duration" type="text" value={formInput.duration} onChange={handleInputChange} defaultValue={gameState.duration} />
                <input name="fees" type="text" value={formInput.fees} onChange={handleInputChange} defaultValue={gameState.fees} />
                <input name="level" type="text" value={formInput.level} onChange={handleInputChange} defaultValue={gameState.level} />
                <input name="group" type="text" value={formInput.group} onChange={handleInputChange} defaultValue={gameState.refereeGroup} />
                <input name="status" type="text" value={formInput.status} onChange={handleInputChange} defaultValue={gameState.status} />
                <p>{gameState.gameCode}</p>
                <p>{gameState.platform}</p>
                <p className={paid ? 'paid' : 'unpaid'} id="Single-game-paid-btn" onClick={() => {setPaid(!paid)}}>{paid ? 'paid' : 'unpaid'}</p>
                <button>update</button>
            </form>
        )
    }

    return (
        <div>
            {loading
            ? 'loading game data'
            :<Form />}
            
        </div>
    )
}

export default GameDetails