import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import postRequest from '../../utils/postRequest';

class HorizonSync extends Component {
    constructor(props){
        super(props);
        this.state = {
            hwrUsername: '',
            hwrPassword: '',
            message: '',
            redirect: ''
        }
        this.handleUsernameInput = this.handleUsernameInput.bind(this)
        this.handlePasswordInput = this.handlePasswordInput.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    async callHorizonSyncApi(){
        const data = {
            "hwrUsername": this.state.hwrUsername,
            "hwrPassword": this.state.hwrPassword
        }
        const response = await postRequest(`horizon/sync`, 'POST', { data })
        if(response.error){
            return {error: response.error}
        }
        // const body = await response.json()
        return response;
    }
    handleUsernameInput(evt){
        this.setState({hwrUsername: evt.target.value})
    }
    handlePasswordInput(evt){
        this.setState({hwrPassword: evt.target.value})
    }
    async handleSubmit(evt){
        evt.preventDefault()
        this.setState({message: "Syncing..."})
        const result = await this.callHorizonSyncApi()
        if(result.error){
            return this.setState({message: result.error})
        }
        console.log(result)
        return this.setState({redirect: <Redirect to={'/subscription'} />})
    }
    render(){
    	return(
    		<div>
                <h1>
                    Sync your Horizon Account:
                </h1>
    			<form onSubmit={this.handleSubmit}>
                    <label>Horizon Username:</label>
                    <input type='username' value={this.state.hwrUsername} onChange={this.handleUsernameInput} />
                    <label>Horizon Password</label>
                    <input type="password" value={this.state.hwrPassword} onChange={this.handlePasswordInput} />
                    <button>Sync</button>
                </form>
                <h2>
                    {this.state.message}
                </h2>
                <p>
                    <Link to={'/subscription'}>skip</Link>
                </p>
                {this.state.redirect}
    		</div>
    	);
    }
}
export default HorizonSync ;