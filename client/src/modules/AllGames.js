import React, { Component } from 'react';
import fetchRequest from '../utils/fetchRequest'
import { toDateObj } from '../utils/toDateObj'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

class AllGames extends Component {
    constructor(props){
        super(props);
        this.state = {
            schedule: [],
            earned: 0.00
        }
    }

    async callGetAllGames(){
        const res = await fetchRequest('all-games', 'GET')
        this.setState({schedule: res})
        console.log(res)
        this.sumEarned()
    }
    componentDidMount(){
        this.callGetAllGames()
    }
    // componentDidUpdate(){
    //     this.callGetAllGames()
    // }
    sumEarned(){
        this.state.schedule.forEach(item => {
            this.setState({earned: this.state.earned + item.fees})
        })
        // for(let i = 0; i < this.state.schedule.length; i++){
        //     this.setState({earned: this.state.earned + (this.state.schedule[i].fees / 100)})
        // }
        
    }
    render(){
        const allGamesMap = this.state.schedule.map(item =>
            <div key={item._id}>
                <Switch />
                <Link to={`/game/${item._id}`}>
                    <div className="All-games-game" >
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
                        {/* <p>
                            <input value={this.state.paid} type="checkbox" />
                        </p> */}
                    </div>
                </Link>
            </div>
            )
    	return(
    		<div className="All-games-container">
                {console.log(this.state.earned)}
                <h4>Total Earned: <span className="number">${(Math.round(this.state.earned) / 100).toFixed(2)}</span></h4>
                
    			{allGamesMap}
    		</div>
    	);
    }
}
export default AllGames ;