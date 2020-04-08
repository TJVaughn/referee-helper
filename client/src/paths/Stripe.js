import React, { Component } from 'react';
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
// import CardSection from '../modules/CardSection'
import CheckoutForm from '../modules/CheckoutForm'

const stripePromise = loadStripe('pk_test_9WR0c2WUivrrh1lKGlJOTRNx009KCbgori')

class Stripe extends Component {
    render(){
    	return(
    		<div>
    			<Elements stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
    		</div>
    	);
    }
}
export default Stripe ;