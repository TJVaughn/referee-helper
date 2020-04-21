import React, { Component } from 'react';
// import getRequest from '../utils/getRequest'
// import { getCookie } from '../utils/cookies'
import { Link } from 'react-router-dom';
import ProfileAccount from '../modules/ProfileAccount';
import ProfileBilling from '../modules/ProfileBilling';

class Profile extends Component {
	constructor(props){
		super(props)
		this.state = {
			message: '',
			redirect: '',
			user: {
				
			}
		}
	}
	
	// async callGetUser() {
	// 	const req = await getRequest('user/me')
	// 	this.setState({user: req, message: ''})
		
	// 	console.log(this.state.user)
	// }
	// async componentDidMount(){
	// 	this.callGetUser()
	// 	if(getCookie('loggedIn') === 'false'){
	// 		return this.setState({redirect: <Redirect to={'/'} />})
	// 	}
	// 	if(getCookie("InitialLoginFlow") === "true"){
	// 		this.setState({message: "Syncing..."})
	// 		// await this.callGetASProfile()
	// 		await this.callGetUser()
	// 		return this.setState({redirect: <Redirect to={'/'} />})
	// 	}
	// }

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
					<Link to={'/profile/account'}><h2>Account</h2></Link>
					<Link to={'/profile/billing'}><h2>Billing</h2></Link>
				</div>
				{this.props.path === '/profile/account' 
				? <ProfileAccount />
				:''}

				{this.props.path === '/profile/billing' 
				? <ProfileBilling />
				:''}
				
				{this.state.redirect}
				{/* {console.log(this.props.path)} */}
    		</div>
    	);
    }
}
export default Profile ;