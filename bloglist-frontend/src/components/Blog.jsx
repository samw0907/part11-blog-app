import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, currentUser }) => {

  const [detailsVisible, setDetailsVisible] = useState(false)

//  console.log(currentUser)
//  console.log(currentUser.id)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div className='blog' style={blogStyle}>
      <div className='blog-title-author'>
        {blog.title} - {blog.author}
        <button type="button" onClick={() => setDetailsVisible(!detailsVisible)}>
          {detailsVisible ? 'hide' : 'view'}
        </button>
      </div>
      {detailsVisible && (
        <div className='blog-details'>
          <div>Url: {blog.url}</div>
          <div>Likes: {blog.likes} <button type="button" onClick={handleLike}>like</button></div>
          <div>User: {blog.user ? blog.user.name : 'unknown'}</div>
          {blog.user && blog.user.id === currentUser.id && (
            <button type="button" onClick={handleDelete}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog