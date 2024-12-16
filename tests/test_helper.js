const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Battlestar Galactica fanfic',
    author: 'Dwight Shrute',
    url: 'http://BGfanfic.com',
    likes: 1009,
  },
  {
    title: 'How to sell staplers',
    author: 'Michael Scott',
    url: 'http://michaelscottboss.com',
    likes: 2588896,
  },
  {
    title: 'Self defense for experts',
    author: 'Dwight Shrute',
    url: 'http://ShruteDojo.com',
    likes: 2,
  },
  {
    title: 'The joy of Meatballs',
    author: 'Stanley Hudson',
    url: 'https://scrantonfoodcritic.com',
    likes: 15,
  },
  {
    title: 'My journey in Costa Rica',
    author: 'Toby Flenderson',
    url: 'https://blogs.com',
    likes: 3,
  },
  {
    title: 'Woof!',
    author: 'Ryan Howard',
    url: 'https://cuttingedge.com',
    likes: 2,
  },
  {
    title: 'Psychology for Leaders',
    author: 'Robert California',
    url: 'https://blogs.com',
    likes: 2,
  },
  {
    title: 'Cornell Acapella Legends',
    author: 'Andy Bernard',
    url: 'https://cornellblogs.com',
    likes: 2,
  },
  {
    title: 'Wall mounted plasma tv reviews',
    author: 'Michael Scott',
    url: 'http://michaelscottboss.com',
    likes: 0,
  },
  {
    title: 'How to not deal with bad employees',
    author: 'Jan Levinson Gould',
    url: 'buymycandles.com',
    likes: 1,
  },
]

const initialUsers = [
  {
    username: 'dshrute',
    name: 'Dwight Shrute',
    password: 'battlestargalactica',
    blogs: ['667d68f9fc54938ed3a2e1bd'],
  },
  {
    username: 'jhalpert',
    name: 'Jim Halpert',
    password: 'mustkilldwight',
    blogs: [],
  },
  {
    username: 'mscott',
    name: 'Michael Scott',
    password: 'dundermiflin',
    blogs: [
      '667e72af02945ce2e8609acf',
      '66813316f0d4edecce485837',
      '66814d503c1d17c242804dfe',
      '66814e2cfb766faf837b6ac1',
      '6694dc1284535fc630086f96',
      '66961fd0351b3b20bd7b48c1',
      '6696201a351b3b20bd7b48c7',
      '6696204d351b3b20bd7b48cd',
      '669620b6351b3b20bd7b48d3',
      '66964c2f351b3b20bd7b48fb',
      '6698b49e55ae15468d6e3cf6',
      '6698b7940ba697a8d19d83db',
      '6698b7e50ba697a8d19d83e5',
      '6698ba1cbe5eacf56bec78e7',
      '6724c9e9bb6d0643f53cda85',
      '67321cc1ff0be202e99e7484',
      '675865d9b6efe3d33699d9bf',
      '675af23e7b9a4118fc9d6fcb'
    ],
  }
]

const nonExistingId = async () => {
  const blog = new Blog({  title: 'example', author: 'unknown', url: 'http://example.com', likes: 0 })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb, initialUsers,
}