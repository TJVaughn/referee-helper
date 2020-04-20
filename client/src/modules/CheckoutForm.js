import React, { Component } from 'react';
import { ElementsConsumer, CardElement } from '@stripe/react-stripe-js';
import CardSection from './CardSection';
import { Redirect } from 'react-router-dom'

class CheckoutForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            monthly: false,
            annual: true,
            message: '',
            loading: false,
            price: '77.97'
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleMonthlySub = this.handleMonthlySub.bind(this)
        this.handleAnnualSub = this.handleAnnualSub.bind(this)
        this.handleLoading = this.handleLoading.bind(this)
    }

    async orderComplete(subscription) {
        //TALK TO SERVER TO TALK TO DATABASE to update the user model to be subscribed
        console.log(`ORDER COMPLETE:`)
        console.log(subscription)
        let data = {
            subscription: subscription
        }
        const response = await fetch('/api/stripe/order-complete', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const body = await response.json()
        console.log(body)
        if(body.success){
            this.setState({message: "Order complete! Redirecting in 3 seconds"})
            setTimeout(() => {
                this.setState({message: <Redirect to={'/profile'} />})
            }, 3000)
        }

    }
    async confirmSubscription(subscriptionId) {
        const response = await fetch('/api/stripe/subscription', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                subscriptionId: subscriptionId
            })
        })
        let value = await response.json()
        console.log("Confirm subscription: ")
        console.log(value)
        this.orderComplete(value)
      }
    
    setErrorMessage(error){
        this.setState({message: error.message, loading: false})
    }
    async handleSubscription(subscription){
        const { latest_invoice } = subscription
        const { payment_intent } = latest_invoice

        if (payment_intent) {
            const { client_secret, status } = payment_intent;
        
            if (status === 'requires_action') {

                const result = await this.props.stripe.confirmCardPayment(client_secret)

                if (result.error) {
                  // Display error message in your UI.
                  // The card was declined (i.e. insufficient funds, card has expired, etc)
                  console.log(`Handle subscription, result error:`)
                  console.log(result)
                  this.setErrorMessage(result.error);
                } else {
                  // Show a success message to your customer
                  console.log(`Handle subscription, confirm subscription with back end:`)
                  console.log(subscription.id)
                  this.confirmSubscription(subscription.id);
                }

            } else {
              // No additional information was needed
              // Show a success message to your customer
              this.orderComplete(subscription);
            }

          } else {
            this.orderComplete(subscription);
          }
    }
    async stripePaymentMethodHandler(result) {
        if (result.error) {
            // Show error in payment form
            this.setState({message: result.error.message})
        } else {
            // Otherwise send paymentMethod.id to your server
            let plan = ''
            if(this.state.monthly){
                plan = 'monthly'
            } else {
                plan = 'annual'
            }
            const data = {
                payment_method: result.paymentMethod.id,
                plan
            }
            const res = await fetch('/api/stripe/setup-customer', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });
        
            // The customer has been created
            const response = await res.json();
            console.log("Payment Method handler, setup customer/subscription: ")
            console.log(response)
            this.handleSubscription(response.subscription)
        }
    }
    async handleSubmit(event){
        this.setState({loading: true})
        event.preventDefault();
        const { stripe, elements } = this.props

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make  sure to disable form submission until Stripe.js has loaded.
            return;
        }
        const result = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)
        });
        console.log("Handle submit, create payment method: ")
        console.log(result)
        this.stripePaymentMethodHandler(result)
    }

    handleMonthlySub(){
        this.setState({monthly: true, annual: false, price: "10.99"})
    }

    handleAnnualSub(){
        this.setState({monthly: false, annual: true, price: "77.97"})
    }
    handleLoading(){
        this.setState({loading: true})
    }

    render() {

        const {stripe} = this.props

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                <h2>Select your subscription: </h2>
                <div className="Stripe-checkout-subscription-container">
                    <div onClick={this.handleMonthlySub} className={`Stripe-checkout-subscription-choice ${this.state.monthly ? 'selected': ''}`}>
                        <h5>Monthly</h5>
                        <p className="number">$10.99/month</p>
                    </div>
                    <div onClick={this.handleAnnualSub} className={`Stripe-checkout-subscription-choice ${this.state.annual ? 'selected': ''}`}>
                        <h5>Annual</h5>
                        <p className="number">$77.97/year</p>
                    </div>
                </div>
                <div className="Stripe-checkout-card-section">
                    <CardSection />
                </div>
                
                <button onClick={this.handleLoading} className="Stripe-checkout-button" type="submit" disabled={!stripe || this.state.loading}>
                    <strong className='number'>
                        ${this.state.price}
                    </strong>
                    <br />
                    Subscribe
                </button>
                <h3>
                    {this.state.message}
                </h3>
            </form>
            </div>
        );
    }
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




















// import React from 'react'
// import { useState } from 'react'
// import {
//     CardElement,
//     useElements,
//     useStripe
//   } from '@stripe/react-stripe-js';

//   // POST the token ID to your backend.
// async function stripeTokenHandler(token) {
//     const response = await fetch('/api/stripe', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({token: token.id})
//     });
  
//     return response.json();
//   }

//   // Custom styling can be passed to options when creating an Element.
//   const CARD_ELEMENT_OPTIONS = {
//     style: {
//       base: {
//         color: '#32325d',
//         fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
//         fontSmoothing: 'antialiased',
//         fontSize: '16px',
//         '::placeholder': {
//           color: '#aab7c4'
//         }
//       },
//       invalid: {
//         color: '#fa755a',
//         iconColor: '#fa755a'
//       }
//     }
//   };
  
//   const CheckoutForm = () => {
//     const [error, setError] = useState(null);
//     const stripe = useStripe();
//     const elements = useElements();
  
//     // Handle real-time validation errors from the card Element.
//     const handleChange = (event) => {
//       if (event.error) {
//         setError(event.error.message);
//       } else {
//         setError(null);
//       }
//     }
  
//     // Handle form submission.
//     const handleSubmit = async (event) => {
//       event.preventDefault();
//       const card = elements.getElement(CardElement);
//       const result = await stripe.createToken(card)
//       if (result.error) {
//         // Inform the user if there was an error.
//         setError(result.error.message);
//       } else {
//         setError(null);
//         // Send the token to your server.
//         stripeTokenHandler(result.token);
//       }
//     };
  
//     return (
//       <form onSubmit={handleSubmit}>
//         <div className="form-row">
//           <label htmlFor="card-element">
//             Credit or debit card
//           </label>
//           <CardElement
//             id="card-element"
//             options={CARD_ELEMENT_OPTIONS}
//             onChange={handleChange}
//           />
//           <div className="card-errors" role="alert">{error}</div>
//         </div>
//         <button type="submit">Submit Payment</button>
//       </form>
//     );
//   }

//   export default CheckoutForm