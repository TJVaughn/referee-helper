import React, { Component } from 'react';
import CreateGame from '../modules/CreateGame'
import AllGames from '../modules/AllGames'
import AddASSchedule from '../modules/AddASSchedule'
import AddHWRSchedule from '../modules/AddHWRSchedule'

class Schedule extends Component {
    render(){
    	return(
    		<div>
                <CreateGame />
				<h3>Sync Arbiter Schedule</h3>
				<AddASSchedule />
				<h3>Sync Horizon Schedule</h3>
				<AddHWRSchedule />
    			<h2>Schedule</h2>
                <AllGames />
    		</div>
    	);
    }
}
export default Schedule ;