import React, { Component } from 'react';
import postRequest from '../utils/postRequest'

class AddHWRSchedule extends Component {
    constructor(props){
        super(props);
        this.state = {
            toggle: false,
            email: '',
            pass: '',
            message: '',
            inProcess: false
        }
        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handlePassChange = this.handlePassChange.bind(this)
        this.handleToggle = this.handleToggle.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    async callGetSchedule(){
        const data = {
            "username": this.state.email,
            "password": this.state.pass
        }
        console.log("data: ", data)
        this.setState({message: "Fetching schedule, this may take up to 30 seconds", inProcess: true })
        const response = await postRequest('horizon/schedule', 'POST', { data })
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
    			<form onSubmit={this.handleSubmit}>
                    <label>Horizon login USERNAME</label>
                    <input disabled={this.state.inProcess} onChange={this.handleEmailChange} placeholder="Horizon login USERNAME" 
                        type="text" value={this.state.email} />
                    <label>Horizon login password</label>
                    <input disabled={this.state.inProcess} onChange={this.handlePassChange} placeholder="Horizon login password" 
                        type="password" value={this.state.pass} />
                    {/* <label>Get All Games?</label> */}
                    {/* <input type="checkbox" value={this.state.toggle} checked onClick={this.handleToggle} /> */}
                    <button disabled={this.state.inProcess}>Get Schedule</button>
                </form>
                <h3>
                    {this.state.message}
                </h3>
    		</div>
    	);
    }
}
export default AddHWRSchedule ;
