describe('Blog ', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }

    cy.request('POST', 'http://localhost:3003/api/users/', user) 
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Login to application')
    cy.contains('username')
    cy.contains('password')
    cy.get('#login-form')
    cy.get('#username')
    cy.get('#password')
    cy.get('#login-button')
  })
  describe('Login', function(){
    it('user can log in', function() {
      cy.visit('')
      cy.contains('Login')

      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('wrong credentials cannot log in', function() {
      cy.visit('')
      cy.contains('Login')

      cy.get('#username').type('mluukkai')
      cy.get('#password').type('password')
      cy.get('#login-button').click()
      cy.get('.error').should('contain', 'wrong credentials')
      cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
      cy.contains('Matti Luukkainen logged in').should('not.exist')
    })
  })
  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('cypress book')
      cy.get('#author').type('cypress man')
      cy.get('#url').type('cypress.fi')

      cy.contains('create').click()
      cy.get('html').should('contain', 'A new blog cypress book by cypress man added')
      cy.get('html').should('contain', 'cypress book cypress man')
    })

    it('A blog can be liked', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('cypress book')
      cy.get('#author').type('cypress man')
      cy.get('#url').type('cypress.fi')

      cy.contains('create').click()
      cy.get('html').should('contain', 'A new blog cypress book by cypress man added')
      cy.get('html').should('contain', 'cypress book cypress man')
      cy.contains('show').click()
      cy.contains('like').click()
      cy.get('html').should('contain', 'Liked cypress book by cypress man')
      cy.get('html').should('contain', 'likes 1')
    })

    it('A blog can be removed', function() {
      cy.createBlog({title: 'test blog',
      author: 'test author',
      url: 'test.com'})

      cy.contains('show').click()
      cy.contains('remove').click()
      cy.get('html').should('contain', 'Blog test blog by test author removed')
    })
    it('Option to remove blog is only showed to the creator', function() {

      const user2 = {
        name: 'Lutti Maakkainen',
        username: 'lmaakkai',
        password: 'julkinen'
      }
  
      cy.request('POST', 'http://localhost:3003/api/users/', user2) 
      cy.visit('http://localhost:3000')


      cy.createBlog({title: 'test blog',
      author: 'test author',
      url: 'test.com'})
      
      cy.contains('show').click()
      cy.contains('remove')
      cy.contains('logout').click()

      cy.login({ username: 'lmaakkai', password: 'julkinen' })
      cy.contains('show').click()
      cy.contains('remove').should('not.exist')
    })
    it('Blogs are sorted by likes', function() {
      cy.createBlog({title: 'first blog',
      author: 'test author',
      url: 'test.com',
      likes: 2})
      cy.createBlog({title: 'second blog',
      author: 'test author',
      url: 'test.com',
      likes: 1})
      cy.createBlog({title: 'third blog',
      author: 'test author',
      url: 'test.com',
      likes: 0})

      cy.get('.blog').eq(0).should('contain', 'first blog')
      cy.get('.blog').eq(1).should('contain', 'second blog')
      cy.contains("second blog").parent().find("button").click()
      cy.get("#like-button").click().wait(300)
      

      cy.get('.blog').eq(1).should('contain', 'second blog')
      cy.get('.blog').eq(0).should('contain', 'first blog')
      cy.get("#like-button").click().wait(300)
      cy.contains('hide').click()

      cy.get('.blog').eq(0).should('contain', 'second blog')
      cy.get('.blog').eq(1).should('contain', 'first blog')

      cy.contains("first blog").parent().find("button").click()
      cy.get("#like-button").click().wait(300).click().wait(300)
      cy.get('.blog').eq(0).should('contain', 'first blog')
      cy.get('.blog').eq(1).should('contain', 'second blog')
      cy.contains('hide').click()

      cy.contains("third blog").parent().find("button").click()
      cy.get("#like-button").click().wait(300).click().wait(300)
      cy.get("#like-button").click().wait(300).click().wait(300)
      cy.get("#like-button").click().wait(300).click().wait(300)
      cy.get('.blog').eq(0).should('contain', 'third blog')
      cy.get('.blog').eq(1).should('contain', 'first blog')
      cy.get('.blog').eq(2).should('contain', 'second blog')


    })
  })
})