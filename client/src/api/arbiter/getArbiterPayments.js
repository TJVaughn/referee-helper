import axios from 'axios'

export default async function getArbiterPayments() {
    console.log('starting get arbiter payments')
    let value = false
    let payments = await axios({
        url: '/api/arbiter/payments',
        method: 'get',
        responseType: 'json'
    })
    console.log(payments.data)
    if(payments.data.error) return value = false
    return value = true
} 
