/// <reference types="cypress" />

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/signin/");
  cy.get('input[placeholder*="email"]').type(email);
  cy.get('input[placeholder*="password"]').type(password);
  cy.contains("button", "Sign In").click();
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
    }
  }
}

export {};
