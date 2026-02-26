/// <reference types="cypress" />

import { validEmail, validPassword } from "../support/test-credentials";

describe("App settings", () => {
  beforeEach(() => {
    cy.login(validEmail, validPassword);
    cy.visit("/profile/info");
  });

  it("can switch language", () => {
    cy.contains("button", "RU").click();
    
    cy.contains("Действия").should("be.visible");
    
    cy.contains("button", "EN").click();
    cy.contains("Actions").should("be.visible");
  });

  it("can switch theme", () => {
    cy.contains("Dark").should("exist"); 
    cy.get('button span[class*="themeCircle"]').click({ force: true });
    
    cy.contains("Light").should("exist");
    
    cy.get('button span[class*="themeCircle"]').click({ force: true });
    cy.contains("Dark").should("exist");
  });
});
