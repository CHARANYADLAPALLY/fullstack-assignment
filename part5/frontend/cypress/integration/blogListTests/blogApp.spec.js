describe('checking that the application displays the login form by default.', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset');
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: '12345'
    };
    cy.request('POST', 'http://localhost:3001/api/users/', user);
    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function () {
    cy.contains('log in to the application');
    cy.get('#login-form');
    cy.get('#username');
    cy.get('#password');
    cy.get('#login-button');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('mluukkai');
      cy.get('#password').type('12345');
      cy.get('#login-button').click();
      cy.contains('Matti Luukkainen logged in');
    });

    it('fails with wrong credentials', function () {
      cy.get('#username').type('mluukkai');
      cy.get('#password').type('1234');
      cy.get('#login-button').click();
      cy.get('.error')
        .should('contain', 'wrong username or password')
        .should('have.css', 'background-color', 'rgb(255, 210, 210)');
    });
  });

  describe('When logged in', function () {
    beforeEach(function () {
      cy.get('#username').type('mluukkai');
      cy.get('#password').type('12345');
      cy.get('#login-button').click();
    });

    it('A blog can be created', function () {
      cy.contains('Create new blog').click();
      cy.get('#title').type('Cool Post 2');
      cy.get('#author').type('Peter Lustig');
      cy.get('#url').type('https://test.com');
      cy.get('#create-blog-button').click();
      cy.get('#blogs > *').should('have.length', 1);
      cy.contains('Cool Post 2');
      cy.contains('Peter Lustig');
    });

    it('checks that user can like a blog', function () {
      cy.contains('Create new blog').click();
      cy.get('#title').type('Cool Post 2');
      cy.get('#author').type('Peter Lustig');
      cy.get('#url').type('https://test.com');
      cy.get('#create-blog-button').click();
      cy.get('.toggle-button').click();
      cy.contains('likes 0');
      cy.get('.like-button').click();
      cy.contains('likes 1');
    });
  });

  describe('test with user id from local stroge', function () {
    beforeEach(function () {
      const user = {
        username: 'plustig',
        password: '12345',
        name: 'Peter Lustig'
      };
      cy.createUser(user);
      cy.login(user);

      const blog = {
        title: 'Cool Post 3',
        author: 'Peter Lustig',
        url: 'https://test.com',
        likes: 10,
      };
      cy.createBlogPost(blog);
    });

    it('user can delete own post', function () {
      cy.get('#blogs > *').should('have.length', 1);
      cy.get('.toggle-button').click();
      cy.get('#remove-button').click();
      cy.get('#blogs > *').should('have.length', 0);
    });

    it('user can not delete other user post', function () {
      cy.get('#logout-button').click();

      const user = {
        username: 'pmueller',
        password: '12345',
        name: 'Peter Mueller'
      };

      cy.createUser(user);
      cy.login(user);
      cy.get('.toggle-button').click();
      cy.get('#remove-button').should('not.exist');
    });

    it('blogs are ordered according to likes with the blog with the most likes being first.', function () {
      cy.createBlogPost({
        title: 'Cool Post 4',
        author: 'Peter Lustig',
        url: 'https://test.com',
        likes: 20,
      });
      cy.createBlogPost({
        title: 'Cool Post 5',
        author: 'Peter Lustig',
        url: 'https://test.com',
        likes: 15,
      });
      cy.get('#blogs').first().contains('Cool Post 5');
    });
  });
});