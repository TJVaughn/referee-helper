import React, { Component } from 'react';
import fetchRequest from '../utils/fetchRequest'
import { toDateObj } from '../utils/toDateObj'
import { BrowserRouter as Switch, Link} from "react-router-dom";

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
        let sum = 0
        for(let i = 0; i < this.state.schedule.length; i++){
            sum += this.state.schedule[i].fees
        }
        sum = Math.round(sum)
        if(sum > 999){
            sum = Math.round(sum)
        }
        this.setState({earned: sum})
    }
    render(){
        const allGamesMap = this.state.schedule.map(item =>
            <div key={item._id}>
                <Switch />
                <Link to={`/game/${item._id}`}>
                    <div className={`All-games-game ${item.status.toLowerCase().includes('canceled') ? 'canceled' : ''}`} >
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
                            {item.milage}
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
                        ${`${Math.floor(this.state.earned / 100000)},${((this.state.earned - (Math.floor(this.state.earned / 100000) * 100000)) / 100).toFixed(2)}`}
                    </span></h4>
                
    			{allGamesMap}
                <h1>
                    {this.state.error}
                </h1>
    		</div>
    	);
    }
}
export default AllGames ;