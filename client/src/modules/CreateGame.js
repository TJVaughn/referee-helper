import React, { Component } from 'react';
import postRequest from '../utils/postRequest'

class CreateGame extends Component {
    constructor(props){
        super(props)
        this.state = {
            date: '',
            time: '',
            location: '',
            fees: '',
            group: '',
            level: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleDate = this.handleDate.bind(this)
        this.handleTime = this.handleTime.bind(this)
        this.handleLocation = this.handleLocation.bind(this)
        this.handleFees = this.handleFees.bind(this)
        this.handleLevel = this.handleLevel.bind(this)
        this.handleGroup = this.handleGroup.bind(this)
    }
    handleDate (evt) {
        this.setState({date: evt.target.value})
    }
    handleTime (evt) {
        this.setState({time: evt.target.value})
    }
    handleLocation (evt) {
        this.setState({location: evt.target.value})
    }
    handleFees (evt) {
        this.setState({fees: evt.target.value})
    }
    handleLevel (evt) {
        this.setState({level: evt.target.value})
    }
    handleGroup (evt) {
        this.setState({group: evt.target.value})
    }

    async callCreateGame () {
        if(!this.state.date || !this.state.time || !this.state.location){
            return this.setState({error: "Date, time and location are required"})
        }
        const dateTime = `${this.state.date} ${this.state.time}`
        const data = {
            "dateTime": dateTime,
            "location": this.state.location,
            "fees": this.state.fees * 100,
            "level": this.state.level,
            "refereeGroup": this.state.group,
            "platform": "Manually Added"
        }
        let res = await postRequest('game', 'POST', { data })
        // res = res.json()
        console.log("Response from creategame: ", res)
        if(res._message){
            return this.setState({error: res._message})
        }
        window.location.reload()
        
    }
    handleSubmit (evt) {
        evt.preventDefault()
        this.callCreateGame()
    }
    render(){
    	return(
    		<div>
                <h2>Add new game: </h2>
    			<form className="Create-game-form" onSubmit={this.handleSubmit}>
                    <input placeholder="Date" type="date" onChange={this.handleDate} value={this.state.date} />
                    <input placeholder="Time" type="time" onChange={this.handleTime} value={this.state.time} />
                    <input placeholder="Location" type="text" onChange={this.handleLocation} value={this.state.location} />
                    <input placeholder="Fees" type="text" onChange={this.handleFees} value={this.state.fees} />
                    <input placeholder="Level" type="text" onChange={this.handleLevel} value={this.state.level} />
                    <input placeholder="Ref Group" type="text" onChange={this.handleGroup} value={this.state.group} />
                    <button>Add Game</button>
                </form>
                {this.state.error}
    		</div>
    	);
    }
}
export default CreateGame ;