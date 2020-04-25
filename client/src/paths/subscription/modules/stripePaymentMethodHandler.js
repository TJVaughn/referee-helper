const stripePaymentMethodHandler = async (result, name, annual) => {
    if (result.error) {
        // Show error in payment form
        return {error: 'Error in stripe payment method handler'}
    } else {
        // Otherwise send paymentMethod.id to your server
        let plan = ''
        if(!annual){
            plan = 'monthly'
        } else {
            plan = 'annual'
        }
        const data = {
            payment_method: result.paymentMethod.id,
            plan,
            name
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
        return response
    }
}
export default stripePaymentMethodHandler