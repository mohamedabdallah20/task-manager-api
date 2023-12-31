const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const {setUpDataBase,userOne,userOneId}  =require('./fixtures/db')


beforeEach(setUpDataBase)

afterEach(async () => {
    // Clean up the user created in beforeEach
    await User.deleteMany();
})

test('should signup new user', async () => {
    const res = await request(app)
        .post('/users').send({
            name: "hammo",
            email: "mohammed.a.elsaied2@gmail.com",
            password: "123456",
        })
        .expect(201)

    const user = User.findById(res.body._id)
    expect(user).not.toBeNull()

    expect(res.body).toMatchObject({
        user: {
            name: "hammo",
            email: "mohammed.a.elsaied2@gmail.com",
        }
    })
    expect(res.body.user.password).toBe(undefined)
})

test('should login', async () => {
    const res = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password,
        })
        .expect(200)
    const userDB = await User.findById(userOneId)
    expect(res.body.token).toBe(userDB.tokens[1].token)
})

test('should NOT login', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: "wrongpassword",
        })
        .expect(400)
})

test('should get profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('should NOT get profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${jwt.sign({ _id: new mongoose.Types.ObjectId }, 'wrongSecret')}`)
        .send()
        .expect(401)
})
test('should NOT get profile', async () => {
    const res = await request(app)
        .get('/users/me')
        // .set('Authorization', `Bearer ${jwt.sign({ _id: new mongoose.Types.ObjectId }, 'wrongSecret')}`)
        .send()
        .expect(401)

})

test('should delete profile', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('should NOT delete profile', async () => {
    await request(app)
        .delete('/users/me')
        // .set('Authorization', `Bearer ${jwt.sign({ _id: new mongoose.Types.ObjectId }, 'wrongSecret')}`)
        .send()
        .expect(401)
})

test('should upload avatar', async () => {
    const res = await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/IMG_5547.jpeg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))

})

test('should update user name', async () => {
    const res = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ name: "test" })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toBe('test')

})

test('should NOT update, invalid user prop', async () => {
    const res = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ location: "test" })
        .expect(400)

})


// TODO -Should not signup user with invalid name/email/password
// TODO -Should not update user if unauthenticated
// TODO -Should not update user with invalid name/email/password
// TODO -Should not delete user if unauthenticated




