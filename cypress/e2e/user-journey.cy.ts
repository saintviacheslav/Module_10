/// <reference types="cypress" />

import { validEmail, validPassword } from "../support/test-credentials";

describe("User journey: login and view feed", () => {
  it("user can open app, sign in, see feed and suggested people", () => {
    cy.visit("/");
    cy.contains("Sign In").click();
    cy.url().should("include", "/signin");

    cy.get('input[placeholder*="email"]').type(validEmail);
    cy.get('input[placeholder*="password"]').type(validPassword);
    cy.contains("button", "Sign In").click();

    cy.url().should("match", /\/(Module_10\/)?$/);
    cy.contains("What's new?").should("be.visible");
    cy.contains("Tell everyone").should("be.visible");
    cy.contains("Suggested people").should("be.visible");
  });
});

describe("User journey: login and open profile", () => {
  it("user can sign in and navigate to profile", () => {
    cy.login(validEmail, validPassword);
    cy.visit("/");
    cy.get('img[alt="avatar"]').first().click();
    cy.url().should("include", "/profile");
  });
});
