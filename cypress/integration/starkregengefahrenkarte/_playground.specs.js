describe('Playground tests', () => {
	
	//  Help & Settings
	it('opens the modal menu and checks that the right panel is visible', () => {
		cy.visit('/#/starkregen?'); //for app init
		cy.get('#cmdShowModalApplicationMenu').click({ force: true });
		cy.get('.modal-title').contains('h4', 'Kompaktanleitung und Hintergrundinformationen').should('be.visible');		
		cy.get('#cmdCloseModalApplicationMenu').click({ force: true });

	});

	// Settings
	it.only('opens the modal menu and checks the settings', () => {
		cy.visit('/#/starkregen?'); //for app init
		cy.window()
		.its("__store__")
		.then(store => { 
			
			
			
			cy.wait(500);

			store.dispatch({ type: '"UISTATE/SET_APPLICATION_MENU_ACTIVE_KEY"', key:"none" })
		
		

			cy.get('#cmdShowModalApplicationMenu').click({ force: true });




			cy.get('[name="datengrundlage"] > .panel ').should('be.visible');
			cy.get('[name="karteninhalt"] > .panel > .panel-heading').should('be.visible');
			cy.get('[name="positionieren"] > .panel > .panel-heading').should('be.visible');
			cy.get('[name="standort"] > .panel > .panel-heading').should('be.visible');
			cy.get('[name="wasserstand"] > .panel > .panel-heading ').should('be.visible');
			cy.get('[name="szenarien"] > .panel > .panel-heading ').should('be.visible');
			cy.get('[name="aussagekraft"] > .panel > .panel-heading').should('be.visible');
			cy.get('[name="modellfehlermelden"].panel > .panel-heading ').should('be.visible');
	
			cy.get('[name="modellfehlermelden"] > .panel > .panel-collapse').should('have.attr', 'aria-hidden', 'true');
			cy.get('[name="modellfehlermelden"] > .panel > .panel-heading > .panel-title > a').click();
			cy.get('[name="modellfehlermelden"] > .panel > .panel-collapse').should('have.attr', 'aria-hidden', 'false');
			cy.get('[name="modellfehlermelden"] > .panel > .panel-heading > .panel-title > a').click();
			cy.get('[name="modellfehlermelden"] > .panel > .panel-collapse').should('have.attr', 'aria-hidden', 'true');
	
		
		});

	
		

		//test the settings
		// cy.get('#lnkSettings').click();
		// cy.get('[name="settings"] > .panel > .panel-collapse').should('have.attr', 'aria-hidden', 'false');
		// cy.get('[name="help"] > .panel > .panel-collapse').should('have.attr', 'aria-hidden', 'true');

		// cy.get('#cboMapStyleChooser_default').click();
		// cy.get('#cboMapStyleChooser_blue').click();

		
	});

	// Help
	it('opens the modal menu and checks the settings and test the in help links', () => {
		cy.visit('/#/starkregen?'); //for app init

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
