import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import ProfileImg from '../images/grey-profile-img.png'
class ProfileDropdown extends Component {
    constructor(props){
        super(props)
        this.state = {
            toggle: false
        }
        this.handleToggle = this.handleToggle.bind(this)
    }
    handleToggle(){
        if(this.state.toggle){
            return this.setState({toggle: false})
        }
        this.setState({toggle: true})
    }
    render(){
    	return(
    		<div>
                <img onClick={this.handleToggle} className="Profile-img-icon" alt='profile' src={ProfileImg} />
                
                {this.state.toggle
                ?<div className={`Profile-img-dropdown`}>
                    <Link to={'/profile'}>Account</Link>
                    <br />
                    <Link>Log Out</Link>
                </div>
                :''}
    		</div>
    	);
    }
}
export default ProfileDropdown ;