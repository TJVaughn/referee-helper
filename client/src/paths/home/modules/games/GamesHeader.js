import React, { useState, useEffect} from 'react';

export default function GamesHeader (){
    const [ dataScroll, setDataScroll ] = useState('500')

    useEffect(() => {
        setInterval(() => {
            // console.log(Math.round(window.pageYOffset))
            if (Math.round(window.pageYOffset) > 400) {
                setDataScroll(Math.round(window.pageYOffset).toString())
            } else if(Math.round(window.pageYOffset) < 400){
                setDataScroll('500')
            }
        },  250)
    }, [setDataScroll])
    return (
        <div data-scroll={`${dataScroll}`} className="All-games-game schedule-header">
            <p>Date</p>
            <p>Time</p>
            <p>Location</p>
            <p>Distance</p>
            <p>Drive time</p>
            <p>Fee</p>
            <p>Level</p>
            <p>Paid</p>
            <p>Group</p>
            <p>Status</p>
            <p>Game ID</p>
            <p>Platform</p>
        </div>
    )
}