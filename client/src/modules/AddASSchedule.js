import React, { Component } from 'react';
import postRequest from '../utils/postRequest'

class AddASSchedule extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            pass: '',
            message: '',
            inProcess: false
        }
        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handlePassChange = this.handlePassChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    async callGetASSchedule(){
        const data = {
            "email": this.state.email,
            "password": this.state.pass,
            "getAll": true
        }
        console.log("data: ", data)
        this.setState({message: "Fetching schedule, this may take up to 30 seconds", inProcess: true})

        const response = await postRequest('arbiter/schedule', 'POST', { data })
        if(response.error){
            return this.setState({message: "Invalid Login"})
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
    			<form onSubmit={this.handleSubmit}>
                    <label>Arbiter login email</label>
                    <input disabled={this.state.inProcess} onChange={this.handleEmailChange} placeholder="Arbiter login email" 
                        type="email" value={this.state.email} />
                    <label>Arbiter login password</label>
                    <input disabled={this.state.inProcess} onChange={this.handlePassChange} placeholder="Arbiter login password" 
                        type="password" value={this.state.pass} />
                    <button disabled={this.state.inProcess} >Get Schedule</button>
                </form>
                <h3>
                    {this.state.message}
                </h3>
    		</div>
    	);
    }
}
export default AddASSchedule ;