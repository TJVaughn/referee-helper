import React, { useState, useEffect} from 'react';
import GamesHeader from './GamesHeader'
import getGames from '../../../../api/game/getGames';
import { Switch, Link } from 'react-router-dom'
import {toDateObj} from '../../../../utils/toDateObj'
import formatNumber from '../../../../utils/formatNumber'
import GroupData from './GroupData'
import { createGroupObject, calculateGroupData } from './groupFunctions'

export default function GamesByMonth(props){
    const [ games, setGames ] = useState([])
    const [ groups, setGroups ] = useState([])

    async function callGetGames(){
        let [resGames, resGroups] = await getGames(props.today.getMonth(), props.today.getFullYear())
        await setGroups(resGroups)
        await setGames(resGames)
        await setGroups(createGroupObject(groups))
        const [total, groupData ] = calculateGroupData(groups, games)
        await setGroups(groupData)
    }
    useEffect(() => {
        callGetGames()
    }, [setGames, setGroups, props])
    
    const gamesMap = games.map(item => 
        <div key={item._id}>
            <Switch />
            <Link to={`/game/${item._id}`}>
                <div className={`All-games-game 
                    ${item.paid ? 'paid': ''} 
                    ${item.status.toLowerCase().includes('canceled') ? 'canceled' : ''}
                    ${item.gameCode === 'Event' ? 'All-games-event': ''}
                `} >
                    <p>
                        {toDateObj(item.dateTime).toDateString()}
                    </p>
                    <p>
                        {toDateObj(item.dateTime).toLocaleTimeString()}
                    </p>
                    <p>
                        {item.location}
                    </p>
                    <p>
                        {formatNumber(item.distance * 10)}
                    </p>
                    <p>
                        {item.duration}
                    </p>
                    <p className="number">
                        ${(Math.round(item.fees) / 100).toFixed(2)}
                    </p>
                    <p>
                        {item.level}
                    </p>
                    <p>
                        {item.paid 
                        ? 'paid'
                        : 'unpaid'}
                    </p>
                    <p>
                        {item.refereeGroup}
                    </p>
                    <p>
                        {item.status}
                    </p>
                    <p>
                        {item.gameCode}
                    </p>
                    <p>
                        {item.platform}
                    </p>
                </div>
            </Link>
        </div>
        )
    return (
        <div className='All-games-container'>
            <div>
                <GroupData groups={groups} />
            </div>
            <GamesHeader />
            {gamesMap}
        </div>
    )
}