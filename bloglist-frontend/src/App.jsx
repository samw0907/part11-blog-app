import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [blogs, setBlogs] = useState([])
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      blogService.getAll().then(blogs => {
        blogs.sort((a, b) => b.likes - a.likes)
        setBlogs(blogs)
      })
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      console.log(user)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      const blogs = await blogService.getAll()
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
      setSuccessMessage('Successfully logged in')
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
    setBlogs([])
  }

  const addBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = {
        title: newBlogTitle,
        author: newBlogAuthor,
        url: newBlogUrl
      }
      const createdBlog = await blogService.create(newBlog)
      blogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(createdBlog).sort((a, b) => b.likes - a.likes))
      setNewBlogTitle('')
      setNewBlogAuthor('')
      setNewBlogUrl('')
      setSuccessMessage(`A new blog "${newBlogTitle}" by ${newBlogAuthor} added`)
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (exception) {
      setErrorMessage('Failed to create blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }


  const blogFormRef = useRef()

  const blogForm = () => {
    return (
      <div>
        <Togglable buttonLabel='create new' ref={blogFormRef}>
          <BlogForm
            title={newBlogTitle}
            author={newBlogAuthor}
            url={newBlogUrl}
            handleTitleChange={({ target }) => setNewBlogTitle(target.value)}
            handleAuthorChange={({ target }) => setNewBlogAuthor(target.value)}
            handleUrlChange={({ target }) => setNewBlogUrl(target.value)}
            handleSubmit={addBlog}
          />
        </Togglable>
      </div>
    )
  }

  const handleLike = async (id) => {
    const blogToLike = blogs.find(blog => blog.id === id)
    const updatedBlog = {
      ...blogToLike,
      likes: blogToLike.likes + 1
    }
    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog).sort((a, b) => b.likes - a.likes))
      setSuccessMessage(`You liked "${returnedBlog.title}" by ${returnedBlog.author}`)
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (exception) {
      setErrorMessage('Failed to update likes')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this blog?')
    if (!confirmed) {
      return
    }
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      setSuccessMessage('Blog deleted successfully')
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (exception) {
      setErrorMessage('Failed to delete blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }
  
  return (
    <div>
      <h1>Blog App</h1>
      {user === null && (
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
          errorMessage={errorMessage}
          successMessage={successMessage}
        />
      )}
      {user !== null && (
        <div>
          <h2>blogs</h2>
          <Notification message={errorMessage} type="error"/>
          <Notification message={successMessage} type="success"/>
          <p>{user.name} is logged in <button type="button" onClick={handleLogout}>logout</button></p>
          {blogForm()}
          {blogs.map(blog => (
            <Blog key={blog.id} blog={blog} handleLike={() => handleLike(blog.id)} handleDelete={() => handleDelete(blog.id)} currentUser={user}/>
          ))}
        </div>
      )}
    </div>
  )
}
export default App