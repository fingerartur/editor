/// <reference types="Cypress" />
import { logIn, clearLocalStorage, selectRule, selectDiagram } from '../utils/utils';

describe('Rule list', () => {
    afterEach(() => {
        clearLocalStorage();
    })

    beforeEach(() => {
        // clearLocalStorage();
        logIn();
    });

    it('can create and save a new rule', () => {
        cy.get(".e2e-new-rule button").contains("Vytvořit").click();
        selectDiagram();
        cy.get(".e2e-save button").contains("Uložit").click();
        cy.contains("New rule");
        cy.contains("New empty rule");
    });

    it('opens after login', () => {
        cy.contains("Pravidla");
    });

    it('has 3 example rules: Example 1, 100 elements, 1000 elements', () => {
        cy.contains("Example 1");
        cy.contains("100 elements");
        cy.contains("1000 elements");
    });

    it('has example rule with all its details (id=1)', () => {
       selectRule(1).within(() => {
            cy.contains("Example 1");
            cy.contains("Checking the price of goods");
            cy.contains("Otevřít");
        });
    });

    it('can load/open a rule (id=1)', () => {
        selectRule(1).get("a").contains("Otevřít").click();
        selectDiagram();
        cy.contains("Iterate over all items");
    });
});