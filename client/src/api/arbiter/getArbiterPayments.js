import axios from 'axios'

export default async function getArbiterPayments() {
    let value
    let payments = await axios({
        url: '/api/arbiter/payments',
        method: 'get',
        responseType: 'json'
    })
    payments = await payments.json()
    if(payments.error) return value = false
    return value = true
} 