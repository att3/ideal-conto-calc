/// <reference types="cypress" />
describe('CalculatorApp', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')

        cy.get('#deliveryDistance').clear().type("100");
        cy.get('#deliveryItemsAmount').clear().type("1");
        cy.get('#cartValue').clear().type("10");
        cy.get('#deliveryDateTime').clear().type(nonRushHourDate.toString());
    });

    it('All elements can be found', function () {
        cy.get('#cartValue').should('be.visible')
        cy.get('#deliveryDistance').should('be.visible')
        cy.get('#deliveryItemsAmount').should('be.visible')
        cy.get('#deliveryDateTime').should('be.visible')
        cy.get('#calculateButton').should('be.visible')
        cy.get('#resultsText').should('be.visible')
    });

    const nonRushHourDate = new Date(Date.UTC(2018, 11, 1, 0, 0, 0));
    it('small order surcharge fee tests', function () {
        // test orderValue < 10
        let expectedDeliveryFee = 6
        cy.get('#cartValue').clear().type("5");
        cy.get('#calculateButton').click();
        cy.get('#resultsText').should('have.text', expectedDeliveryFee);

        expectedDeliveryFee = 9.9
        cy.get('#cartValue').clear().type("1.1");
        cy.get('#calculateButton').click();
        cy.get('#resultsText').should('have.text', expectedDeliveryFee);

        expectedDeliveryFee = 1
        // test orderValue > 10
        cy.get('#cartValue').clear().type("12");
        cy.get('#calculateButton').click();
        cy.get('#resultsText').should('have.text', expectedDeliveryFee);
    });

    it('test distance fee', () => {

        let expectedDeliveryFee = 1
        cy.get('#deliveryDistance').clear().type("1");
        cy.get('#calculateButton').click();
        cy.get('#resultsText').should('have.text', expectedDeliveryFee);

        expectedDeliveryFee = 2
        cy.get('#deliveryDistance').clear().type("999");
        cy.get('#calculateButton').click();
        cy.get('#resultsText').should('have.text', expectedDeliveryFee);

        expectedDeliveryFee = 3
        cy.get('#deliveryDistance').clear().type("1001");
        cy.get('#calculateButton').click();
        cy.get('#resultsText').should('have.text', expectedDeliveryFee);

        expectedDeliveryFee = 3
        cy.get('#deliveryDistance').clear().type("1499");
        cy.get('#calculateButton').click();
        cy.get('#resultsText').should('have.text', expectedDeliveryFee);

        expectedDeliveryFee = 3
        cy.get('#deliveryDistance').clear().type("1500");
        cy.get('#calculateButton').click();
        cy.get('#resultsText').should('have.text', expectedDeliveryFee);

        expectedDeliveryFee = 4
        cy.get('#deliveryDistance').clear().type("1501");
        cy.get('#calculateButton').click();
        cy.get('#resultsText').should('have.text', expectedDeliveryFee);

        expectedDeliveryFee = 5
        cy.get('#deliveryDistance').clear().type("2399");
        cy.get('#calculateButton').click();
        cy.get('#resultsText').should('have.text', expectedDeliveryFee);

        expectedDeliveryFee = 15
        cy.get('#deliveryDistance').clear().type("20001");
        cy.get('#calculateButton').click();
        cy.get('#resultsText').should('have.text', expectedDeliveryFee);


    });

    it('test amount of items surcharge', function () {

        let expectedDeliveryFee = 1
        cy.get('#deliveryItemsAmount').clear().type("4");
        cy.get('#calculateButton').click();
        cy.get('#resultsText').should('have.text', expectedDeliveryFee);

        expectedDeliveryFee = 1.5
        cy.get('#deliveryItemsAmount').clear().type("5");
        cy.get('#calculateButton').click();
        cy.get('#resultsText').should('have.text', expectedDeliveryFee);

        expectedDeliveryFee = 4
        cy.get('#deliveryItemsAmount').clear().type("10");
        cy.get('#calculateButton').click();
        cy.get('#resultsText').should('have.text', expectedDeliveryFee);


    });
})