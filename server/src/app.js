require('./db/mongoose')
const express = require('express');
const app = express();

const userRouter = require('./routers/user')
const eventRouter = require('./routers/event')
const stripePaymentsRouter = require('./routers/stripe')

const arbiterRouter = require('./routers/arbiterRoutes')
const horizonRouter = require('./routers/horizonRoutes')

app.use(express.json())

app.use(userRouter)
app.use(eventRouter)

app.use(stripePaymentsRouter)

app.use(arbiterRouter)
app.use(horizonRouter)


module.exports = app