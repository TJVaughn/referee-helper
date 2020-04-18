import React, { Component } from 'react';
import postRequest from '../utils/postRequest'
import { Redirect } from 'react-router-dom';
import { setCookie } from '../utils/cookies'

class Login extends Component {
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
	handleEmail(evt){
		this.setState({email: evt.target.value})
	}
	handlePass(evt){
		this.setState({password: evt.target.value})
	}
	async callLogin(){
		const data = {
			"email": this.state.email,
			"password": this.state.password
		}
		const res = await postRequest('user/login', 'POST', { data })
		console.log(res)
		// if(res.message){
		// 	return this.setState({error: res.message})
		// }
		if(res.error){
			return this.setState({error: res.error})
		}
		setCookie('loggedIn', true)
		this.setState({error: '', redirect: <Redirect to={'/'} />})
		window.location.reload()

	}

	handleSubmit(evt){
		evt.preventDefault()
		this.callLogin()
	}
    render(){
    	return(
    		<div>
				<h1>Login</h1>
    			<form onSubmit={this.handleSubmit}>
					<input type="email" placeholder="email" onChange={this.handleEmail} value={this.state.email} />
					<input type="password" placeholder="password" onChange={this.handlePass} value={this.state.password} />
					<button>Login</button>
				</form>
				{this.state.error}
				{this.state.redirect}
    		</div>
    	);
    }
}

export default Login ;