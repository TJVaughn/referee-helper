import React, { Component } from 'react';
import { ElementsConsumer, CardElement } from '@stripe/react-stripe-js';
import CardSection from './CardSection';


class CheckoutForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            monthly: false,
            semiAnnual: false,
            annual: true,
            message: '',
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleMonthlySub = this.handleMonthlySub.bind(this)
        this.handleSemiAnnualSub = this.handleSemiAnnualSub.bind(this)
        this.handleAnnualSub = this.handleAnnualSub.bind(this)
    }


    async stripePaymentMethodHandler(result) {
        if (result.error) {
          // Show error in payment form
          this.setState({message: result.error})
        } else {
          // Otherwise send paymentMethod.id to your server
          let plan = ''
        if(this.state.monthly){
            plan = 'monthly'
        } else if(this.state.semiAnnual){
            plan = 'semi-annual'
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
          const customer = await res.json();
          console.log(customer)
          this.setState({message: "Success!"})
        }
      }


    async handleSubmit (event){
    // We don't want to let default form submission happen here,
    // which would refresh the page.
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

        this.stripePaymentMethodHandler(result)
    };
    handleMonthlySub(){
        this.setState({monthly: true, semiAnnual: false, annual: false})
    }
    handleSemiAnnualSub(){
        this.setState({monthly: false, semiAnnual: true, annual: false})
    }
    handleAnnualSub(){
        this.setState({monthly: false, semiAnnual: false, annual: true})
    }

    render() {

        const {stripe} = this.props

        return (
            <form onSubmit={this.handleSubmit}>
                <h2>Select your subscription: </h2>
                <div className="Stripe-checkout-subscription-container">
                    <div onClick={this.handleMonthlySub} className={`Stripe-checkout-subscription-choice ${this.state.monthly ? 'selected': ''}`}>
                        <h5>Monthly</h5>
                        <p className="number">$10.99/month</p>
                    </div>
                    <div onClick={this.handleSemiAnnualSub} className={`Stripe-checkout-subscription-choice ${this.state.semiAnnual ? 'selected': ''}`}>
                        <h5>Semi-Annual (every 6 months)</h5>
                        <p className="number">$50.99/6 months</p>
                    </div>
                    <div onClick={this.handleAnnualSub} className={`Stripe-checkout-subscription-choice ${this.state.annual ? 'selected': ''}`}>
                        <h5>Annual</h5>
                        <p className="number">$77.97/year</p>
                    </div>
                </div>
                <div className="Stripe-checkout-card-section">
                    <CardSection />
                </div>

                <button className="Stripe-checkout-button" type="submit" disabled={!stripe}>
                    Subscribe
                </button>
                <br />
                <br />
                <br />
                <br />
                {this.state.message}
                <p>Thanks</p>
            </form>
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