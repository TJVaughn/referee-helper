import React, { Component } from 'react';
import fetchRequest from '../utils/fetchRequest'
import { toDateObj } from '../utils/toDateObj'

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
            <div className="All-games-map" key={item._id}>
                <p>
                    {toDateObj(item.dateTime).getMonth()}/{toDateObj(item.dateTime).getDate()}
                </p>
                <p>
                    {toDateObj(item.dateTime).getHours()}:{toDateObj(item.dateTime).getMinutes()}
                </p>
                <p>
                    {item.location}
                </p>
                <p className="number">
                    ${item.fees / 100}
                </p>
            </div>
            )
    	return(
    		<div>
    			{allGamesMap}
    		</div>
    	);
    }
}
export default AllGames ;