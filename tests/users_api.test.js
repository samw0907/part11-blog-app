const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const assert = require('node:assert')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const helper = require('./test_helper')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  let token

  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()

    const userForToken = { username: 'root', id: user._id }
    token = jwt.sign(userForToken, process.env.SECRET)
  })

  test('creation succeeds with a new username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    // eslint-disable-next-line no-console
    console.log('Error message:', result.body.error)

    assert(result.body.error.includes('expected `username` to be unique'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if username is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'oh',
      name: 'name test',
      password: 'passowrdtest',
    }

    const result = await api
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    // eslint-disable-next-line no-console
    console.log('Error message:', result.body.error)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('is shorter than the minimum allowed length'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if password is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'validusername',
      name: 'Valid User',
      password: 'pw',
    }

    const result = await api
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    // eslint-disable-next-line no-console
    console.log('Error message:', result.body.error)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('password must be at least 3 characters long'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

afterAll(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})
