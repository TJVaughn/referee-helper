import React, { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from './CheckoutForm'
import { Redirect } from 'react-router-dom';
import useToggle from '../../hooks/useToggle';

const stripePromise = loadStripe('pk_test_9WR0c2WUivrrh1lKGlJOTRNx009KCbgori')

function Stripe(){
	const [ isUser, setIsUser ] = useToggle(false)
	useEffect(() => {
		const callStripeApi = async () => {
			let response = await fetch(`/api/stripe/customer`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})
			response = await response.json()
			if(response.customer.subscriptions.data[0] === undefined){
				return
			} else if(response.customer.subscriptions.data[0].plan.active){
				setIsUser(true)
			}
		}
		callStripeApi()
	}, [setIsUser])
	return (
		<div>
			{isUser
			?<Redirect to={'/'}>Home</Redirect>
			:<Elements stripe={stripePromise}>
				<CheckoutForm />
			</Elements>}
		</div>
	)
}
export default Stripe
//49 LINES