import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import MonthYear from './games/MonthYear'
import GamesByMonth from './games/GamesByMonth'
import GroupData from './games/GroupData'
import getGames from '../../../api/game/getGames'
import { createGroupObject, calculateGroupData } from './games/groupFunctions'
import Totals from './games/Totals';

let now = new Date()
let today = new Date(now.getFullYear(), now.getMonth(), 1, 12, 0)

function AllGames(props){
    const [ params, setParams ] = useState(<Redirect to={`/`} />)
    const [ games, setGames ] = useState([])
    const [ groups, setGroups ] = useState([])
    const [ totalsData, setTotalsData ] = useState({})

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
        async function callGetGames(){
            let [resGames, resGroups] = await getGames(today.getMonth(), today.getFullYear())
            setGames(resGames)
            resGroups = createGroupObject(resGroups)
            const [earnedData, groupData, totalDistance, totalDuration ] = calculateGroupData(resGroups, resGames)
            setTotalsData({earned: earnedData, distance: totalDistance, duration: totalDuration})
            setGroups(groupData)
        }
        callGetGames()
    }, [props, setParams, setGames, setGroups, params, setTotalsData])
    return (
        <div>
            {params}
            <MonthYear today={today} />
            <button onClick={() => {handleMonth(0)}}>←</button>
            <button onClick={() => {handleMonth(1)}}>→</button>
            <GroupData groups={groups} />
            <Totals totals={totalsData} />
            <GamesByMonth games={games} />
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