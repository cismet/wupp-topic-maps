

describe('Common tests', () => {

    it('connects to the store', () => {
        cy.visit("/") //for app init
        cy.window().its('__store__').then((store) => {
            const s=store.getState();
            expect(s).to.be.an('object');
            let subStates=["baeder","bplaene","ehrenamt","gazetteerTopics","kitas","mapping","routing","stadtplan","uiState"];
            for (const substate of subStates) {
                expect(s).to.have.property(substate)    
            }
        })
    });
});
