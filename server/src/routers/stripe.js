const express = require('express')
const router = new express.Router()
const stripe = require('stripe')(process.env.TEST_STRIPE_SECRET)
const auth = require('../middleware/auth')

router.post('/api/stripe/setup-customer', auth, async(req, res) => {
    // User signs up for referee helper
    // User is then asked to choose between monthly subscription, semi-annual, and annual subscription
    // User selects product they desire, and then fills out billing information/customer form
    // The form will consist of name to be used in billing, card information(num, cvv, zip), and we will already have their
    //email and password from the initial signup.
    // The form with user info, card info and product selected will then be sent here
    // Where we will set up the customer and then process the initial sale
    // Or if we are doing a free trial, we will automatically bill the customer after the trial period has completed..
    try {
        const stripeCustomer = await stripe.customers.create({
            payment_method: req.body.payment_method,
            email: req.body.email,
            name: req.body.name,
            invoice_settings: {
                default_payment_method: req.body.payment_method
            }
        })
        let subPlan = ''
        if(req.body.plan === "monthly"){
            if(process.env.NODE_ENV === 'production'){
                subPlan = process.env.LIVE_STRIPE_PLAN_MONTHLY
            } else {
                subPlan = process.env.TEST_STRIPE_PLAN_MONTHLY
            }
        } else {
            if(process.env.NODE_ENV === 'production'){
                subPlan = process.env.LIVE_STRIPE_PLAN_ANNUAL
            } else {
                subPlan = process.env.TEST_STRIPE_PLAN_ANNUAL
            }
        }
        //DAILY FOR TESTING
        // subPlan = 'plan_H8IBHelcP0dUk3'
        //REMOVE LATER
        const subscription = await stripe.subscriptions.create({
            customer: stripeCustomer.id,
            items: [{plan: subPlan}],
            expand: ["latest_invoice.payment_intent"]
        })
        res.send({
            customer: stripeCustomer,
            subscription
        })
    } catch (error) {
        res.status(500).send({error: "Error in stripe/setup-customer: " + error})
    }
})
router.post('/api/stripe/subscription', auth, async (req, res) => {
    try {
        let subscription = await stripe.subscriptions.retrieve(
            req.body.subscriptionId
          );
            console.log(subscription)
          res.send(subscription);
    } catch (error) {
        res.status(500).send({error: "Error in api/stripe/subscription: " + error})
    }
    
});


router.post('/api/stripe/cancel-subscription', auth, async (req, res) => {
    try {
        let user = req.user

        await stripe.subscriptions.update(user.stripeData.id, {cancel_at_period_end: true})
        user.stripeData.cancelAtPeriodEnd = true
        await user.save()
        res.send(user)
    } catch (error) {
        res.status(500).send({error: "Error in api/stripe/cancel-subscription: " + error})
    }
})

router.post('/api/stripe/order-complete', auth, async (req, res) => {
    try {
        const subscription = req.body.subscription
        const user = req.user

        user.stripeData.customer = subscription.customer
        user.stripeData.id = subscription.id
        user.stripeData.startDate = subscription.start_date
        user.stripeData.endDate = subscription.current_period_end
        user.stripeData.status = subscription.status
        user.stripeData.cancelAtPeriodEnd = subscription.cancel_at_period_end
        user.stripeData.plan.id = subscription.plan.id
        user.stripeData.plan.product = subscription.plan.product
        user.stripeData.plan.nickname = subscription.plan.nickname
        user.stripeData.plan.amount = subscription.plan.amount
        user.stripeData.billingCycleAnchor = subscription.billing_cycle_anchor
        await user.save()
        if(user.stripeData.status === 'active'){
            return res.send({success: true})
        }
        return res.send({success: false})
    } catch (error) {
        res.status(500).send({error: "Error in api/stripe/order-complete: " + error})
    }
})

router.get('/api/stripe/customer', auth, async(req, res) => {
    try {
        let customer = await stripe.customers.retrieve(`${req.user.stripeData.customer}`)
        let customerBillingHistory = await stripe.invoices.list({customer: `${req.user.stripeData.customer}`})
        // console.log(customerBillingHistory)
        res.send({customer, customerBillingHistory})
    } catch (error) {
        res.status(500).send({error: "Error in api/stripe/customer/id: " + error})
    }
})

router.post('/api/stripe', auth, async (req, res) => {
    try {
        const customer = await stripe.customers.create({
            // name: `${req.user.fName} ${req.user.lName}`,
            name: "Trevor",
            // payment_method: req.body.paymentMethod,
        })
        console.log(customer)
        const setupIntent = await stripe.setupIntents.create({
            customer: customer.id
        })
        const paymentMethods = await stripe.paymentMethods.list({
            customer: customer.id,
            type: 'card'
        })
        console.log(paymentMethods.data)
        // const paymentIntent = await stripe.paymentIntents.create({
        //     amount: products[2].price,
        //     currency: 'usd',
        //     customer: customer.id,
        //     payment_method: paymentMethods.data[0].type,
        //     off_session: true,
        //     confirm: true
        //   });
          res.send({
                succeeded: true,
                clientSecret: setupIntent.client_secret,
                publicKey: process.env.TEST_STRIPE_PUBLIC
            })
    } catch (err) {
        // Error code will be authentication_required if authentication is needed
        // console.log('Error code is: ', err.code);
        // const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(err.raw.payment_intent.id);
        // console.log('PI retrieved: ', paymentIntentRetrieved.id);
        res.status(500).send({error: "Error in Stripe Payments API: " + err})

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


// thank you so much to the universe!! This is such a cool keyboard! I cherish you so much! 

// Wahhooooo, lbootooos this is feeling so nice!
//are you seeing this rtight now  are you seeing this right nowyou are the sexiest man alive and i love everything about you!!!!
