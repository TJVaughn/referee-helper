import React, { Component } from 'react';
import { ElementsConsumer, CardElement } from '@stripe/react-stripe-js';
import CardSection from './CardSection';

const stripePaymentMethodHandler = async (result) => {
    if (result.error) {
      // Show error in payment form
    } else {
      // Otherwise send paymentMethod.id to your server
      const res = await fetch('/create-customer', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: 'jenny.rosen@example.com',
          payment_method: result.paymentMethod.id
        }),
      });
  
      // The customer has been created
      const customer = await res.json();
    }
  }

class CheckoutForm extends Component {
    async getClientSecret(){
        const response = await fetch('/api/stripe', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const body = await response.json()
        // if(!body.succeeded){
        //     return console.log("Card failed")
        // }
        console.log(body)
        return body.clientSecret
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
        card: elements.getElement(CardElement),
        billing_details: {
            name: 'Trevor Vaughn',
        },
    });

    stripePaymentMethodHandler(result)
  };

  render() {
      const stripe = this.props
        return (
            <form onSubmit={this.handleSubmit}>
            <CardSection />
            <button type="submit" disabled={!stripe}>
              Subscribe
            </button>
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