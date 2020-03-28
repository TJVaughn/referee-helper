import React, { Component } from 'react';
import getRequest from '../utils/getRequest'

class AddASSchedule extends Component {
    constructor(props){
        super(props);
        this.state = {
            message: '',
            inProcess: false
        }
        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handlePassChange = this.handlePassChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    async callGetASSchedule(){
        this.setState({message: "Fetching schedule, this may take up to 30 seconds...", inProcess: true})
        //FIX THiS
        const response = await getRequest('arbiter/schedule')
        if(response.error){
            return this.setState({message: "Invalid Login"})
        }
        this.setState({message: "Schedule fetched, now checking for payments received..."})
        const payments = await getRequest("arbiter/payments")
        if(payments.error){
            return this.setState({message: "Error fetching payments"})
        }
        window.location.reload()
    }

    handlePassChange(evt){
        this.setState({pass: evt.target.value})
    }
    handleEmailChange(evt){
        this.setState({email: evt.target.value})
    }
    handleSubmit(evt){
        evt.preventDefault()
        this.callGetASSchedule()
    }
    render(){
    	return(
    		<div>
                <button onClick={this.handleSubmit} disabled={this.state.inProcess} >Get Schedule</button>
                <h3>
                    {this.state.message}
                </h3>
    		</div>
    	);
    }
}
export default AddASSchedule ;