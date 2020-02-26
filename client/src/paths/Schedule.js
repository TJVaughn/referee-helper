import React, { Component } from 'react';
import CreateGame from '../modules/CreateGame'
import AllGames from '../modules/AllGames'
import AddASSchedule from '../modules/AddASSchedule'

class Schedule extends Component {
    render(){
    	return(
    		<div>
                <CreateGame />
				<h3>Import Arbiter Schedule</h3>
				<AddASSchedule />
    			<h2>Schedule</h2>
                <AllGames />
    		</div>
    	);
    }
}
export default Schedule ;