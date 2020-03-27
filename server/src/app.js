require('./db/mongoose')
const express = require('express');
const app = express();
// IMPORT ROUTERS ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
const userRouter = require('./routers/user')
const gameRouter = require('./routers/game')
const arenaRouter = require('./routers/arena')
const arbiterScheduleRouter = require('./routers/arbiter/schedule')
const arbiterProfileRouter = require('../src/routers/arbiter/profile')
const horizonScheduleRouter = require('../src/routers/horizon/schedule')
const arbiterPaymentsRouter = require('../src/routers/arbiter/payments')
const arbiterBlocksRouter = require('../src/routers/arbiter/blocks')
const arbiterSyncRouter = require('../src/routers/arbiter/sync')
//  ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
app.use(express.json())
//USE ROUTERS HERE ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
app.use(userRouter)
app.use(gameRouter)
app.use(arenaRouter)
app.use(arbiterScheduleRouter)
app.use(arbiterProfileRouter)
app.use(horizonScheduleRouter)
app.use(arbiterPaymentsRouter)
app.use(arbiterBlocksRouter)
app.use(arbiterSyncRouter)
//   ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

module.exports = app