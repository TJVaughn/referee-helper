import React from 'react';
import formatNumber from '../../../../utils/formatNumber';

export default function GroupData(props){
    const groupDataMap = props.groups.map(group => 
        <div key={group.id}>
            <h3>
                {formatNumber(group.name)}
            </h3>
            <p>
                Earned: ${formatNumber(group.earned)}
            </p>
            <p>
                Received: ${formatNumber(group.received)}
            </p>
            <p>
                Owed: ${formatNumber(group.earned - group.received)}
            </p>
            <p>
                Miles Driven: {formatNumber(group.miles * 20)}
            </p>
        </div>
        )

    return (
        <div>
            {groupDataMap}
        </div>
    )
}