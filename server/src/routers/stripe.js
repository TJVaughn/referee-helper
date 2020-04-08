const express = require('express')
const router = new express.Router()
const stripe = require('stripe')(process.env.TEST_STRIPE_SECRET)
const auth = require('../middleware/auth')

router.post('/api/stripe', auth, async (req, res) => {
    try {
        // const customer = await stripe.customers.create({

        // })
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1099,
            currency: 'usd',
            // Verify your integration in this guide by including this parameter
            metadata: {integration_check: 'accept_a_payment'},
            payment_method_types: ['card']
          });
          res.send(paymentIntent)
    } catch (error) {
        res.status(500).send({error: "Error in Stripe Payments API: " + error})
    }
})

module.exports = router



//TESTING
// const callStripe = async () => {
//     const customer = await stripe.paymentIntents.create({
//         receipt_email: "hauck.trevor@gmail.com",
//         amount: 10000,
//         currency: 'usd',
//         payment_method_types: ['card']
//     })
//     return customer
// }
// const paymentIntent = await callStripe()
// res.send(paymentIntent)