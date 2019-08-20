/// <reference types="Cypress" />

describe('Login screen', () => {
    it('Has a working login form', () => {
        expect(true).to.equal(true);
        cy.visit('localhost:3000');
        cy.contains('Name');
        cy.contains('Password');
        cy.contains('Log in');

        const username = "1";
        cy.get("[placeholder=Username]")
            .type(username);
        cy.get("button")
            .click();
    });
});