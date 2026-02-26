/// <reference types="cypress" />

import { validEmail, validPassword } from "../support/test-credentials";

describe("Sign In", () => {
  beforeEach(() => {
    cy.visit("/signin/");
  });

  it("shows sign in form", () => {
    cy.contains("Sign in to your account").should("be.visible");
    cy.get('input[placeholder*="email"]').should("be.visible");
    cy.get('input[placeholder*="password"]').should("be.visible");
    cy.contains("button", "Sign In").should("be.visible");
  });

  it("shows validation when submitting empty form", () => {
    cy.contains("button", "Sign In").click();
    cy.contains("Email is required").should("be.visible");
  });

  it("logs in with valid credentials and redirects to home", () => {
    cy.get('input[placeholder*="email"]').type(validEmail);
    cy.get('input[placeholder*="password"]').type(validPassword);
    cy.contains("button", "Sign In").click();
    cy.url().should("match", /\/(Module_10\/)?$/);
    cy.contains("What's new?").should("be.visible");
  });

  it("shows error for invalid credentials", () => {
    cy.get('input[placeholder*="email"]').type("wrong@mail.com");
    cy.get('input[placeholder*="password"]').type("wrongpass");
    cy.contains("button", "Sign In").click();
    cy.contains("Incorrect email or password").should("be.visible");
  });
});

describe("Sign Up", () => {
  beforeEach(() => {
    cy.visit("/signup/");
  });

  it("shows sign up form", () => {
    cy.get("form").should("exist");
    cy.get('input[type="text"], input[type="email"]').should("have.length.at.least", 1);
  });
});

describe("Protected route", () => {
  it("redirects to home when visiting /profile while not authenticated", () => {
    cy.visit("/profile/");
    cy.url().should("not.include", "/profile");
  });

  it("allows visiting profile when authenticated", () => {
    cy.login(validEmail, validPassword);
    cy.visit("/profile/");
    cy.url().should("include", "/profile");
  });
});
