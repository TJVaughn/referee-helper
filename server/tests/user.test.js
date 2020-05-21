const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/User')
const { user1, user2, game1, game2, game3, game4, setupDB } = require('./fixtures/db')


beforeEach(setupDB)

test('User signup', async () => {
    const response = await request(app).post('/api/user').send({
        name: 'Trevor',
        email: "Vaughnwebdev@gmail.com",
        password: "copycatjumpjack"
    }).expect(201)

    const user = await User.findById(response.body.user._id)

    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            name: 'Trevor',
            email: "vaughnwebdev@gmail.com"
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('copycatjumpjack')
})

test('User login', async () => {
    const response = await request(app).post('/api/user/login')
    .send({email: user1.email, password: user1.password})
    .expect(200)

    const user = await User.findById(user1._id)
    expect(user).not.toBeNull()

    expect(response.body.token).toBe(user.tokens[1].token)

})

test('User login failure', async () => {
    await request(app).post('/api/user/login')
    .send({email: user1.email, password: "thisreallydoesntmatter"})
    .expect(401)
})

test('Attempt to get user profile unauthorized', async () => {
    await request(app).get('/api/user/me')
    .send()
    .expect(401)
})


test("Get user profile", async () => {
    await request(app).get('/api/user/me')
    .set('Cookie', `AuthToken=${user1.tokens[0].token}`)
    // .set("Authorization", `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)
})
test("Get user profile with wrong token", async () => {
    await request(app).get('/api/user/me')
    .set('Cookie', `AuthToken=${user1.tokens[0].token}f`)
    .send()
    .expect(401)
})