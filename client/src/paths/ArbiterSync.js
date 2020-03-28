import React, { Component } from 'react';
import postRequest from '../utils/postRequest';
import { Redirect } from 'react-router-dom';

class ArbiterSync extends Component {
    constructor(props){
        super(props);
        this.state = {
            asEmail: '',
            asPassword: '',
            message: '',
            redirect: ''
        }
        this.handleASEmailInput = this.handleASEmailInput.bind(this)
        this.handleASPasswordInput = this.handleASPasswordInput.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    async callArbiterSyncApi(){
        const data = {
            "asEmail": this.state.asEmail,
            "asPassword": this.state.asPassword
        }
        const response = await postRequest(`arbiter/sync`, 'POST', { data })
        if(response.error){
            return {error: response.error}
        }
        // const body = await response.json()
        return response;
    }
    handleASEmailInput(evt){
        this.setState({asEmail: evt.target.value})
    }
    handleASPasswordInput(evt){
        this.setState({asPassword: evt.target.value})
    }
    async handleSubmit(evt){
        evt.preventDefault()
        this.setState({message: "Syncing..."})
        const result = await this.callArbiterSyncApi()
        if(result.error){
            return this.setState({message: result.error})
        }
        console.log(result)
        return this.setState({redirect: <Redirect to={'/horizon-sync'} />})
    }
    render(){
    	return(
    		<div>
                <h1>
                    Sync your Arbiter Account:
                </h1>
    			<form onSubmit={this.handleSubmit}>
                    <label>Arbiter Email:</label>
                    <input type="email" value={this.state.asEmail} onChange={this.handleASEmailInput} />
                    <label>Arbiter Password</label>
                    <input type="password" value={this.state.asPassword} onChange={this.handleASPasswordInput} />
                    <button>Sync</button>
                </form>
                <h2>
                    {this.state.message}
                </h2>
                {this.state.redirect}
    		</div>
    	);
    }
}
export default ArbiterSync ;