const handleStripeSubscription = async (subscription, stripe) => {
    const { latest_invoice } = subscription
    const { payment_intent } = latest_invoice

    if (payment_intent) {
        const { client_secret, status } = payment_intent;
    
        if (status === 'requires_action') {
            const result = await stripe.confirmCardPayment(client_secret)

            if (result.error) {
              // Display error message in your UI.
              // The card was declined (i.e. insufficient funds, card has expired, etc)
              console.log(`Handle subscription, result error:`)
              console.log(result)
              return {error: result.error};
            } else {
              // Show a success message to your customer
              console.log(`Handle subscription, confirm subscription with back end:`)
              console.log(subscription.id)
              return {verify: subscription.id};
            }

        } else {
          // No additional information was needed
          // Show a success message to your customer
          return subscription;
        }

      } else {
        return subscription;
      }
}
export default handleStripeSubscription