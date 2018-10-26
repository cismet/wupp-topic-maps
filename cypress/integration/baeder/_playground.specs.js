

describe('Playground tests', () => {

    it('connects to the store', () => {
        cy.visit("/#/baeder?"); //for app init         
        
        //Check for all components

        cy.get('.leaflet-control-zoom-in').should('be.visible');
        cy.get('.leaflet-control-zoom-out').should('be.visible');
        cy.get('.leaflet-control-fullscreen-button').should('be.visible');
        cy.get('.leaflet-control-locate > .leaflet-bar-part').should('be.visible');

        cy.get('.leaflet-control > .btn').should('be.visible');
        cy.get('.well').should('be.visible');


        cy.get('.rbt-input-main').should('be.visible');
        cy.get('.rbt-input-main').should('be.enabled');
        cy.get('.input-group-btn > .btn').should('be.visible');

        cy.get('.leaflet-container').should('be.visible');
    });

    // Help & Settings
    it.only('opens the settings dialog', () => {
        cy.visit("/#/baeder?"); //for app init         

        cy.get('#cmdShowModalApplicationMenu').click({force: true});
        cy.get('.modal-title').contains("h4", "Einstellungen und Kompaktanleitung").should('be.visible');
        cy.get('#lnkSettings').click();
        cy.get('[name="settings"] > .panel > .panel-collapse').should('have.attr', 'aria-hidden', 'false');
        cy.get('[name="help"] > .panel > .panel-collapse').should('have.attr', 'aria-hidden', 'true');
        cy.get('#lnkHelp').click();
        cy.get('[name="settings"] > .panel > .panel-collapse').should('have.attr', 'aria-hidden', 'true');
        cy.get('[name="help"] > .panel > .panel-collapse').should('have.attr', 'aria-hidden', 'false');
        
        //test the settings
        cy.get('#lnkSettings').click();
        cy.get('[name="settings"] > .panel > .panel-collapse').should('have.attr', 'aria-hidden', 'false');
        cy.get('[name="help"] > .panel > .panel-collapse').should('have.attr', 'aria-hidden', 'true');



        
        //test the help section
    });



});
