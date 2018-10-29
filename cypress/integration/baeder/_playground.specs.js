describe('Playground tests', () => {
	it('checks if the main components are available', () => {
		cy.visit('/#/baeder?'); //for app init

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

	//  Help & Settings
	it('opens the modal menu and checks that the right panel is visible', () => {
		cy.visit('/#/baeder?'); //for app init

		cy.get('#cmdShowModalApplicationMenu').click({ force: true });
		cy.get('.modal-title').contains('h4', 'Einstellungen und Kompaktanleitung').should('be.visible');
		cy.get('#lnkSettings').click();
		cy.get('[name="settings"] > .panel > .panel-collapse').should('have.attr', 'aria-hidden', 'false');
		cy.get('[name="help"] > .panel > .panel-collapse').should('have.attr', 'aria-hidden', 'true');
		cy.get('#lnkHelp').click();
		cy.get('[name="settings"] > .panel > .panel-collapse').should('have.attr', 'aria-hidden', 'true');
		cy.get('[name="help"] > .panel > .panel-collapse').should('have.attr', 'aria-hidden', 'false');
	});

	// Settings
	it.only('opens the modal menu and checks the settings', () => {
		cy.visit('/#/baeder?'); //for app init

		cy.get('#cmdShowModalApplicationMenu').click({ force: true });

		//test the settings
		cy.get('#lnkSettings').click();
		cy.get('[name="settings"] > .panel > .panel-collapse').should('have.attr', 'aria-hidden', 'false');
		cy.get('[name="help"] > .panel > .panel-collapse').should('have.attr', 'aria-hidden', 'true');

		cy.get('#cboMapStyleChooser_default').click();
		cy.get('#cboMapStyleChooser_blue').click();

		cy.window().its('__store__').then((store) => {
			const s = store.getState();
		});
	});

	// Help
	it('opens the modal menu and checks the settings and test the in help links', () => {
		cy.visit('/#/baeder?'); //for app init

		cy.get('#cmdShowModalApplicationMenu').click({ force: true });
		cy.get('#lnkHelp').click();
		cy.get('[name="settings"] > .panel > .panel-collapse').should('have.attr', 'aria-hidden', 'true');
		cy.get('[name="help"] > .panel > .panel-collapse').should('have.attr', 'aria-hidden', 'false');

		cy.get('#lnkHelp').click();
		let sectionCheck = [
			'datengrundlage',
			'auswahl',
			'styling',
			'positionieren',
			'standort',
			'settings',
			'personalisierung'
		];
		for (const sectionKey of sectionCheck) {
			cy.get('#lnkHelpHeader_' + sectionKey).click();
			cy.get('#anchorDivInHelp_' + sectionKey).should('be.visible');
			cy.get('#lnkUpInHelp_' + sectionKey).click();
			cy.get('#lnkHelpHeader_datengrundlage').should('be.visible');
		}
	});
});
