import React, { Component } from 'react';
import getRequest from '../../../utils/getRequest';
import { toDateObj } from '../../../utils/toDateObj';
import updateGame from '../../../api/game/updateGame';

class GameDetails extends Component {
    constructor(props){
        super(props)
        this.state = {
            date: '',
            time: '',
            location: '',
            fees: '',
            group: '',
            level: '',
            distance: '',
            duration: '',
            status: '',
            platform: '',
            gameCode: '',
            paid: false,
            message: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handlePaid = this.handlePaid.bind(this)
    }

    handlePaid(){
        return this.setState({paid: !this.state.paid})
    }
    async callUpdateGame(){
        const dateTime = `${this.state.date} ${this.state.time}`
        const data = {
            "dateTime": dateTime,
            "location": this.state.location,
            "distance": this.state.distance * 10,
            "duration": this.state.duration,
            "fees": this.state.fees * 100,
            "level": this.state.level,
            "refereeGroup": this.state.group,
            "status": this.state.status,
            "paid": this.state.paid
        }
        let game = await updateGame(this.props.id, { data })
        console.log(game)
        if(game.error){
            return this.setState({message: 'Error in updating game: ' + game.error})
        }
        window.location.reload()
    }
    handleSubmit(evt){
        evt.preventDefault()
        this.callUpdateGame()
    }
    handleChange(evt){
        this.setState({[evt.target.name]: evt.target.value})
    }
    async callGetGame(){
        const res = await getRequest(`game/${this.props.id}`)
        // console.log(res)
        this.setState({
            date: toDateObj(res.dateTime).toDateString(),
            time: toDateObj(res.dateTime).toTimeString(),
            location: res.location,
            distance: res.distance / 10,
            duration: res.duration,
            fees: res.fees / 100,
            group: res.refereeGroup,
            level: res.level,
            milage: res.milage,
            status: res.status,
            platform: res.platform,
            gameCode: res.gameCode,
            paid: res.paid
        })
    }
    componentDidMount(){
        this.callGetGame()
    }
    render(){
        const message = this.state.message
    	return(
    		<div>
    			<form className="Single-game" onSubmit={this.handleSubmit}>
                    <button className="Single-game-update-btn">update</button>
                    <input name="date" placeholder="Date" type="text" onChange={this.handleChange} value={this.state.date} />
                    <input name="time" placeholder="Time" type="text" onChange={this.handleChange} value={this.state.time} />
                    <input name="location" placeholder="Location" type="text" onChange={this.handleChange} value={this.state.location} />
                    <input name="distance" placeholder="distance" type="text" onChange={this.handleChange} value={this.state.distance} />
                    <input name="duration" placeholder="duration" type="text" onChange={this.handleChange} value={this.state.duration} />
                    <input name="fees" placeholder="Fees" type="text" onChange={this.handleChange} value={this.state.fees} />
                    <input name="level" placeholder="Level" type="text" onChange={this.handleChange} value={this.state.level} />
                    <input name="group" placeholder="Ref Group" type="text" onChange={this.handleChange} value={this.state.group} />
                    <input name="status" placeholder="Status" type="text" onChange={this.handleChange} value={this.state.status} />
                    <p>{this.state.gameCode}</p>
                    <p>{this.state.platform}</p>
                    <p id="Single-game-paid-btn" className={this.state.paid ? 'paid' : 'unpaid'} onClick={this.handlePaid}>{this.state.paid ? 'paid' : 'unpaid'}</p>
                </form>
                {message}
    		</div>
    	);
    }
}
export default GameDetails;
//306 LINES!!! CRAZY!!!