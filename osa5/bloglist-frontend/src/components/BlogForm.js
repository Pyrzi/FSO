import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" })
  
  const handleInputChange = (event) => {
    const {name, value} = event.target
    setNewBlog({ ...newBlog, [name]: value })
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog(newBlog.title, newBlog.author, newBlog.url)
    setNewBlog({ title: "", author: "", url: "" })
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
          <div>
            title:
              <input
              id="title"
              type="text"
              value={newBlog.title}
              name="title"
              onChange={handleInputChange}
            />
          </div>
          <div>
            author:
              <input
              id="author"
              type="text"
              value={newBlog.author}
              name="author"
              onChange={handleInputChange}
            />
          </div>
          <div>
            url:
              <input
              id="url"
              type="text"
              value={newBlog.url}
              name="url"
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">create</button>
        </form>
    </div>
  )
}

export default BlogForm