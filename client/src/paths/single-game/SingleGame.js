import React, { useEffect, useState } from 'react';
import { Link, Redirect } from "react-router-dom";
import getRequest from '../../utils/getRequest'
import { toDateObj } from '../../utils/toDateObj'
import postRequest from '../../utils/postRequest'
import TableHead from './modules/TableHead';
import GameDetails from './modules/GameDetails';

function SingleGame(props){
    
    return (
        <div>
            <div className="Single-game-container">
                <TableHead />
                <GameDetails id={props.id} />
            </div>

        </div>
    )
}
export default SingleGame
