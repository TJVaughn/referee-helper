import React, { Component } from 'react';
import getRequest from '../utils/getRequest'
import { toDateObj } from '../utils/toDateObj'
import { BrowserRouter as Switch, Link} from "react-router-dom";
import { setCookie } from '../utils/cookies';

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
let today = new Date()
today = new Date(today.getFullYear(), today.getMonth(), 1, 12, 0, 0)
// console.log(today)
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
            remaining: 0,
            groupData: []
        }
        this.handleNextMonth = this.handleNextMonth.bind(this)
        this.handlePrevMonth = this.handlePrevMonth.bind(this)
    }
    handleNextMonth(){
        today = today.setMonth(today.getMonth() + 1)
        today = new Date(today)
        // console.log(today)
        this.callGetAllGames()
    }
    handlePrevMonth(){
        today = today.setMonth(today.getMonth() - 1)
        today = new Date(today)
        // console.log(today)
        this.callGetAllGames()
    }

    async callGetAllGames(){
        // console.log(`month=${today.getMonth()}&year=${today.getFullYear()}`)
        let res = await getRequest(`all-games?month=${today.getMonth()}&year=${today.getFullYear()}`)
        if(res.error){
            setCookie("loggedIn", "false")
            return this.setState({ error: res.error, schedule: []})
        }
        // console.log(res)

        if(!res){
            res = [{}]
        }
        this.setState({schedule: res[0]})
        let groups = res[1]

        let groupObj = []
        for(let g = 0; g < groups.length; g++) {
            let group = {
                id: groups[g]._id,
                name: groups[g].group.name,
                number: groups[g].group.number,
                earned: 0,
                received: 0,
                remaining: 0,
                miles: 0
            }
            groupObj.push(group)
        }
        this.sumEarned(groupObj)
        this.sumReceived(groupObj)
        this.sumMiles(groupObj)
        this.sumRemaining(groupObj)
    }
    componentDidMount(){
        this.callGetAllGames()
    }
    formatNumber(number){
        if (number > 99 && number < 10000){
            number = number.toString().split('').reverse()
            number.splice(2, 0, '.').join('')
            number = number.toString().split(',').reverse().join('')
        } else if (number > 9999 && number < 100000){
            number = number.toString().split('').reverse()
            number.splice(2, 0, '.').join('')
            number = number.toString().split(',').reverse().join('')
        } else if (number > 99999){
            number = number.toString().split('').reverse()
            number.splice(2, 0, '.')
            number.splice(6, 0, ',')
            number = number.join('').split('').reverse().join('')
        }

        return number
    }
    sumEarned(groupObj){
        let total = 0
        
        //How many groups are there? Get groups from USER
        for(let i = 0; i < this.state.schedule.length; i++){
            for(let x = 0; x < groupObj.length; x ++){
                if(this.state.schedule[i].refereeGroup === groupObj[x].name){
                    groupObj[x].earned += this.state.schedule[i].fees
                    groupObj[x].miles += this.state.schedule[i].distance
                    if(this.state.schedule[i].paid){
                        groupObj[x].received += this.state.schedule[i].fees
                    }
                }
            }
            total += this.state.schedule[i].fees
        }
        groupObj = groupObj.filter((group) => {
            if(group.earned === 0 && group.miles === 0){
                return false
            }
            return true
        })
        // console.log(groupObj)
    

        total = this.formatNumber(total)
        this.setState({earned: total, groupData: groupObj})
    }

    sumReceived(groups){
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

    sumMiles(groups){
        let sum = 0
        for(let i = 0; i < this.state.schedule.length; i++){
            sum += parseInt(this.state.schedule[i].distance)
        }
        this.setState({miles: sum})
    }
    sumRemaining(groups){
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
        const groupDataMap = this.state.groupData.map(group => 
            <div key={group.id}>
                <h3>
                    {this.formatNumber(group.name)}
                </h3>
                <p>
                    Earned: ${this.formatNumber(group.earned)}
                </p>
                <p>
                    Received: ${this.formatNumber(group.received)}
                </p>
                <p>
                    Owed: ${this.formatNumber(group.earned - group.received)}
                </p>
                <p>
                    Miles Driven: {group.miles * 2}
                </p>
            </div>
            )
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
                    {groupDataMap}
                    {/* <h4>Earned: 
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
                    <h4> Miles: 
                        <span className="number">
                            {` ${this.state.miles}`}
                        </span>
                    </h4> */}
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