import React, { Component } from 'react';
import formatNumber from '../../utils/formatNumber';
import postRequest from '../../utils/postRequest';
import getRequest from '../../utils/getRequest';

class ProfileBilling extends Component {
    constructor(props){
        super(props);
        this.state = {
            alert: false,
            stripeUser: {
                subscriptions: {
                    data: [
                        {
                            plan: {
                                
                            }
                        }
                    ]
                }
            },
            billingHistory: {
                data: [{
                    status_transitions: {}
                }]
            },
            user: {
                stripeData: {
                    plan: {}
                }
            }
        }
        this.handleCancelButton = this.handleCancelButton.bind(this)
		this.handleUserEmail = this.handleUserEmail.bind(this)
		this.handleCancelUserSubscription = this.handleCancelUserSubscription.bind(this)
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
		await postRequest('stripe/cancel-subscription', 'POST', {data})
		// console.log(req)
		window.location.reload()
	}
	handleUserEmail(evt){
		this.setState({cancelEmail: evt.target.value})
	}
    
    async callStripeApi(){
        let response = await fetch(`/api/stripe/customer`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        response = await response.json()
        console.log(response)
        this.setState({stripeUser: response.customer, billingHistory: response.customerBillingHistory})
    }
    async callGetUser() {
		const req = await getRequest('user/me')
		this.setState({user: req, message: ''})
		
		// console.log(this.state.user)
	}
    componentDidMount(){
        this.callStripeApi()
        this.callGetUser()
    }
    render(){
        let user = this.state.user
        // console.log(user)
        let stripeUser = this.state.stripeUser
        const alertBox = 
        <div className='Profile-alert-box-container'>
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

        const billingHistoryMap = this.state.billingHistory.data.map(item =>
            <div>
                <p>
                    Date paid: {new Date(item.status_transitions.paid_at * 1000).toLocaleDateString()}
                </p>
                <p>
                    Amount paid: ${formatNumber(item.amount_paid)}
                </p>
                <p>
                    Status: {item.status}
                </p>
                <hr />
            </div>
        )

    	return(
    		<div>
    			<div>
					<h3>
						Billing
					</h3>
					<p>
						Subscription start date:
						<br />
						{new Date(stripeUser.subscriptions.data[0].current_period_start * 1000).toLocaleDateString()}
					</p>

					<p>
						Subscription status: {stripeUser.subscriptions.data[0].plan.active ? 'pro' : 'free'}
					</p>
					<div>
						{stripeUser.subscriptions.data[0].cancel_at_period_end
						? <p>
							Will not renew on {new Date(stripeUser.subscriptions.data[0].current_period_end * 1000).toLocaleDateString()}
							</p>
						: <p>
							Will renew on {new Date(stripeUser.subscriptions.data[0].current_period_end * 1000).toLocaleDateString()} 
                            {' '}for ${formatNumber(stripeUser.subscriptions.data[0].plan.amount)}
						</p>}
					</div>
					<p onClick={this.handleCancelButton} className="Profile-cancel-button">CANCEL Subscription</p>
				</div>
				{this.state.alert
				? alertBox
				:''}
                <h3>History</h3>
                {billingHistoryMap}
                {/* {console.log(stripeUser.subscriptions.data[0])} */}
    		</div>
    	);
    }
}
export default ProfileBilling ;