describe('test with backend', () => {

  beforeEach('login to app',()=>{
    cy.intercept({method:'Get',path:'tags'},{fixture:'test.json'})
    cy.loginToapplication('max.palamar4uck2004@gmail.com','zxcv1234')
  })
  it('first', () => {
    cy.log('Hey we logged in')
  })

  it('verify correct request and respons',()=>{

    cy.intercept('POST','https://conduit-api.bondaracademy.com/api/articles/').as('postArticles')
    cy.contains('New Article').click()
    cy.get('[formcontrolname="title"]').type('Test Article')
    cy.get('[formcontrolname="description"]').type('Test desc')
    cy.get('[formcontrolname="body"]').type('Body')
    cy.get('button').contains('Publish Article').click()

    cy.wait('@postArticles')//we can use code below without cy.get
    cy.get('@postArticles').then(xhr =>{
      console.log(xhr)
      expect(xhr.response.statusCode).to.equal(201)
      expect(xhr.request.body.article.body).to.equal('Body')
      expect(xhr.response.body.article.description).to.equal('Test desc')
    })



  })
  it('very popular tags are displayed',() =>{
       cy.get('.tag-list').should('contain','cypress').and('contain','Automation').and('contain','Testing')
  })
  it('verify global feed likes count',()=>{
    cy.intercept('GET','https://conduit-api.bondaracademy.com/api/articles/feed*',{"articles":[],"articlesCount":0})
    cy.intercept('GET','https://conduit-api.bondaracademy.com/api/articles*',{fixture:'articles.json'})

    cy.contains('Global Feed').click()
    cy.get('app-article-list button').then(heartList =>{
       expect(heartList[0]).to.contain('1')
       expect(heartList[1]).to.contain('315')
    })
    cy.fixture('articles.json').then(file =>{
       const articleSlug = file.articles[0].slug
       file.articles[0].favoritesCount = 6
       cy.intercept('POST','https://conduit-api.bondaracademy.com/api/articles/' + articleSlug + '/favorite',file)

    })

    cy.get('app-article-list button').eq(0).click().should('contain','6')
  })

  // it.only('intercepting and modyfying the req and res',()=>{
  //   cy.intercept('POST','**/articles',(req)=>{
  //     req.body.description= "Test desc2"
  //   }).as('postArticles')
  it('intercepting and modyfying the req and res',()=>{
    cy.intercept('POST','**/articles',(req)=>{
      req.reply(res=>{
        expect(res.body.description).to.equal('Test desc')
        res.body.description = 'Test desc2'
      })
    }).as('postArticles')
    
    cy.contains('New Article').click()
    cy.get('[formcontrolname="title"]').type('Test Article')
    cy.get('[formcontrolname="description"]').type('Test desc')
    cy.get('[formcontrolname="body"]').type('Body')
    cy.get('button').contains('Publish Article').click()

    cy.wait('@postArticles')//we can use code below without cy.get
    cy.get('@postArticles').then(xhr =>{
      console.log(xhr)
      expect(xhr.response.statusCode).to.equal(201)
      expect(xhr.request.body.article.body).to.equal('Body')
      expect(xhr.response.body.article.description).to.equal('Test desc2')
    })
})

   it('delete a new article ', () =>{

   
  const bodyReq = {
    "article": {
        "title": "Request from API",
        "description": "API testing is",
        "body": "test body",
        "tagList": []
    }
}
    cy.get('@token').then(token =>{
       

        cy.request({
          url:'https://conduit-api.bondaracademy.com/api/articles/',
          headers:{'Authorization' : 'Token' + token},
          method:'POST',
          body: bodyReq
        }).then(response =>{
          expect(response.status).to.equal(200)
        })
    })
    cy.contains('Global Feed').click()
    cy.get('.article-preview').first().click()
    cy.get('.article-actions').contains('Delete Article').click()

    cy.request({
      url:'https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',
      headers:{'Authorization' : 'Token'+ token},
      method:'GET'
    }).its('body').then(body =>{
      expect(body.articles[0].title).not.to.equal('Request from API')
    })

   })

})
