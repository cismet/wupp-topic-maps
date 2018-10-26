describe("Mapping component tests", () => {
    it("checks the existence of the map", () => {
        cy.login();
        cy.get(".leaflet-container").should("be.visible");
        cy.get(".leaflet-pane")
            .its("length")
            .should("eq", 7);
        //number of the displayed feature collection
        cy.get(".leaflet-pane  .leaflet-overlay-pane")
            .find(".leaflet-interactive")
            .its("length")
            .should("eq", 20);
    });

    it("checks the (selectable) featurecollection", () => {
        cy.login();
        cy.window()
            .its("__store__")
            .then(store => {
                const s = store.getState();
                const mapping = s.mapping;
                const flaechen = s.kassenzeichen.flaechen
                    .concat()
                    .sort(kassenzeichenFlaechenSorter);
                cy.wait(500);
                for (let f of flaechen) {
                    cy.wait(50);
                    cy.get(
                        ".leaflet-container > .leaflet-pane  .leaflet-overlay-pane >> g > .verdis-flaeche-" +
                            f.flaechenbezeichnung
                    ).as("fPathCheck");
                    cy.get("@fPathCheck").then(result => {
                        //calculate a point that lies within the svg path
                        const relPl = getRelativeInnerPointFromSVGString(
                            result[0].attributes.d.nodeValue
                        );

                        cy.get(
                            ".leaflet-container > .leaflet-pane  .leaflet-overlay-pane >> g > .verdis-flaeche-" +
                                f.flaechenbezeichnung
                        ).as("fPath");

                        // Check that the feature is not selected
                        expect(result[0].attributes.stroke.nodeValue).to.equal(
                            UNSELECTED_COLOR
                        );

                        // Click the  feature
                        cy.get("@fPath").click(relPl[0], relPl[1], {
                            force: true
                        });

                        // Check that the feature has been selected
                        cy.get("@fPath").should(result => {
                            expect(
                                result[0].attributes.stroke.nodeValue
                            ).to.equal(SELECTED_COLOR);
                        });
                    });
                }
            });
    });


    it("checks zoom in an out", () => {
        cy.login();
        cy.wait(1000);
        cy.hash().should((hash)=>{
            //'match', /#\/meinkassenzeichen\?lat=51\..*&lng=7\..*&zoom=.*/); 
            console.log("location.search");
            console.log(hash);
        });
        // cy.get('.leaflet-control-zoom-in').click();
        // cy.get('.leaflet-control-zoom-in').click();
        // cy.get('.leaflet-control-zoom-in').click();
        // cy.get('.leaflet-control-zoom-out').click();
        // cy.get('.leaflet-control-zoom-out').click();
        // cy.get('.leaflet-control-zoom-out').click();
    });
});
