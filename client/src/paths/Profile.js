import React, { Component } from 'react';
import getRequest from '../utils/getRequest'
import { getCookie } from '../utils/cookies'
import { Redirect } from 'react-router-dom';
import postRequest from '../utils/postRequest';
import ProfileAccount from '../modules/ProfileAccount';
import ProfileBilling from '../modules/ProfileBilling';

class Profile extends Component {
	constructor(props){
		super(props)
		this.state = {
			account: true,
			billing: false, 
			message: '',
			redirect: '',
			user: {
				
			}
		}
		this.handleAccountClick = this.handleAccountClick.bind(this)
		this.handleBillingClick = this.handleBillingClick.bind(this)
	}
	
	async callGetUser() {
		const req = await getRequest('user/me')
		this.setState({user: req, message: ''})
		
		console.log(this.state.user)
	}
	async componentDidMount(){
		this.callGetUser()
		if(getCookie('loggedIn') === 'false'){
			return this.setState({redirect: <Redirect to={'/'} />})
		}
		if(getCookie("InitialLoginFlow") === "true"){
			this.setState({message: "Syncing..."})
			await this.callGetASProfile()
			await this.callGetUser()
			return this.setState({redirect: <Redirect to={'/'} />})
		}
	}

	handleAccountClick(){
		return this.setState({account: true, billing: false})
	}
	handleBillingClick(){
		return this.setState({billing: true, account: false})
	}
    render(){
    	return(
    		<div>
				<div className="Profile-navigation">
					<h2 onClick={this.handleAccountClick} >Account</h2>
					<h2 onClick={this.handleBillingClick} >Billing</h2>
				</div>
				{this.state.account
				? <ProfileAccount user={this.state.user} />
				:''}
				{this.state.billing
				? <ProfileBilling user={this.state.user} />
				:''}
				{this.state.redirect}
				
    		</div>
    	);
    }
}
export default Profile ;