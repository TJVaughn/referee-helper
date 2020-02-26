import React, { Component } from 'react';
import postRequest from '../utils/postRequest'

class AddASSchedule extends Component {
    constructor(props){
        super(props);
        this.state = {
            toggle: false,
            email: '',
            pass: '',
            message: ''
        }
        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handlePassChange = this.handlePassChange.bind(this)
        this.handleToggle = this.handleToggle.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    async callGetASSchedule(){
        const data = {
            "email": this.state.email,
            "password": this.state.pass,
            "getAll": this.state.toggle
        }
        console.log("data: ", data)
        this.setState({message: "Fetching schedule, this may take up to 30 seconds"})
        const response = await postRequest('arbiter/schedule', 'POST', { data })
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
        this.callGetASSchedule()
    }
    render(){
    	return(
    		<div>
    			<form onSubmit={this.handleSubmit}>
                    <label>Arbiter login email</label>
                    <input onChange={this.handleEmailChange} placeholder="Arbiter login email" 
                        type="email" value={this.state.email} />
                    <label>Arbiter login password</label>
                    <input onChange={this.handlePassChange} placeholder="Arbiter login password" 
                        type="password" value={this.state.pass} />
                    <label>Get All Games?</label>
                    <input type="checkbox" value={this.state.toggle} onClick={this.handleToggle} />
                    <button>Get Schedule</button>
                </form>
                <h3>
                    {this.state.message}
                </h3>
    		</div>
    	);
    }
}
export default AddASSchedule ;