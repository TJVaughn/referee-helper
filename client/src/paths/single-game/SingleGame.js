import React from 'react';
import TableHead from './modules/TableHead';
import GameDetails from './modules/GameDetails';

function SingleGame(props){
    return (
        <div>
            <div className="Single-game-container">
                <TableHead id={props.id} />
                <GameDetails id={props.id} />
            </div>
        </div>
    )
}
export default SingleGame
