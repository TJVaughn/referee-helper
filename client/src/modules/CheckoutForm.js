import React, { Component } from 'react';
import { ElementsConsumer, CardElement } from '@stripe/react-stripe-js';

import CardSection from './CardSection';

class CheckoutForm extends Component {
    async getClientSecret(){
        const response = await fetch('/api/stripe', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const body = await response.json()
        console.log(body)

        return body.client_secret
    }
  handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    const {stripe, elements} = this.props

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make  sure to disable form submission until Stripe.js has loaded.
      return;
    }
    const clientSecret = await this.getClientSecret()
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Bob Johnson',
        },
      }
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <CardSection />
        <button disabled={!this.props.stripe}>Confirm order</button>
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