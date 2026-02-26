/// <reference types="cypress" />

import { validEmail, validPassword } from "../support/test-credentials";

describe("Post interactions", () => {
  beforeEach(() => {
    cy.login(validEmail, validPassword);
    cy.visit("/");
  });

  it("can open create post modal, fill and submit", () => {
    cy.contains("button", "Tell everyone").click();

    cy.contains("Create a new post").should("be.visible");
    cy.get('[class*="modalPost"]').within(() => {
      cy.get('input[type="text"]').type("My new E2E post");
      cy.get("textarea").type("This is a description from Cypress test.");
      cy.contains("button", "Create").click();
    });

    cy.contains("Post created successfully").should("be.visible");
  });

  it("can like a post", () => {
    cy.get('.icon--heart').first().click({ force: true }); 
    cy.get('.icon--heart').first().should('be.visible');
  });

  it("can open comments and add a comment", () => {
    cy.get(".icon--arrow-down").first().click({ force: true });

    cy.contains("button", "Add a comment")
      .first()
      .parents('[class*="addingComment"]')
      .first()
      .within(() => {
        cy.get("textarea").should("be.visible");
        cy.get("textarea").type("E2E Comment");
      });
    cy.contains("button", "Add a comment").first().click();

    cy.contains("Comment added successfully").should("be.visible");
  });
});
