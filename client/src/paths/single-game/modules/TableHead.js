import React, { useState } from 'react';
import useToggle from '../../../hooks/useToggle'
import { Redirect, Link } from 'react-router-dom';
import deleteGame from '../../../api/game/deleteGame'

export default function TableHead(props){
    const [ toggle, setToggle ] = useToggle(false)
    const [ message, setMessage ] = useState('')
    async function handleDelete(){
        let game = await deleteGame(props.id)
        if(game.error){
           return setMessage(game.error)
        }
        setMessage(<Redirect to={'/'} />)
    }
    return (
        <div className="Single-game Single-game-header">
            <p><strong><Link to={'/'}>←back←</Link></strong></p>
            <p>Date: </p>
            <p>Time: </p>
            <p>Location: </p>
            <p>Distance: </p>
            <p>Drive Time: </p>
            <p>Fees:</p>
            <p>Level: </p>
            <p>Group:</p>
            <p>Status:</p>
            <p>Game ID:</p>
            <p>Platform: </p>
            <p>Paid: </p>
            {!toggle 
            ?<p>
                <button onClick={() => {setToggle(!toggle)}} className="Table-head-delete-game-btn">delete game</button>
            </p>
            :<p><strong>Are you sure?</strong></p>}
            {!toggle ? '' : <div><button onClick={handleDelete} className="Table-head-delete-game-btn">yes! delete</button></div>}
            <p>{message}</p>
        </div>
    )
}