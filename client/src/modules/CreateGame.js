import React, { Component } from 'react';
import postRequest from '../utils/postRequest'
import { toDateObj } from '../utils/toDateObj'

class CreateGame extends Component {
    constructor(props){
        super(props)
        this.state = {
            date: '',
            time: '',
            location: '',
            fees: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleDate = this.handleDate.bind(this)
        this.handleTime = this.handleTime.bind(this)
        this.handleLocation = this.handleLocation.bind(this)
        this.handleFees = this.handleFees.bind(this)
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
    async callCreateGame () {
        if(!this.state.date || !this.state.time || !this.state.location){
            return this.setState({error: "Date, time and location are required"})
        }
        const dateTime = `${this.state.date} ${this.state.time}`
        const data = {
            "dateTime": dateTime,
            "location": this.state.location,
            "fees": this.state.fees * 100
        }
        const res = await postRequest('game', 'POST', { data })
        console.log(res)
        if(res._message){
            return this.setState({error: res._message})
        }
        //On Failure
        
    }
    handleSubmit (evt) {
        evt.preventDefault()
        this.callCreateGame()
    }
    render(){
    	return(
    		<div>
    			<form onSubmit={this.handleSubmit}>
                    <input placeholder="Date" type="text" onChange={this.handleDate} value={this.state.date} />
                    <input placeholder="Time" type="text" onChange={this.handleTime} value={this.state.time} />
                    <input placeholder="Location" type="text" onChange={this.handleLocation} value={this.state.location} />
                    <input placeholder="Fees" type="text" onChange={this.handleFees} value={this.state.fees} />
                    <button>Add Game: </button>
                </form>
                {this.state.error}
    		</div>
    	);
    }
}
export default CreateGame ;