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
import "@testing-library/cypress/add-commands";

declare global {
  namespace Cypress {
    interface Chainable {
      assertLoggedIn(): void;
      assertLoggedOut(): void;
      login(email: string, password: string): void;
      assertTitle(title: string): void;
    }
  }
}

Cypress.Commands.add("assertLoggedIn", () => {
  cy.window().its("localStorage.nuber-token").should("be.a", "string");
});

Cypress.Commands.add("assertLoggedOut", () => {
  cy.window().its("localStorage.nuber-token").should("be.undefined");
});

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/");
  cy.assertLoggedOut();
  cy.findByPlaceholderText("Email").type(email);
  cy.findByPlaceholderText("Password").type(password);
  cy.findByRole("button")
    .should("not.have.class", "pointer-events-none")
    .click();
  cy.assertLoggedIn();
});

Cypress.Commands.add("assertTitle", (title: string) => {
  cy.title().should("eq", `${title} | Nuber Eats`);
});
