import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import ProfileImg from '../images/grey-profile-img.png'
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
    logoutUser(){

    }
    render(){
    	return(
    		<div className="Profile-dropdown-container">
                <img onClick={this.handleToggle} className="Profile-img-icon" alt='profile' src={ProfileImg} />
                
                {this.state.toggle
                ?<div className={`Profile-img-dropdown`}>
                    <Link onClick={this.handleToggle} to={'/profile'}>Account</Link>
                    <br />
                    {this.state.logout
                    ?<div>
                        <span className="pointer" onClick={this.handleLogout}>Are you sure?</span><br />
                        <Link onClick={this.logoutUser}>Logout</Link>
                    </div>
                    :<Link onClick={this.handleLogout}>Log Out</Link>}
                    
                </div>
                :''}
    		</div>
    	);
    }
}
export default ProfileDropdown ;