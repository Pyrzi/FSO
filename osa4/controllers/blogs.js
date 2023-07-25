const config = require("../utils/config")
const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const middleware = require("../utils/middleware")
const Blog = require('../models/blog')
const User = require('../models/user')


/*blogsRouter.get('/', (req, res) => {
    Blog
    .find({})
    .then(blogs => {
      res.json(blogs)
    })
  })*/

blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
    response.json(blogs)
    
})

blogsRouter.get("/:id", async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog.toJSON())
    } else {
        response.status(404).end()
    }
  })

blogsRouter.post('/', async(request, response) => {
    const body = request.body
    const user = request.user
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!(token && decodedToken.id)) {
        return response.status(401).json({ error: 'token invalid or missing' })
    }

    const blog = await new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id,
      }).populate("user", { username: 1, name: 1 })
    
      const savedBlog = await blog.save();

      user.blogs = user.blogs.concat(savedBlog._id);
      await user.save();
    
      response.status(201).json(savedBlog.toJSON())
    })


blogsRouter.delete('/:id', async (request, response) => {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        const user = request.user
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' })
        }

      const blogId = request.params.id
      const blog = await Blog.findById(blogId)

      if (!blog) {
        return response.status(404).json({ error: 'Blog not found' })
      }
      if ( blog.user.toString() === user.id.toString() ) {
      const deletedBlog = await Blog.findByIdAndRemove(blogId)
            if (deletedBlog) {
                response.status(204).end()
            } else {
                response.status(404).json({ error: 'Blog not found' })
            }
      }

  })

blogsRouter.put('/:id', async(request, response) => {
const blog = request.body
const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
.populate("user", { username: 1, name: 1 })

if (updatedBlog) {
    response.status(200).json(updatedBlog)
  } else {
    response.status(404).json({ error: 'Blog not found' }).end()
  }
})

module.exports = blogsRouter