import "./commands";

Cypress.on("window:before:load", (win) => {
  win.localStorage.setItem("i18nextLng", "en");
});
