import React, { useState } from 'react';
import { ElementsConsumer, CardElement } from '@stripe/react-stripe-js';
import CardSection from './CardSection';
import { Redirect } from 'react-router-dom'
import Loading from '../../modules/Loading'
import useToggle from '../../hooks/useToggle';
import useInput from '../../hooks/useInput';
import stripePaymentMethodHandler from './modules/stripePaymentMethodHandler';
import handleStripeSubscription from './modules/handleStripeSubscription';
import verifySubscription from './modules/verifySubscription'
import orderComplete from './modules/orderComplete';

function CheckoutForm(props){
    const [ inProcess, setInProcess ] = useToggle(false)
    const [ price, setPrice ] = useState('77.97')
    const [ message, setMessage ] = useState('')
    const [ annualSub, setAnnualSub ] = useState(true) 
    const stripe = props.stripe

    const successfulSubscription = () => {
        setInProcess(false)
        setMessage('Success! Page redirecting in 3 seconds...')
        setTimeout(() => {
            return setMessage(<Redirect to={'/profile/account'} />)
        }, 3000)
    }
    const postSubmit = async () => {
        const { stripe, elements } = props

        if (!stripe || !elements) {
            return;
        }
        const result = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)
        });
        console.log("Handle submit, create payment method: ")
        console.log(result)
        const response = await stripePaymentMethodHandler(result, formInput.name, annualSub)
        if(response.error){
            setInProcess(false)
            return setMessage(result.error.message)
        }
        const subscription = await handleStripeSubscription(response.subscription, stripe)
        if(subscription.error){
            setInProcess(false)
            return setMessage(subscription.error)
        }
        if(subscription.verify){
            const verifyRes = await verifySubscription(subscription.id)
            if(verifyRes){
                const order = await orderComplete(subscription)
                if(order){
                    return successfulSubscription()
                }
            }
        }
        const order = await orderComplete(subscription)
        if(order){
            return successfulSubscription()
        }
    }
    const { formInput, handleInputChange, handleSubmit } = useInput(postSubmit)
    return (
        <div>
            <form onSubmit={handleSubmit}>
            <h2>Select your subscription: </h2>
            <div className="Stripe-checkout-subscription-container">
                <div onClick={() => {setAnnualSub(false);setPrice('10.99')}} className={`Stripe-checkout-subscription-choice ${!annualSub ? 'selected': ''}`}>
                    <h5>Monthly</h5>
                    <p className="number">$10.99/month</p>
                </div>
                <div onClick={() => {setAnnualSub(true);setPrice('77.97')}} className={`Stripe-checkout-subscription-choice ${annualSub ? 'selected': ''}`}>
                    <h5>Annual</h5>
                    <p className="number">$77.97/year</p>
                </div>
            </div>
            <div className="Stripe-checkout-info-section">
                Receipt will be sent to email on file.
            </div>
            <div>
                <input required className="Stripe-checkout-info-section" 
                type="text" defaultValue="Johnny Hockey" 
                placeholder="Full Name" value={formInput.name} name='name' onChange={handleInputChange} />
            </div>
            <div className="Stripe-checkout-card-section">
                <CardSection />
            </div>
            
            <button onClick={() => {setInProcess(true)}} className="Stripe-checkout-button" type="submit" disabled={!stripe || inProcess}>
                <strong className='number'>
                    ${price}
                </strong>
                <br />
                Subscribe
            </button>
            <h3>
                {message}
            </h3>
        </form>
        {inProcess
            ? <Loading />
            :''}
        </div>
    )
}
export default function InjectedCheckoutForm() {
  return (
    <ElementsConsumer>
      {({stripe, elements}) => (
        <CheckoutForm  stripe={stripe} elements={elements} />
      )}
    </ElementsConsumer>
  );
}

// 240 LINES!!! ALL IN ONE COMPONENT!!!
//Now separated into 4 modules, and half the size here. 