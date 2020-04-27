import React, { useState, useEffect } from 'react';
import MonthYear from './games/MonthYear'
import GroupData from './games/GroupData'
import GamesByMonth from './games/GamesByMonth'
import { Redirect } from 'react-router-dom';

let now = new Date()
let formattedMonthYear = new Date(now.getFullYear(), now.getMonth(), 1, 12, 0)

function AllGames(){
    const [params, setParams] = useState(<Redirect to={`/`} />)
    // const [ monthChange, setMonthChange] = useState(false) 
    // ?month=${formattedMonthYear.getMonth()}&year=${formattedMonthYear.getFullYear()}
    const handleMonth = (num) => {
        // setMonthChange(true)
        if(num === 0){
            formattedMonthYear = formattedMonthYear.setMonth(formattedMonthYear.getMonth() - 1)
        } else {
            formattedMonthYear = formattedMonthYear.setMonth(formattedMonthYear.getMonth() + 1)
        }
        // console.log(formattedMonthYear)
        formattedMonthYear = new Date(formattedMonthYear)
        // console.log(formattedMonthYear)
        return setParams(<Redirect to={`/`} />)
        // ?month=${formattedMonthYear.getMonth()}&year=${formattedMonthYear.getFullYear()}
    }
    useEffect(() => {
        // return setParams
    }, [setParams])
    return (
        <div>
            {params}
            {/* <Redirect to={`/month=${month}&year=${year}`} /> */}
            <MonthYear today={formattedMonthYear} />
            <button onClick={() => {handleMonth(0)}}>←</button>
            <button onClick={() => {handleMonth(1)}}>→</button>
            <GamesByMonth today={formattedMonthYear} />
        </div>
    )
}
export default AllGames;