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

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
let monthNum = 0
let today = new Date()

class AllGames extends Component {
    constructor(props){
        super(props);
        this.state = {
            schedule: [],
            earned: 0,
            received: 0,
            miles: 0,
            cancelled: '',
            error: '',
            remaining: 0
        }
        this.handleNextMonth = this.handleNextMonth.bind(this)
        this.handlePrevMonth = this.handlePrevMonth.bind(this)
    }
    handleNextMonth(){
        if(monthNum > 0){
            monthNum -= 1
            today = today.setMonth(today.getMonth() + 1)
            today = new Date(today)
            // console.log(today)
            this.callGetAllGames()
        }
        
    }
    handlePrevMonth(){
        monthNum += 1
        today = today.setMonth(today.getMonth() - 1)
        today = new Date(today)
        // console.log(today)
        this.callGetAllGames()
    }

    async callGetAllGames(){
        let res = await fetchRequest(`all-games?month=prev-${monthNum}`, 'GET')
        if(res.error){
            return this.setState({ error: res.error, schedule: []})
        }
        // console.log(res)

        if(!res){
            res = [{}]
        }
        this.setState({schedule: res})
        this.sumEarned()
        this.sumReceived()
        this.sumMiles()
        this.sumRemaining()
    }
    componentDidMount(){
        this.callGetAllGames()
    }
    sumEarned(){
        let sum = 0
        for(let i = 0; i < this.state.schedule.length; i++){
            sum += this.state.schedule[i].fees
        }
        //NUMBER Is anywhere from $100.00 to $999.99
        if (sum > 9999 && sum < 99999){
            sum = sum.toString().split('').reverse()
            sum.splice(2, 0, '.').join('')
            sum = sum.toString().split(',').reverse().join('')
        } else if (sum > 99999){
            sum = sum.toString().split('').reverse()
            sum.splice(2, 0, '.')
            sum.splice(6, 0, ',')
            sum = sum.join('').split('').reverse().join('')
        }

        this.setState({earned: sum})
    }

    sumReceived(){
        let sum = 0
        for(let i = 0; i < this.state.schedule.length; i++){
            if(this.state.schedule[i].paid){
                sum += this.state.schedule[i].fees
            }
        }
        if (sum > 9999 && sum < 99999){
            sum = sum.toString().split('').reverse()
            sum.splice(2, 0, '.').join('')
            sum = sum.toString().split(',').reverse().join('')
        } else if (sum > 99999){
            sum = sum.toString().split('').reverse()
            sum.splice(2, 0, '.')
            sum.splice(6, 0, ',')
            sum = sum.join('').split('').reverse().join('')
        }
        this.setState({received: sum})

    }

    sumMiles(){
        let sum = 0
        for(let i = 0; i < this.state.schedule.length; i++){
            sum += this.state.schedule[i].fees
        }
    }
    sumRemaining(){
        let paid = 0
        let earned = 0
        for(let i = 0; i < this.state.schedule.length; i++){
            earned += this.state.schedule[i].fees
        }
        for(let i = 0; i < this.state.schedule.length; i++){
            if(this.state.schedule[i].paid){
                paid += this.state.schedule[i].fees
            }
        }
        let sum = earned - paid
        if (sum > 9999 && sum < 99999){
            sum = sum.toString().split('').reverse()
            sum.splice(2, 0, '.').join('')
            sum = sum.toString().split(',').reverse().join('')
        } else if (sum > 99999){
            sum = sum.toString().split('').reverse()
            sum.splice(2, 0, '.')
            sum.splice(6, 0, ',')
            sum = sum.join('').split('').reverse().join('')
        }
        this.setState({remaining: sum})
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
                <h2>{months[(today.getMonth())]}, {today.getFullYear()}</h2>
                <div className="All-games-stats">
                    <h4>Earned: 
                        <span className="number">
                            {` $${this.state.earned}`}
                        </span>
                    </h4>
                    <h4> Received: 
                        <span className="number">
                            {` $${this.state.received}`}
                        </span>
                    </h4>
                    <h4> Remaining: 
                        <span className="number">
                            {` $${this.state.remaining}`}
                        </span>
                    </h4>
                </div>
                
                <button 
                    onClick={this.handlePrevMonth}>
                    ←
                </button>
                
                <button 
                    // disabled={monthNum === 0 ? 'true': 'false'} 
                    onClick={this.handleNextMonth}>
                    →
                </button>

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