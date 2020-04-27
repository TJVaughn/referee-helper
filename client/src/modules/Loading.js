import React from 'react';

export default function Loading(props){
    return (
        <div className="loading-animation">
            <div className="loading-animation-inner">
                <div className="loading-animation-dot"></div>
                <div className="loading-animation-dot-2"></div>
            </div>
            <h2>{props.message}</h2>
        </div>
    )
}