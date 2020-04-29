require('./db/mongoose')
const express = require('express');
const app = express();
// IMPORT ROUTERS ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
const userRouter = require('./routers/user')
const gameRouter = require('./routers/game')
const arenaRouter = require('./routers/arena')

const stripePaymentsRouter = require('./routers/stripe')

const arbiterScheduleRouter = require('./routers/arbiter/schedule')
const arbiterProfileRouter = require('../src/routers/arbiter/profile')
const arbiterPaymentsRouter = require('../src/routers/arbiter/payments')
const arbiterBlocksRouter = require('../src/routers/arbiter/blocks')
const arbiterSyncRouter = require('../src/routers/arbiter/sync')

const horizonSyncRouter = require('../src/routers/horizon/sync')
const horizonScheduleRouter = require('../src/routers/horizon/schedule')
const horizonBlocksRouter = require('../src/routers/horizon/blocks')
//  ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
// app.use(express.json())
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
//USE ROUTERS HERE ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
app.use(userRouter)
app.use(gameRouter)
app.use(arenaRouter)

app.use(stripePaymentsRouter)

app.use(arbiterScheduleRouter)
app.use(arbiterProfileRouter)
app.use(arbiterPaymentsRouter)
app.use(arbiterBlocksRouter)
app.use(arbiterSyncRouter)

app.use(horizonScheduleRouter)
app.use(horizonSyncRouter)
app.use(horizonBlocksRouter)
//   ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

module.exports = app