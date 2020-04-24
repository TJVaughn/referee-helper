import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom'
import getRequest from '../../utils/getRequest';
import { getCookie } from '../../utils/cookies';

class ProfileAccount extends Component {
    constructor(props){
        super(props);
        this.state = {
            userProfile: {
				stripeData: {
					plan: {

					}
				},
				
			},
			user: {},
			redirect: ''
        }
		this.handleArbiterProfileSubmit = this.handleArbiterProfileSubmit.bind(this)

    }
    
    async componentDidMount(){
		if(getCookie('loggedIn') === 'false'){
			return this.setState({redirect: <Redirect to={'/'} />})
		}
		if(getCookie("InitialLoginFlow") === "true"){
			this.setState({message: "Syncing..."})
			await this.callGetASProfile()
			return this.setState({redirect: <Redirect to={'/'} />})
		}
		await this.callGetUser()
	}
    async callGetASProfile(){
		const req = await getRequest('arbiter/profile')
		// console.log(req)
		if(req.error){
			return this.setState({message: req.error})
		}
		return
	}
	async callGetUser() {
		const req = await getRequest('user/me')
		this.setState({user: req, message: ''})
		
		// console.log(this.state.user)
	}
	handleArbiterProfileSubmit() {
		this.setState({message: "Syncing..."})
		this.callGetASProfile()
		window.location.reload()
	}
    render(){
        let user = this.state.user
    	return(
    		<div>
    			<h3>Account</h3>
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
    		</div>
    	);
    }
}
export default ProfileAccount ;