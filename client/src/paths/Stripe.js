import React, { Component } from 'react';
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
// import CardSection from '../modules/CardSection'
import CheckoutForm from '../modules/CheckoutForm'
import { Redirect } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_9WR0c2WUivrrh1lKGlJOTRNx009KCbgori')

class Stripe extends Component {
	constructor(props){
		super(props);
		this.state = {
			isUser: false
		}
	}

	async callStripeApi(){
        let response = await fetch(`/api/stripe/customer`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        response = await response.json()
        // console.log(response)
        if(response.customer){
			return this.setState({isUser: true})
		}
	}
	componentDidMount(){
		this.callStripeApi()
	}

    render(){
    	return(
    		<div>
				{this.state.isUser
				?<Redirect to={'/'}>Home</Redirect>
				:<Elements stripe={stripePromise}>
					<CheckoutForm />
				</Elements>}
    		</div>
    	);
    }
}
export default Stripe ;