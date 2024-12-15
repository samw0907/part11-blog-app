const mongoose = require('mongoose')
const assert = require('node:assert')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const userPromises = helper.initialUsers.map(async userData => {
    const passwordHash = await bcrypt.hash(userData.password, 10)
    const user = new User({ username: userData.username, passwordHash })
    await user.save()
  })
  await Promise.all(userPromises)

  const user = await User.findOne({ username: 'mscott' })
  const userForToken = {
    username: user.username,
    id: user._id,
  }

  token = jwt.sign(userForToken, process.env.SECRET)

  const blogObjects = helper.initialBlogs.map(blog => new Blog({ ...blog, user: user._id }))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are ten blogs', async () => {
  const response = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`)
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('the first blog is Battlestar Galactica fanfic', async () => {
  const response = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`)
  const titles = response.body.map(e => e.title)
  assert(titles.includes('Battlestar Galactica fanfic'))
})

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`)
  response.body.forEach(blog => {
    assert(blog.id !== undefined)
    assert(blog._id === undefined)
  })
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const titles = blogsAtEnd.map(r => r.title)

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  assert(titles.includes('Test Blog'))
})

test('missing likes property defaults to 0', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testurl.com'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const createdBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)

  assert.strictEqual(createdBlog.likes, 0)
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
})

test('blogs without title should return 400 Bad Request', async () => {
  const newBlog = {
    author: 'Test Person',
    url: 'http://test.com',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('blogs without url should return 400 Bad Request', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Person',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

  const titles = blogsAtEnd.map(r => r.title)
  assert(!titles.includes(blogToDelete.title))
})

test('likes can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedBlogData = { likes: blogToUpdate.likes + 10 }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatedBlogData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const updatedBlog = response.body
  assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 10)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlogInDb = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
  assert.strictEqual(updatedBlogInDb.likes, blogToUpdate.likes + 10)
})

test('adding a blog fails if token is not provided', async () => {
  const newBlog = {
    title: 'Unauthorized Blog',
    author: 'No Token Author',
    url: 'http://notoken.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

afterAll(async () => {
  await mongoose.connection.close()
})
