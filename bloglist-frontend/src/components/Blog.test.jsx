import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { vi } from 'vitest'

test('renders title and author only', () => {
  const blog = {
    title: 'How to sell staplers',
    author: 'Michael Scott',
    url: 'http://staplers.com',
    likes: 5,
    user: {
      name: 'Michael Scott',
      id: '12345'
    }
  }

  const currentUser = {
    id: '12345',
    name: 'Michael Scott'
  }

  render(<Blog blog={blog} currentUser={currentUser} />)

  const titleAuthorElement = screen.getByText('How to sell staplers - Michael Scott')
  expect(titleAuthorElement).toBeDefined()

  const urlElement = screen.queryByText('Url: http://staplers.com')
  expect(urlElement).toBeNull()

  const likesElement = screen.queryByText('Likes: 5')
  expect(likesElement).toBeNull()
})

test('renders url and likes when view button is clicked', async () => {
    const blog = {
      title: 'How to sell staplers',
      author: 'Michael Scott',
      url: 'http://staplers.com',
      likes: 5,
      user: {
        name: 'Michael Scott',
        id: '12345'
      }
    }
  
    const currentUser = {
      id: '12345',
      name: 'Michael Scott'
    }
  
    render(<Blog blog={blog} currentUser={currentUser} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
  
    const urlElement = screen.getByText('Url: http://staplers.com')
    expect(urlElement).toBeDefined()
  
    const likesElement = screen.getByText('Likes: 5')
    expect(likesElement).toBeDefined()
  })

test('calls event handler twice when like button is clicked twice', async () => {
    const blog = {
      title: 'How to sell staplers',
      author: 'Michael Scott',
      url: 'http://staplers.com',
      likes: 5,
      user: {
        name: 'Michael Scott',
        id: '12345'
      }
    }
  
    const currentUser = {
      id: '12345',
      name: 'Michael Scott'
    }
  
    const handleLike = vi.fn()
  
    render(<Blog blog={blog} currentUser={currentUser} handleLike={handleLike} />)
  
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
  
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
  
    expect(handleLike).toHaveBeenCalledTimes(2)
  })