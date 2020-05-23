const request = require('supertest')
const app = require('../src/app')
const Game = require('../src/models/Game')
const { user1, user2, game1, game2, game3, game4, setupDB } = require('./fixtures/db')

beforeEach(setupDB)

test('Should start a new get schedule job', async () => {
    const response = await request(app).get('/api/arbiter/schedule')
    .set('Cookie', `AuthToken=${user1.tokens[0].token}`)
    .send()
    .expect(200)
    expect(response.body.message).toBe('processing')
})

test('Should create new game', async () => {
    const response = await request(app).post('/api/game')
    .set('Cookie', `AuthToken=${user1.tokens[0].token}`)
    .send({
        dateTime: "4/15/20 12:45:00 PM",
        location: "Stamford Twin Rinks",
        fees: 5000
    })
    .expect(201)

    const game = await Game.findById(response.body._id)
    expect(game).not.toBeNull()
})

test('should return single game by id', async () => {
    const response = await request(app).get(`/api/game/${game1._id}`)
    .set('Cookie', `AuthToken=${user1.tokens[0].token}`)
    .send()
    .expect(200)
    const game = await Game.findById(response.body._id)
    expect(game).not.toBeNull()
})

test('should not be allowed to view game', async () => {
    await request(app).get(`/api/game/${game3._id}`)
    .set('Cookie', `AuthToken=${user1.tokens[0].token}`)
    .send()
    .expect(404)
})