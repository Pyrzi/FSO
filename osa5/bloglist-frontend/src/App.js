import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import BlogForm from "./components/BlogForm"
import loginService from './services/login'
import Notification from "./components/Notification"
import Togglable from "./components/Togglable"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    console.log("starting")
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('wrong credentials')
    }
  }
  const handleLogout = async (event) => {
    window.localStorage.clear()
    setUser(null)
  }

  const createBlog = async (title, author, url) => {
    try {
      blogFormRef.current.toggleVisibility()
      const blog = await blogService.create({
        title,
        author,
        url,
      })
      setBlogs(blogs.concat(blog));
      setMessage(`A new blog ${title} by ${author} added`)
    } catch (error) {
      setMessage("error" + error.response.data.error)
    }
  }
  const blogFormRef = useRef()

  const removeBlog = async (blogId) => {
    try {
      const blogToRemove = blogs.find((blog) => blog.id === blogId)
      await blogService.remove(blogId)
      console.log(blogs.blogId)
      const updatedBlogs = blogs.filter((blog) => blog.id !== blogId);
      setBlogs(updatedBlogs);
      setMessage(`Blog ${blogToRemove.title} by ${blogToRemove.author} removed`)
    } catch (error) {
      setMessage("error" + error.response.data.error)
    }
  }

  const addLike = async (id, blogUpdate) => {
  try {
    const updatedBlog = await blogService.update(id, blogUpdate)
    const newBlogs = blogs.map((blog) =>
        blog.id === id ? updatedBlog : blog
      )
      setBlogs(newBlogs)
      setMessage(`Liked ${updatedBlog.title} by ${updatedBlog.author}`)
  } catch (error) {
    setMessage("error" + error.response.data.error);
  }
};

  if (user === null) {
    return (
      <div>
        <h2>Login to application</h2>
        <Notification message={message} setMessage={setMessage} />
        <form id='login-form' onSubmit={handleLogin}>
          <div>
            username:
              <input
              id="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password:
              <input
              id="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id="login-button" type="submit">login</button>
        </form>
        </div>
      )}

      
      return (
        <div>
          <h2>blogs</h2>
          <Notification message={message} setMessage={setMessage} />
          {user.name} logged in
          <button id="logout" onClick={handleLogout}>
              logout
            </button>
          <br/>
          <br/>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm createBlog={createBlog} />
          </Togglable>
          {blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog =>
            <Blog key={blog.id} blog={blog} username={user.name} addLike={addLike} removeBlog={removeBlog} />
          )}
        </div>
      )

}

export default App