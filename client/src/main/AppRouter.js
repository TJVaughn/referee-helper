import React, { Component, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { getCookie, setCookie } from '../utils/cookies'
import ArbiterSyncRouter from '../paths/arbiter-sync/ArbiterSyncRouter';
import HorizonSyncRouter from '../paths/horizon-sync/HorizonSyncRouter';
import ProfileRouter from '../paths/profile/ProfileRouter';
import ProfileDropdown from '../paths/navigation/ProfileDropdown';
import SingleGameRouter from '../paths/single-game/SingleGameRouter';
import LoginRouter from '../paths/login-signup/LoginRouter';
import SignupRouter from '../paths/login-signup/SignupRouter';
import SubscriptionRouter from '../paths/subscription/SubscriptionRouter';
import Schedule from '../paths/home/Schedule'
import Landing from '../paths/landing-page/Landing'
import { createGroupObject } from '../paths/home/modules/games/groupFunctions'
import getGames from '../api/game/getGames';

function IndexRouter(props){
    const [ games, setGames ] = useState([{dateTime: '2020-01-01T12:00:00.000Z', status: ''}])
    const [ groups, setGroups ] = useState([])

    useEffect(() => {
        async function callGetGames(){
            let res = await getGames()
            if(res.error === 'Please Authenticate'){
                return setCookie("loggedIn", 'false', 0)
            }
            let [resGames, resGroups] = res
            //returns all the groups and all the games
            resGroups = createGroupObject(resGroups)
            setGroups(resGroups)
            setGames(resGames)
        }
        callGetGames()
    }, [])
    return (
        <div>
            {getCookie("loggedIn") === "true"
            ? <Schedule games={games} groups={groups} props={props} />
            :<Landing />}
        </div>
    )
}

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