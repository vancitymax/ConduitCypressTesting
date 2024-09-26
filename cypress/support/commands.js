// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('loginToapplication', (email,password)=>{

    const userCre={
        "user": {
            "email": "max.palamar4uck2004@gmail.com",
            "password": "zxcv1234"
        }
    }

    cy.request('POST','https://conduit-api.bondaracademy.com/api/users/login',userCre).its('body').then(body =>{
        const token = body.user.token
        cy.wrap(token).as('token')
        cy.visit('https://conduit.bondaracademy.com/login',{
            onBeforeLoad(win){
                win.localStorage.setItem('jwToken',token)
            }
        })

    })

    // cy.visit('https://conduit.bondaracademy.com/login')
    // cy.get('[formcontrolname="email"]').type(email)
    // cy.get('[formcontrolname="password"]').type(password)
    // cy.get('form').submit()
})
