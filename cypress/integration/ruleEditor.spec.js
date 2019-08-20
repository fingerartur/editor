/// <reference types="Cypress" />
import { logIn, openRule, selectDiagram, clearLocalStorage, selectElement, closeModal } from '../utils/utils';

describe('Rule editor (rule id=1)', () => {
    afterEach(() => {
        clearLocalStorage();
    })

    beforeEach(() => {
        // clearLocalStorage();
        logIn();
        openRule("1");
    });

    it('displays a rule', () => {
        selectDiagram();
    });

    it('can view and edit an assignment element', () => {
        selectElement(2).click();
        const literal = cy.get(".e2e-literal");
        literal.click();
        literal.get(".e2e-value-input").clear().type(13).type(`{Enter}`);
        closeModal();
        selectElement(2).click();
        cy.get(".e2e-literal").contains(13);
    });

    it('can edit expressions', () => {
        selectElement(2).click();
        const literal = cy.get(".e2e-literal");
        literal.click();
        literal.get(".e2e-value-input").clear().type("sum").type(`{Enter}`);
        
        cy.get(".e2e-expression-empty-argument").first().click();
        cy.get(".e2e-value-input").type("12").type(`{Enter}`);
        
        cy.get(".e2e-expression-empty-argument").first().click();
        cy.get(".e2e-value-input").type("5").type(`{Enter}`);

        cy.get(".e2e-literal").first().trigger('mouseover');
        cy.get('.e2e-arg-delete').click();
    });

    it('can view and edit details of a conditional statement', () => {
        selectElement(5).click();
        cy.get(".e2e-expression");
        cy.get(".ant-modal input").clear().type("new description").type(`{Enter}`)

        cy.contains("new description");
    });

    it('can view and edit details of an iteration element', () => {
        selectElement(3).click();
        cy.get(".e2e-value-input").clear();
        cy.get(".ant-modal").click();
        closeModal();

        // modal doesnt close because element is invalid
        cy.contains("Chybí vícehodnotová proměnná");
        cy.contains("Iterační proměnná:");
    });

    it('can copy and paste', () => {
        cy.root().trigger('mousedown', 230, 210)
            .trigger('mousemove', 300, 260)
            .trigger('mouseup', 300, 260);
            
        cy.get("svg").type('{ctrl}C')
            .type('{ctrl}V');

        cy.get("svg [y=215]")
            .trigger('mouseup', {force: true});

        cy.get(".e2e-element-4")
            .trigger('mouseover');

        cy.contains("Dvojtá deklarace proměnné");
    });

    it('can remove elements', () => {
        cy.root().trigger('mousedown', 230, 210)
            .trigger('mousemove', 300, 260)
            .trigger('mouseup', 300, 260);
            
        cy.get("svg").type('{del}');
        cy.get('.e2e-element-6').should('not.exist');
    });

    it('can navigate', () => {
        cy.get('.e2e-element-7').should('not.exist');
        cy.get('.e2e-element-8').should('not.exist');
        cy.get("svg").type('{downarrow}').type('{downarrow}').type('{downarrow}').type('{downarrow}');
        cy.contains("end");
        cy.get("svg").type('{uparrow}').type('{uparrow}').type('{uparrow}').type('{uparrow}');
        cy.get("svg").type('{ctrl}-').type('{ctrl}-').type('{ctrl}-').type('{ctrl}-').type('{ctrl}-');
        cy.get('.e2e-element-7');
        cy.get('.e2e-element-8');
    });

    it('can create an assign element', () => {
        cy.get("svg [data-type=creator][data-name=assign]")
            .trigger('mousedown', {force: true});
        cy.wait(100);
        cy.get("svg [y=95]")
            .trigger('mouseup', {force: true});
        cy.wait(100);
        cy.get(".ant-modal").within(() => {
            cy.contains("Popis");
            cy.contains("Proměnná");
            cy.contains("Zadejte název proměnné");
        });
            
        cy.get(".ant-modal input").eq(0)
            .should("have.value", "Assign")
            .type(" one to variable X")
            .should("have.value", "Assign one to variable X");

        cy.get(".ant-modal input").eq(1)
            .should("have.value", "")
            .type("X")
            .should("have.value", "X");
        cy.get(".ant-modal")
            .contains("Vytvoří se nová proměnná");

        cy.get(".ant-modal .e2e-expression-empty-argument")
            .click();

        cy.get(".ant-modal .e2e-expression input")
            .type("12")
            .should("have.value", "12")
            .type("{Enter}");

        cy.focused().type("{Enter}");
        
        cy.get(".ant-modal").should("not.exist");

        cy.contains("Assign one to variable X");
    });

    it('will not save an assign element while variable name is empty', () => {
        cy.get("svg [data-type=creator][data-name=assign]")
            .trigger('mousedown', {force: true});
        cy.wait(100);
        cy.get("svg [y=95]")
            .trigger('mouseup', {force: true});
        cy.wait(100);

        closeModal();
        cy.contains("Chybí název proměnné");
        cy.get(".ant-modal");
    });

    it('will not save an assign element while expression is unfinished', () => {
        cy.get("svg [data-type=creator][data-name=assign]")
            .trigger('mousedown', {force: true});
        cy.wait(100);
        cy.get("svg [y=95]")
            .trigger('mouseup', {force: true});
        cy.wait(100);

        cy.get(".ant-modal input").eq(1).type("X");
        cy.get(".ant-modal").trigger("keydown", { keyCode: 13, key: "Enter" });

        cy.contains("Výraz není dokončený");
        cy.get(".ant-modal");
    });
});