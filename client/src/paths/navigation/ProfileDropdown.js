import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import ProfileImg from '../../images/grey-profile-img.png'
import { setCookie } from '../../utils/cookies';

class ProfileDropdown extends Component {
    constructor(props){
        super(props)
        this.state = {
            toggle: false,
            logout: false
        }
        this.handleToggle = this.handleToggle.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
        this.logoutUser = this.logoutUser.bind(this)
    }
    handleToggle(){
        if(this.state.toggle){
            return this.setState({toggle: false})
        }
        this.setState({toggle: true})
    }
    handleLogout() {
        if(this.state.logout){
            return this.setState({logout: false})
        }
        this.setState({logout: true})
    }
    async logoutUser(){
        let res = await fetch('/api/user/logout-all', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            }
        })
        res = await res.json()
        console.log(res)
        setCookie('loggedIn', 'false')
        window.location.reload()
    }
    render(){
    	return(
    		<div className="Profile-dropdown-container">
                <img onClick={this.handleToggle} className="Profile-img-icon" alt='profile' src={ProfileImg} />
                
                {this.state.toggle
                ?<div className={`Profile-img-dropdown`}>
                    <Link onClick={this.handleToggle} to={'/profile/account'}>Account</Link>
                    <br />
                    <Link onClick={this.handleToggle} to={'/profile/billing'}>Billing</Link>
                    <br />
                    <hr />
                    {this.state.logout
                    ?<div>
                        <span className="pointer" onClick={this.handleLogout}>Are you sure?</span><br />
                        <span className="pointer blue" onClick={this.logoutUser}>Logout</span>
                    </div>
                    :<span className="pointer blue" onClick={this.handleLogout}>Log Out</span>}
                    
                </div>
                :''}
    		</div>
    	);
    }
}
export default ProfileDropdown ;