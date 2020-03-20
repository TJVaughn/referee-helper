import React, { Component } from 'react';
import fetchRequest from '../utils/fetchRequest'
import { toDateObj } from '../utils/toDateObj'
import { BrowserRouter as Switch, Link} from "react-router-dom";

const gamesHeader = <div className="All-games-game schedule-header">
    <p>Date</p>
    <p>Time</p>
    <p>Location</p>
    <p>Distance</p>
    <p>Drive time</p>
    <p>Fee</p>
    <p>Level</p>
    <p>Group</p>
    <p>Status</p>
    <p>Game ID</p>
    <p>Platform</p>
    <p>Paid</p>

</div>

class AllGames extends Component {
    constructor(props){
        super(props);
        this.state = {
            schedule: [],
            earned: 0.00,
            cancelled: '',
            error: ''
        }
    }

    async callGetAllGames(){
        const res = await fetchRequest('all-games', 'GET')
        if(res.error){
            return this.setState({ error: res.error, schedule: []})
        }
        this.setState({schedule: res})
        this.sumEarned()
    }
    componentDidMount(){
        this.callGetAllGames()
    }
    sumEarned(){
        let sum = 0.00
        for(let i = 0; i < this.state.schedule.length; i++){
            sum += this.state.schedule[i].fees
        }
        sum = sum / 100
        if(sum > 999){
            sum = sum.toString().split('').reverse()
            sum.splice(6, 0, ',')
            sum = sum.reverse().join('')
        }
        if(sum > 999999){

        }
        this.setState({earned: sum})
    }
    render(){
        const allGamesMap = this.state.schedule.map(item =>
            <div key={item._id}>
                <Switch />
                <Link to={`/game/${item._id}`}>
                    <div className={`All-games-game 
                    ${item.paid ? 'paid': ''} 
                    ${item.status.toLowerCase().includes('canceled') ? 'canceled' : ''}
                    ${item.gameCode === 'Event' ? 'All-games-event': ''}
                    `} >
                        <p>
                            {toDateObj(item.dateTime).toDateString()}
                        </p>
                        <p>
                            {toDateObj(item.dateTime).toLocaleTimeString()}
                        </p>
                        <p>
                            {item.location}
                        </p>
                        <p>
                            {item.distance}
                        </p>
                        <p>
                            {item.duration}
                        </p>
                        <p className="number">
                            ${(Math.round(item.fees) / 100).toFixed(2)}
                        </p>
                        <p>
                            {item.level}
                        </p>
                        <p>
                            {item.refereeGroup}
                        </p>
                        <p>
                            {item.status}
                        </p>
                        <p>
                            {item.gameCode}
                        </p>
                        <p>
                            {item.platform}
                        </p>
                        <p>
                            {item.paid 
                            ? 'paid'
                            : 'unpaid'}
                        </p>
                        {/* <p>
                            <input value={this.state.paid} type="checkbox" />
                        </p> */}
                    </div>
                </Link>
            </div>
            )
    	return(
    		<div className="All-games-container">
                <h4>Total Earned: 
                    <span className="number">
                        {` $${this.state.earned}`}
                        {/* ${`${Math.floor(this.state.earned / 100000)},${((this.state.earned - (Math.floor(this.state.earned / 100000) * 100000)) / 100).toFixed(2)}`} */}
                    </span></h4>
                {gamesHeader}
    			{allGamesMap}
                <h1>
                    {this.state.error}
                </h1>
    		</div>
    	);
    }
}
export default AllGames ;