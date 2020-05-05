import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import MonthYear from './games/MonthYear'
import GamesByMonth from './games/GamesByMonth'
import GroupData from './games/GroupData'
import { calculateGroupData } from './games/groupFunctions'
import Totals from './games/Totals';

let now = new Date()
let today = new Date(now.getFullYear(), now.getMonth(), 1, 12, 0)

function AllGames(props){
    const [ params, setParams ] = useState(<Redirect to={`/`} />)
    const [ moGames, setMoGames ] = useState([])
    const [ totalsData, setTotalsData ] = useState({groupData: []})
    

    const handleMonth = (num) => {
        if(num === 0){
            today = today.setMonth(today.getMonth() - 1)
        } else {
            today = today.setMonth(today.getMonth() + 1)
        }
        today = new Date(today)
        setParams(<Redirect to={`/`} />)
    }

    
    useEffect(() => {
        function callGetGames(){
            let gamesByMonth = []
            let games = props.games

            for(let x = 0; x < games.length; x ++){
                if(new Date(games[x].dateTime).getMonth() === today.getMonth() && today.getFullYear() === new Date(games[x].dateTime).getFullYear()) {
                    gamesByMonth.push(games[x])
                }   
            }
            setMoGames(gamesByMonth)
            const [earnedData, groupData, totalDistance, totalDuration ] = calculateGroupData(props.groups, gamesByMonth)
            setTotalsData({earned: 0, distance: 0, duration: 0})
            setTotalsData({earned: earnedData, distance: totalDistance, duration: totalDuration, groupData: groupData})
            // console.log(totalsData)
        }
        callGetGames()
    }, [props, setMoGames, setTotalsData, setParams, params])
    return (
        <div>
            {/* {params} */}
            <MonthYear today={today} />
            <button onClick={() => {handleMonth(0)}}>←</button>
            <button onClick={() => {handleMonth(1)}}>→</button>
            <GroupData groups={totalsData.groupData} />
            <Totals totals={totalsData} />
            <GamesByMonth games={moGames} />
        </div>
    )
}
export default AllGames;
//343 LINES!!!
// 65% Rewrite!!!
// OLD AllGames:                             11, 722 bytes
// NEW AllGames plus referenced componenents: 6, 199 bytes!!!
// 47.1% DECREASE!!!
// ?month=${today.getMonth()}&year=${today.getFullYear()}