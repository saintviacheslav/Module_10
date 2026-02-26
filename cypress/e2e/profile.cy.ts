/// <reference types="cypress" />

import { validEmail, validPassword } from "../support/test-credentials";

describe("Profile page", () => {
  beforeEach(() => {
    cy.login(validEmail, validPassword);
    cy.visit("/profile/info");
  });

  it("loads profile info correctly", () => {
    cy.contains("Edit profile").should("be.visible");
    cy.contains("Preferences").should("be.visible");
    cy.contains("Actions").should("be.visible");
  });

  it("can switch to statistics tab", () => {
    cy.contains("Statistics").click();
    cy.url().should("include", "/profile/statistics");
    cy.contains("Posts").should("be.visible");
    cy.contains("Likes").should("be.visible");
    cy.contains("Comments").should("be.visible");
  });

  it("can toggle statistics chart view", () => {
    cy.visit("/profile/statistics");
    cy.contains("Enable Chart view").should("be.visible");

    cy.get('button').filter(':contains("")').first().click({ force: true });
    
    cy.contains("Table view").should("exist");
  });

  it("can edit profile description", () => {
    cy.visit("/profile/info");
    cy.get('textarea[placeholder*="description"]').clear().type("New E2E profile description");
    cy.contains("button", "Save Profile Changes").click();
    cy.contains("Profile info has been updated successfully").should("be.visible");
  });
});
