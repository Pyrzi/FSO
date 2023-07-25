const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const User = require('../models/user')
const helper = require('./test_helper')


describe('Adding blogs', () => {
    let token = null
    beforeAll(async () => {
      await User.deleteMany({})
      const passwordHash = await bcrypt.hash("salainen", 10)
      const user = await new User({ username: "name", passwordHash }).save()
      const userForToken = { username: "name", id: user.id }
      return (token = jwt.sign(userForToken, process.env.SECRET))
    })
test('a valid blog can be added', async () => {
    const newBlog = {
        _id: "5a422a851b54a676234d17f8",
        title: "Kuinka saada kavereita",
        author: "Mr Lonely",
        url: "www.pitbull.com",
        likes: 5,
        __v: 0
    }
    await api
      .post('/api/blogs')
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length + 1)
  })

  test('no likes assigned returns 0 likes', async () => {
    const newBlog = {
        _id: "5a422a851b54a676234d17f9",
        title: "Greatest hits vol. 1",
        author: "Various artists",
        url: "www.kidzbop.com",
    }
    await api
      .post('/api/blogs')
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    expect(response.body[response.body.length-1].likes).toBe(0)
  })

  test('if title or url is missing, responds with 400', () => {
    const newBlog = {
        _id: "5a422a851b54a676234d17f1",
        author: "Various artists",
        url: "www.kidzbop.com",
    }
    api
      .post('/api/blogs')
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })
  test('adding a new blog fails with 401 Unauthorized without a token', async () => {
    const newBlog = {
      title: "Test Blog",
      author: "Test Author",
      url: "www.testblog.com",
      likes: 5,
    }
  
    const response = await api
    .post('/api/blogs')
    .send(newBlog)
  
    expect(response.status).toBe(401);
  })
  
})

describe('Returning blogs', () => {
    test('returned blogs should have an "id" field instead of "_id"', async () => {
        const response = await api.get('/api/blogs')
      // Check if each blog object in the returned array has an "id" field defined
      response.body.forEach((blog) => {
        expect(blog.id).toBeDefined()
      })
    })
    test('blogs are returned as json', async () => {
        await api
          .get('/api/blogs')
          .expect(200)
          .expect('Content-Type', /application\/json/)
      })
      
      test('all blogs are returned', async () => {
          const response = await api.get('/api/blogs')
          expect(response.body).toHaveLength(initialBlogs.length)
        })
      test('a specific blog is within the returned blogs', async () => {
      const response = await api.get('/api/blogs')
      const author = response.body.map(r => r.author)
      expect(author).toContain(
          "Michael Chan"
      )
      })
  })

describe('Deleting blogs', () => {
    let token = null
    beforeAll(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})
      
        const passwordHash = await bcrypt.hash("salainen", 10)
        const user = await new User({ username: "name", passwordHash }).save()
      
        const userForToken = { username: "name", id: user.id }
        token = jwt.sign(userForToken, process.env.SECRET)
      
        const testBlog = {
          title: "test blog",
          author: "test author",
          url: "www.test.com",
        }
    
        await api
          .post("/api/blogs")
          .set("Authorization", `Bearer ${token}`)
          .send(testBlog)
          .expect(201)
          .expect("Content-Type", /application\/json/)
      
        return token
      })
      
    test('deleting a blog returns 204', async () => {
        let token = null
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash("salainen", 10)
        const user = await new User({ username: "name", passwordHash }).save()
        const userForToken = { username: "name", id: user.id }
        token = jwt.sign(userForToken, process.env.SECRET)
        const newBlog = {
            _id: "5a422a851b54a676234d17f8",
            title: "Kuinka saada kavereita",
            author: "Mr Lonely",
            url: "www.pitbull.com",
            likes: 5,
            __v: 0
        }
        await api
          .post('/api/blogs')
          .set("Authorization", `Bearer ${token}`)
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)

        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[blogsAtStart.length-1]
        
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await Blog.find({}).populate("user")
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
    
        const titles = blogsAtEnd.map((blog) => blog.title)
        expect(titles).not.toContain(blogToDelete.title)
      })
    
      test('deleting returns 404 for non-existent blog', async () => {
        const nonExistentId = '605d3e12452a6808ccdf3abc'
        const response = await api
        .delete(`/api/blogs/${nonExistentId}`)
        .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Blog not found')
      })
      test('deleting returns 400 Bad Request for invalid blog ID', async () => {
        const invalidId = 'invalid-id'
        const response = await api
        .delete(`/api/blogs/${invalidId}`)
        .set("Authorization", `Bearer ${token}`)
        expect(response.status).toBe(400)
      })
    })

describe('Updating blogs', () => {
    test('PUT updates the blog and returns the updated blog', async () => {
        const firstBlog = initialBlogs[0]
        const updatedBlogData = {
            likes: 8,
        }
        const response = await api
          .put(`/api/blogs/${firstBlog._id}`)
          .send(updatedBlogData)
    
        expect(response.status).toBe(200)

        // Check if likes match
        const updatedBlog = await Blog.findById(firstBlog._id)
        expect(updatedBlog.likes).toBe(updatedBlogData.likes)
        expect(updatedBlog.author).toBe(firstBlog.author)
        expect(updatedBlog.id).toBe(firstBlog._id)


    })
    test('PUT returns 404 for non-existent blog', async () => {
        const nonExistentId = '605d3e12452a6808ccdf3abc'
        const updatedBlogData = {
          title: 'Test Blog',
          author: 'Test Author',
          url: 'www.test.com',
          likes: 10,
        }
    
        const response = await api
          .put(`/api/blogs/${nonExistentId}`)
          .send(updatedBlogData)
    
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Blog not found')
      })
    
    test('PUT /api/blogs/:id returns 400 Bad Request for invalid blog ID', async () => {
        
        const invalidId = 'invalid-id'
        const updatedBlogData = {
            title: 'Test Blog',
            author: 'Test Author',
            url: 'www.test.com',
            likes: 10,
        }

        const response = await api
            .put(`/api/blogs/${invalidId}`)
            .send(updatedBlogData)
            
        expect(response.status).toBe(400)
    })
})

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })
  })

const initialBlogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
  ]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
  })


afterAll(async () => {
  await mongoose.connection.close()
})