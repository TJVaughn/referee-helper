import React from 'react'

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export default function MonthYear(props){
    return (
        <div>
            <h2>{months[(props.today.getMonth())]}, {props.today.getFullYear()}</h2>
        </div>
    )
}