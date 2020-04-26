import React, { Component } from 'react';
import CreateGame from './modules/CreateGame'
import AllGames from './modules/AllGames'
import SyncSchedules from './modules/SyncSchedules'
import AddArena from './modules/AddArena'
import CreateBlocks from './modules/CreateBlocks';
import { getCookie } from '../../utils/cookies'

class Schedule extends Component {
	constructor(props){
		super(props);
		this.state = {
			gameToggle: false,
			arenaToggle: false,
			syncToggle: false,
			blocksToggle: false
		}
		this.handleGameToggle = this.handleGameToggle.bind(this)
		this.handleArenaToggle = this.handleArenaToggle.bind(this)
		this.handleSyncToggle = this.handleSyncToggle.bind(this)
		this.handleBlocksToggle = this.handleBlocksToggle.bind(this)
	}

	componentDidMount(){
		console.log(this.props)
		if(getCookie('InitialLoginFlow') === 'true'){
			return this.setState({syncToggle: true})
		}
	}
	handleGameToggle(){
		if(this.state.gameToggle){
			return this.setState({gameToggle: false})
		}
		this.setState({gameToggle: true})
	}

	handleArenaToggle(){
		if(this.state.arenaToggle){
			return this.setState({arenaToggle: false})
		}
		this.setState({arenaToggle: true})
	}

	handleSyncToggle(){
		if(this.state.syncToggle){
			return this.setState({syncToggle: false})
		}
		this.setState({syncToggle: true})
	}

	handleBlocksToggle(){
		if(this.state.blocksToggle){
			return this.setState({blocksToggle: false})
		}
		this.setState({blocksToggle: true})
	}

    render(){
    	return(
    		<div>
				<div className="Schedule-schedule-header">
					<p onClick={this.handleGameToggle} className="pointer">
						Create New Game
					</p>
					<p onClick={this.handleArenaToggle} className="pointer">
						Arena
					</p>
					<p onClick={this.handleSyncToggle} className="pointer">
						Sync your schedule
					</p>
					<p onClick={this.handleBlocksToggle} className="pointer">
						Create Blocks
					</p>
				</div>
					{this.state.gameToggle
					?<CreateGame />
					:''}
                	{this.state.arenaToggle
					?<AddArena />
					:''}
					{this.state.syncToggle
					?<SyncSchedules />
					:''}
					{this.state.blocksToggle
					?<CreateBlocks />
					:''}
                <AllGames />
    		</div>
    	);
    }
}
export default Schedule ;