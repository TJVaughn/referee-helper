import React, { Component } from 'react';
import getRequest from '../utils/getRequest'

class AddHWRSchedule extends Component {
    constructor(props){
        super(props);
        this.state = {
            toggle: false,
            message: '',
            inProcess: false
        }
        this.handleToggle = this.handleToggle.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    async callGetSchedule(){
        this.setState({message: "Fetching schedule, this may take up to 30 seconds", inProcess: true })
        const response = await getRequest('horizon/schedule')
        console.log(response)
        if(response.error){
            return this.setState({message: "Invalid Login"})
        }
        window.location.reload()
    }
    handleToggle() {
        if(!this.state.toggle){
            return this.setState({toggle: true})
        }
        return this.setState({toggle: false})
    }
    handlePassChange(evt){
        this.setState({pass: evt.target.value})
    }
    handleEmailChange(evt){
        this.setState({email: evt.target.value})
    }
    handleSubmit(evt){
        evt.preventDefault()
        this.callGetSchedule()
    }
    render(){
    	return(
    		<div>
                <button onClick={this.handleSubmit} disabled={this.state.inProcess}>Get Schedule</button>
                <h3>
                    {this.state.message}
                </h3>
    		</div>
    	);
    }
}
export default AddHWRSchedule ;
