import React, { Component } from 'react';
import postRequest from '../utils/postRequest'
import { Redirect } from 'react-router-dom';
import { setCookie } from '../utils/cookies'

class Signup extends Component {
	constructor(props){
		super(props)
		this.state = {
			email: '',
			password: ''
		}
		this.handleEmail = this.handleEmail.bind(this)
		this.handlePass = this.handlePass.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleName(evt){
		this.setState({name: evt.target.value})
	}
	handleEmail(evt){
		this.setState({email: evt.target.value})
	}
	handlePass(evt){
		this.setState({password: evt.target.value})
	}
	async callSignup(){
		const data = {
			"email": this.state.email,
			"password": this.state.password
		}
		const res = await postRequest('user', 'POST', { data })
		console.log(res)
		if(res.message){
			return this.setState({error: res.message})
		}
		if(res.errmsg){
			return this.setState({error: "Email already in use"})
		}
		setCookie("loggedIn", "true")
		setCookie("InitialLoginFlow", "true")
		this.setState({error: '', redirect: <Redirect to={'/subscription'} />})
	}

	handleSubmit(evt){
		evt.preventDefault()
		this.callSignup()
	}
    render(){
    	return(
    		<div>
				<h1>Sign Up</h1>
    			<form onSubmit={this.handleSubmit}>
					<input type="email" placeholder="email" onChange={this.handleEmail} value={this.state.email} />
					<input type="password" placeholder="password" onChange={this.handlePass} value={this.state.password} />
					<button>Sign Up</button>
				</form>
				{this.state.error}
				{this.state.redirect}
    		</div>
    	);
    }
}
export default Signup ;