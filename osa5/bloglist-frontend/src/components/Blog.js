import { useState } from 'react'
const Blog = ({ blog, username, addLike, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => {
    setVisible(!visible)
  }
  const handleRemove = (event) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      removeBlog(blog.id)
    }
  }
  const handleLike = (event) => {
    const blogUpdate = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    }
    addLike(blog.id, blogUpdate)
  }

  return (
    <div className='blog' style={blogStyle}>
      <div> 
        {blog.title} {blog.author} 
        <button id = "show" onClick={toggleVisibility}>
          {visible ? "hide" : "show"}
        </button>
        </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>likes {blog.likes} <button id="like-button" onClick={handleLike}>
              like
            </button></div>
          <div>{blog.user.name}</div>
          {blog.user.name === username && (
            <button onClick={handleRemove}>
              remove
            </button>
          )}
        </div>
        )}

  </div>
)}

export default Blog