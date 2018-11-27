describe('Control tests', () => {
    it('checks if the main components are available', () => {
		cy.visit('/#/starkregen?'); //for app init

		//Check for all components

		cy.get('.leaflet-control-zoom-in').should('be.visible');
		cy.get('.leaflet-control-zoom-out').should('be.visible');
		cy.get('.leaflet-control-fullscreen-button').should('be.visible');
		cy.get('.leaflet-control-locate > .leaflet-bar-part').should('be.visible');

		cy.get('#cmdShowModalApplicationMenu').should('be.visible');
		cy.get('.well').should('be.visible');

		cy.get('.rbt-input-main').should('be.visible');
		cy.get('.rbt-input-main').should('be.enabled');
		cy.get('.input-group-btn > .btn').should('be.visible');

		cy.get('.leaflet-container').should('be.visible');
		cy.get('.easy-button-button').should('be.visible');


		//Tooltips
		cy.get('.leaflet-control-zoom-in').should('have.attr','title','Vergrößern');
		cy.get('.leaflet-control-zoom-out').should('have.attr','title','Verkleinern');
		cy.get('.leaflet-control-fullscreen-button').should('have.attr','title','Vollbildmodus');
		cy.get('.leaflet-control-locate > .leaflet-bar-part').should('have.attr','title','Mein Standort');
		cy.get('.easy-button-button').should('have.attr','title','Fehler im Geländemodell melden');

	});
});
