/// <reference types="cypress" />

describe("App shell", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("loads home page", () => {
    cy.contains("Sign In").should("be.visible");
    cy.contains("Sign Up").should("be.visible");
  });

  it("navigates to Sign In page", () => {
    cy.contains("Sign In").click();
    cy.url().should("include", "/signin");
    cy.contains("Sign in to your account").should("be.visible");
  });

  it("navigates to Sign Up page", () => {
    cy.contains("Sign Up").click();
    cy.url().should("include", "/signup");
  });

  it("shows main feed on home", () => {
    cy.visit("/");
    cy.get("main").should("exist");
  });
});
