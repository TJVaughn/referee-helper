import React, { Component } from 'react';
import CreateGame from '../modules/CreateGame'
import AllGames from '../modules/AllGames'
import SyncSchedules from '../modules/SyncSchedules'

class Schedule extends Component {
    render(){
    	return(
    		<div>
                <CreateGame />
				<h2>Sync Schedules</h2>
				<SyncSchedules />
    			<h2>Schedule</h2>
                <AllGames />
    		</div>
    	);
    }
}
export default Schedule ;