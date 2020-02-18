import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import fetchRequest from '../utils/fetchRequest'
import { toDateObj } from '../utils/toDateObj'

class SingleGame extends Component {
    constructor(props){
        super(props)
        this.state = {
            game: {}
        }
    }
    async callGetGame(){
        const res = await fetchRequest(`game/${this.props.id}`, 'GET')
        console.log(res)
        this.setState({game: res})
    }
    componentDidMount(){
        this.callGetGame()
    }
    render(){
    	return(
    		<div>
                <Link to={'/'}>← Back</Link>
                <div className="All-games-game">
                <p>
                            {toDateObj(this.state.game.dateTime).getMonth()}/{toDateObj(this.state.game.dateTime).getDate()}
                        </p>
                        <p>
                            {toDateObj(this.state.game.dateTime).getHours()}:{toDateObj(this.state.game.dateTime).getMinutes()}
                        </p>
                        <p>
                            {this.state.game.location}
                        </p>
                        <p>
                            {this.state.game.milage}
                        </p>
                        <p className="number">
                            ${this.state.game.fees / 100}
                        </p>
                        <p>
                            {this.state.game.level}
                        </p>
                        <p>
                            {this.state.game.refereeGroup}
                        </p>
                        <p>
                            {this.state.game.status}
                        </p>
                </div>
    		</div>
    	);
    }
}
export default SingleGame ;