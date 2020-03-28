import React, { Component } from 'react';
import getRequest from '../utils/getRequest'

class Profile extends Component {
	constructor(props){
		super(props)
		this.state = {
			userProfile: {},
			message: ''
		}
		this.handleArbiterProfileSubmit = this.handleArbiterProfileSubmit.bind(this)
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
	async handleArbiterProfileSubmit(){
		// evt.preventdefault()
		this.setState({message: "Syncing..."})
		await this.callGetASProfile()
	}
	componentDidMount(){
		this.callGetUser()
	}
    render(){
		let user = this.state.userProfile
    	return(
    		<div>
				<h1>Profile</h1>
				<label>Upload from Arbiter: </label>
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
						<h3>Arbiter Email: {user.asEmail}</h3>
						<h3>
							Horizon Username: {user.hwrUsername}
						</h3>
					</div>
				</div>
    		</div>
    	);
    }
}
export default Profile ;