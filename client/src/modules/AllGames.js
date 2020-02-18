import React, { Component } from 'react';
import fetchRequest from '../utils/fetchRequest'
import { toDateObj } from '../utils/toDateObj'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

class AllGames extends Component {
    constructor(props){
        super(props);
        this.state = {
            schedule: []
        }
    }

    async callGetAllGames(){
        const res = await fetchRequest('all-games', 'GET')
        this.setState({schedule: res})
    }
    componentDidMount(){
        this.callGetAllGames()
    }
    componentDidUpdate(){
        this.callGetAllGames()
    }

    render(){
        const allGamesMap = this.state.schedule.map(item =>
            <div key={item._id}>
                <Switch />
                <Link to={`/game/${item._id}`}>
                    <div className="All-games-game" >
                        <p>
                            {toDateObj(item.dateTime).getMonth() + 1}/{toDateObj(item.dateTime).getDate()}
                        </p>
                        <p>
                            {toDateObj(item.dateTime).getHours()}:{toDateObj(item.dateTime).getMinutes()}
                        </p>
                        <p>
                            {item.location}
                        </p>
                        <p>
                            {item.milage}
                        </p>
                        <p className="number">
                            ${item.fees / 100}
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
    			{allGamesMap}
    		</div>
    	);
    }
}
export default AllGames ;