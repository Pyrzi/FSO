const http = require('http')
const express = require('express')
const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')


const cors = require('cors')
const mongoose = require('mongoose')



/*const mongoUrl = `mongodb+srv://fullstack:fullstack10@cluster0.i3g7oxf.mongodb.net/BlogApp?
?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(mongoUrl)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    }
})

const Blog = mongoose.model('Blog', blogSchema)
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})


// TEST RUN
/*const blog = new Blog({
    title: "Harry Potter",
    author: "JK",
    url: ".com",
    likes: 0
})

blog.save().then(() => {
    console.log(`added`)
    mongoose.connection.close()
})
*/

//const PORT = 3003
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})