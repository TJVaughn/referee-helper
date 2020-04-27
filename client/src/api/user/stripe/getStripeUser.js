const getStripeUser = async () => {
    let user = await fetch('/api/stripe/customer', {
        method: 'GET',
        headers: {
            "Content-Type": 'application/json'
        }
    })
    user = await user.json()
    const { customer, customerBillingHistory } = user;
    return {customer, customerBillingHistory}
}
export default getStripeUser