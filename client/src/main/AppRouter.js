import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { getCookie } from '../utils/cookies'
import ArbiterSyncRouter from '../paths/arbiter-sync/ArbiterSyncRouter';
import HorizonSyncRouter from '../paths/horizon-sync/HorizonSyncRouter';
import ProfileRouter from '../paths/profile/ProfileRouter';
import IndexRouter from '../paths/home/IndexRouter';
import ProfileDropdown from '../paths/navigation/ProfileDropdown';
import SingleGameRouter from '../paths/single-game/SingleGameRouter';
import LoginRouter from '../paths/login-signup/LoginRouter';
import SignupRouter from '../paths/login-signup/SignupRouter';
import SubscriptionRouter from '../paths/subscription/SubscriptionRouter';

class AppRouter extends Component {
    constructor(props){
        super(props);
        this.state = {loggedIn: false}
    }
    isLoggedIn(){
        if(getCookie('loggedIn') === 'true'){
            return this.setState({loggedIn: true})
        }
        return this.setState({loggedIn: false})
    }
    componentWillUnmount(){
        this.isLoggedIn()
    }
    componentDidMount(){
        this.isLoggedIn()
    }
    navbarMenu(){
        return (
            <div className="Site-Navigation">
                <div>
                    <Link id="Site-title" to={'/'} >Referee Helper</Link>
                </div>
                {this.state.loggedIn
                ? <div>
                    <div>
                        <ProfileDropdown />
                    </div>
                </div>
                :<div>
                    <div>
                        <Link to={'/login'}>Login</Link>
                    </div>
                    <div>
                    <Link to={'/signup'}>Sign Up</Link>
                    </div>
                </div>
                }
            </div>
        )
    }
    render(){
    	return(
    		<div>
                <Router>
                {this.navbarMenu()}
                <hr />
                    <Switch>
                        <Route exact path={'/'} component={IndexRouter} />
                        <Route path={'/profile'} component={ProfileRouter} />
                        <Route exact path={'/game/:id'} component={SingleGameRouter} />
                        <Route exact path={'/login'} component={LoginRouter} />
                        <Route exact path={'/signup'} component={SignupRouter} />
                        <Route exact path={'/subscription'} component={SubscriptionRouter} />
                        <Route exact path={'/arbiter-sync'} component={ArbiterSyncRouter} />
                        <Route exact path={'/horizon-sync'} component={HorizonSyncRouter} />
                    </Switch>
                </Router>

    		</div>
    	);
    }
}
export default AppRouter ;
//90 LINES