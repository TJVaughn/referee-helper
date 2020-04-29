export default async function getArbiterPayments() {
    let value
    let payments = await fetch('api/arbiter/payments', {
        method: 'get',
        headers: {
            "Content-Type": "application/json"
        }
    })
    payments = await payments.json()
    if(payments.error) return value = false
    return value = true
} 