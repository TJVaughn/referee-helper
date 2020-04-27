import React from 'react'
import formatNumber from '../../../../utils/formatNumber'
export default function Totals(props){
    return (
        <div className='All-games-stats'>
            <div className="strong">
                <p className="number">Total Earned: ${formatNumber(props.totals.earned)}</p>
            </div>
            <div className="strong">
                <p className="number">Total Miles: {formatNumber(props.totals.distance * 2)} <br /> * $0.575 <br /> = ${formatNumber(Math.round(((props.totals.distance * 2) * 0.575)))}</p>
            </div>
            <div className="strong">
                <p className="number">Time Driven(hours): {(props.totals.duration * 2 / 60).toFixed(2)}</p>
            </div>
        </div>
    )
}