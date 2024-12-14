const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

blogsRouter.use(tokenExtractor)
blogsRouter.use(userExtractor)

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog
      .find({}).populate('user', { username: 1, name: 1 })
      // eslint-disable-next-line no-console
    console.log(`Fetched ${blogs.length} blogs`)
    response.json(blogs)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    response.status(500).json({ error: 'something went wrong' })
  }
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
    if (blog) {
      // eslint-disable-next-line no-console
      console.log(`Found blog with id: ${blog.id}`)
      response.json(blog)
    } else {
      // eslint-disable-next-line no-console
      console.log(`Blog with id ${request.params.id} not found`)
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', tokenExtractor, userExtractor, async (request, response, next) => {
  const body = request.body

  // eslint-disable-next-line no-console
  console.log('Received blog body:', body)

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'Title and URL are required' })
  }

  const user = request.user
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  })

  try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    // eslint-disable-next-line no-console
    console.log(`Blog created with title: ${savedBlog.title}`)
    response.status(201).json(savedBlog)
  } catch (error) {
    console.error('Error saving blog:', error)
    next(error)
  }
})

blogsRouter.delete('/:id', tokenExtractor, userExtractor, async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() !== request.user.id.toString()) {
      // eslint-disable-next-line no-console
      console.log(`User ${request.user.username} tried to delete blog not created by them`)
      return response.status(403).json({ error: 'only the creator can delete the blog' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    // eslint-disable-next-line no-console
    console.log(`Blog with id ${request.params.id} deleted`)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  try {
    // eslint-disable-next-line no-console
    console.log(`Attempting to update blog with id: ${request.params.id}`)
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      // eslint-disable-next-line no-console
      console.log(`Blog with id ${request.params.id} not found`)
      return response.status(404).json({ error: 'Blog not found' })
    }

    blog.likes = updatedBlog.likes
    blog.title = updatedBlog.title
    blog.author = updatedBlog.author
    blog.url = updatedBlog.url
    await blog.save()

    // eslint-disable-next-line no-console
    console.log(`Blog with id ${request.params.id} updated`)
    response.json(blog.toJSON())
  } catch (error) {
    console.error('Error updating blog:', error)
    next(error)
  }
})

module.exports = blogsRouter
