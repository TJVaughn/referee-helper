const verfiySubscription = async (subscriptionId) => {
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
    return value
}
export default verfiySubscription