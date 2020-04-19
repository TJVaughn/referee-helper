import React, { Component } from 'react';
import getRequest from '../utils/getRequest'
import { getCookie } from '../utils/cookies'
import { Redirect, Link } from 'react-router-dom';
import formatNumber from '../utils/formatNumber';
import postRequest from '../utils/postRequest';

class Profile extends Component {
	constructor(props){
		super(props)
		this.state = {
			userProfile: {
				stripeData: {
					plan: {

					}
				}
			},
			message: '',
			redirect: '',
			alert: false,
			cancelEmail: ''
		}
		this.handleArbiterProfileSubmit = this.handleArbiterProfileSubmit.bind(this)
		this.handleCancelButton = this.handleCancelButton.bind(this)
		this.handleUserEmail = this.handleUserEmail.bind(this)
		this.handleCancelUserSubscription = this.handleCancelUserSubscription.bind(this)
	}
	async callGetUser() {
		const req = await getRequest('user/me')
		this.setState({userProfile: req, message: ''})
		
		console.log(this.state.userProfile)
	}
	async callGetASProfile(){
		const req = await getRequest('arbiter/profile')
		// console.log(req)
		if(req.error){
			return this.setState({message: req.error})
		}
		return this.callGetUser()
	}
	handleArbiterProfileSubmit() {
		this.callGetASProfile()
	}
	async componentDidMount(){
		if(getCookie("InitialLoginFlow") === "true"){
			this.setState({message: "Syncing..."})
			await this.callGetASProfile()
			await this.callGetUser()
			this.setState({redirect: <Redirect to={'/'} />})
		}
		await this.callGetUser()
	}

	handleCancelButton(){
		if(!this.state.alert){
			return this.setState({alert: true})
		}
		return this.setState({alert: false})
	}
	async handleCancelUserSubscription(){
		const data = {
			cancelEmail: this.state.cancelEmail
		}
		const req = await postRequest('stripe/cancel-subscription', 'POST', {data})
		console.log(req)
		window.location.reload()
	}
	handleUserEmail(evt){
		this.setState({cancelEmail: evt.target.value})
	}
    render(){
		let user = this.state.userProfile
		const alertBox = <div className='Profile-alert-box-container'>
			<div className="Profile-alert-box-inner">
				<h1>Cancel Subscription</h1>
				<p>
					To cancel, please input your email on file.
				</p>
				<input className={'Profile-cancel-email-input'} onChange={this.handleUserEmail} type='email' value={this.state.cancelEmail} />
				<br />
				<button disabled={this.state.cancelEmail !== user.email ? true : false} 
					onClick={this.handleCancelUserSubscription} 
					className={`Profile-cancel-button ${this.state.cancelEmail !== user.email ? 'disabled' : ''}`}>
					CANCEL
				</button>
				<p>Wait, I changed my mind!</p>
				<p onClick={this.handleCancelButton} className="Profile-dont-cancel-button">
					Don't cancel
				</p>
			</div>
		</div>
    	return(
    		<div>
				<h1>Account</h1>
				<label>ReSync from Arbiter: </label>
				<button onClick={this.handleArbiterProfileSubmit}>Sync</button>
				<h2>
					{this.state.message}
				</h2>
				<div>
					<h3>
						{user.fName} {user.lName}
					</h3>
					<h3>
						{user.email}
					</h3>
					<div>
						<p>
							{user.street}
						</p>
						<p>
							{user.city}
						</p>
						<p>
							{user.state}
						</p>
						<p>
							{user.postalCode}
						</p>
					</div>
					<div>
						<h3>
							Arbiter Email: {user.asEmail}
						</h3>
						<Link to={'/arbiter-sync'} >Update Arbiter Login Info</Link>
						<h3>
							Horizon Username: {user.hwrUsername}
						</h3>
						<Link to={'/horizon-sync'} >Update Horizon Login Info</Link>
					</div>
				</div>
				{this.state.redirect}
				{/* <Stripe /> */}
				<div>
					<h3>
						Manage your subscription
					</h3>
					<p>
						Your current subscription:
					</p>
					<p>
						Subscription start date:
						<br />
						{new Date(user.stripeData.startDate * 1000).toLocaleDateString()}
					</p>
					{/* <p>
						Subscription end/renewal:
						<br />
						{new Date(user.stripeData.endDate * 1000).toLocaleDateString()}
					</p> */}
					{/* {console.log(new Date(user.stripeData.billingCycleAnchor * 1000).toLocaleDateString())} */}
					<p>
						Status: {user.stripeData.status}
					</p>
					<p>
						{/* Set to renew at {new Date(user.stripeData.endDate * 1000).toLocaleDateString()} */}
						{user.stripeData.cancelAtPeriodEnd
						? <p>
							Will not renew at {new Date(user.stripeData.endDate * 1000).toLocaleDateString()}
							</p>
						: <p>
							Will renew on {new Date(user.stripeData.endDate * 1000).toLocaleDateString()} for ${formatNumber(user.stripeData.plan.amount)}
						</p>}
					</p>
					<p onClick={this.handleCancelButton} className="Profile-cancel-button">CANCEL Subscription</p>
				</div>
				{this.state.alert
				? alertBox
				:''}
    		</div>
    	);
    }
}
export default Profile ;