const orderComplete = async (subscription) => {
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
    return body
}
export default orderComplete