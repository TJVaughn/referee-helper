import axios from 'axios'

export default async function getArbiterPayments() {
    let value
    let payments = await axios({
        url: '/api/arbiter/payments',
        method: 'get',
        responseType: 'json'
    })
    console.log(payments)
    if(payments.error) return value = false
    return value = true
} 
