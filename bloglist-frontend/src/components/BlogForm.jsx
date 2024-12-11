import { useState } from 'react'

const BlogForm = ({
  title,
  author,
  url,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  handleSubmit
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
          Title
        <input
          type="text"
          data-testid='title'
          value={title}
          onChange={handleTitleChange}
          placeholder="Title"
        />
      </div>
      <div>
          Author
        <input
          type="text"
          data-testid='author'
          value={author}
          onChange={handleAuthorChange}
          placeholder="Author"
        />
      </div>
      <div>
          Url
        <input
          type="text"
          data-testid='url'
          value={url}
          onChange={handleUrlChange}
          placeholder="Url"
        />
      </div>
      <button type="submit">Save</button>
    </form>
  )
}

export default BlogForm