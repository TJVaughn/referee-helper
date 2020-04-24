import React from 'react'
import SingleGame from './SingleGame'


export default function SingleGameRouter(props){
    return (
        <div>
            <SingleGame id={props.match.params.id} />
        </div>
    )
}