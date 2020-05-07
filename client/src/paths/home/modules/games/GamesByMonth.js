import React, { useEffect } from 'react';
import GamesHeader from './GamesHeader'
import { Switch, Link } from 'react-router-dom'
import formatNumber from '../../../../utils/formatNumber'
import moment from 'moment'

export default function GamesByMonth(props){
    useEffect(() => {
    }, [props])
    let updatedGamesArr = props.games
    const updateGames = (games) => {
        for(let i = 0; i < games.length; i ++){
            let d = games[i].dateTime
            d = new Date(d).toISOString()
            let h = new Date(d).getUTCHours()
            let m = new Date(d).getUTCMinutes()
            console.log(h)
            let dhm = new Date(new Date(d).getFullYear(), new Date(d).getMonth(), new Date(d).getDate(), h, m)
            games[i].dateTimeTime = moment(dhm).format('h:mm A')
        }
    }
    updateGames(updatedGamesArr)
    const gamesMap = updatedGamesArr.map(item => 
        <div key={item._id}>
            <Switch />
            <Link to={`/game/${item._id}`}>
                <div className={`All-games-game 
                    ${item.paid ? 'paid': ''} 
                    ${item.status.toLowerCase().includes('canceled') ? 'canceled' : ''}
                    ${item.gameCode === 'Event' ? 'All-games-event': ''}
                `} >
                    <p>
                        {new Date(item.dateTime).toDateString()}
                    </p>
                    <p>
                        {item.dateTimeTime}
                        {/* {(moment(new Date(item.dateTime)).toISOString().split('T').pop())} */}
                        {/* {moment(new Date(item.dateTime)).format('h:mm A')} */}
                        {/* {new Date(item.dateTime).toUTCString()} */}
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
            <GamesHeader />
            {gamesMap}
        </div>
    )
}