export function logIn(username = 2) {
    cy.visit('localhost:3000');
    cy.get("[placeholder=Username]")
        .type(username);
    cy.get("button")
        .click();
}

export function openRule(id) {
    cy.get(".e2e-rule[data-id=" + id + "] a").click();
}

export function clearLocalStorage() {
    localStorage.setItem('rule-info', null);
    cy.log("Local storage cleared");
}

export function selectRule(number) {
    return cy.get(`.e2e-rule[data-id=${number}]`);
}

export function selectDiagram() {
    return cy.get(`.e2e-diagram-svg`);
}

export function selectElement(number) {
    return cy.get(`.e2e-element-${number}`);
}

export function closeModal() {
    cy.get(".ant-modal").trigger("keydown", { keyCode: 13, key: "Enter" });
}