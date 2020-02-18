import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import Schedule from '../paths/Schedule'
import Login from '../paths/Login'
import Signup from '../paths/Signup'
import Profile from '../paths/Profile'
import SingleGame from '../paths/SingleGame'

function IndexRouter(){
    return (
        <div>
            <Schedule />
        </div>
    )
}

function ProfileRouter(){
    return(
        <div>
            <Profile />
        </div>
    )
}

function LoginRouter(){
    return (
        <div>
            <Login />
        </div>
    )
}

function SignupRouter(){
    return (
        <div>
            <Signup />
        </div>
    )
}

function SingleGameRouter(props){
    return (
        <div>
            <SingleGame id={props.match.params.id} />
        </div>
    )
}
class AppRouter extends Component {

    navbarMenu(){
        return (
            <div className="Site-Navigation">
                <div>
                    <Link to={'/'} ><h1 id="Site-title">RefereeHelper.com</h1></Link>
                </div>
                <div>
                    <Link to={'/profile'} >Profile</Link>
                </div>
                <div>
                    <Link to={'/login'}>Login</Link>
                </div>
                <div>
                    <Link to={'/signup'}>Sign Up</Link>
                </div>
                
            </div>
        )
    }

    render(){
    	return(
    		<div>
                <Router>
                {this.navbarMenu()}
                    <Switch>
                        <Route path={'/'} exact component={IndexRouter} />
                        <Route path={'/profile'} component={ProfileRouter} />
                        <Route path={'/login'} component={LoginRouter} />
                        <Route path={'/signup'} component={SignupRouter} />
                        <Route path={'/game/:id'} component={SingleGameRouter} />
                    </Switch>
                </Router>
    		</div>
    	);
    }
}
export default AppRouter ;