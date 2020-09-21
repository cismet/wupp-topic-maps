export const defaultConfig = {
	tmConfig: {
		fullScreenControl: true,
		locatorControl: true,
		gazetteerSearchBox: true,
		noInitialLoadingText: true,
		gazetteerSearchBoxPlaceholdertext: 'Suchbegriff hier eingeben.',
		photoLightBox: true,
		backgroundlayers: 'wupp-plan-live@50',
		gazetteerTopicsList: [ 'pois', 'kitas', 'quartiere', 'bezirke', 'adressen' ],
		home: {
			center: [ 51.22665888065321, 7.146690085998209 ],
			zoom: 14
		},
		applicationMenuTooltipString: 'Einstellungen | Anleitung',
		applicationMenuIconname: 'bars',
		clusterOptions: {
			spiderfyOnMaxZoom: false,
			showCoverageOnHover: false,
			zoomToBoundsOnClick: false,
			maxClusterRadius: 40,
			disableClusteringAtZoom: 19,
			animate: false,
			cismapZoomTillSpiderfy: 12,
			selectionSpiderfyMinZoom: 12
		},
		minZoom: 5,
		maxZoom: 19
	},
	featureDefaultConfig: {
		crs: {
			type: 'name',
			properties: {
				name: 'urn:ogc:def:crs:EPSG::25832'
			}
		},
		type: 'Feature',
		selected: false
	},
	info: {
		pixelwidth: 300,
		header: 'Wasserstofftankstelle',
		navigator: {
			noun: {
				singular: 'Wasserstofftankstelle',
				plural: 'Wasserstofftankstellen'
			}
		},
		noCurrentFeatureTitle: 'Keine Wasserstofftankstelle gefunden',
		noCurrentFeatureContent: ''
	},
	city: 'Wuppertal'
};

export const config = {
	...defaultConfig,
	features: [
		{
			index: 0,
			id: 42,
			text: 'Pommernstraße',
			type: 'Feature',
			selected: true,
			geometry: {
				type: 'Point',
				coordinates: [ 378213.832675781275611, 5685536.171230468899012 ]
			},
			properties: {
				info: {
					title: 'Shell Tankstelle',
					subtitle:
						'Autobahnanbindung A1 (Dreieck Wuppertal Nord) und A46 (Wuppertal Oberbarmen).',
					additionalInfo: 'Schmiedestraße 91',
					actions: [ { name: 'zoomToFeature' }, {} ]
				},
				tel: '+49-202-6294410',
				url:
					'https://www.think-ing.de/unternehmen/shell-deutsche-shell-holding-gmbh-hamburg',
				email_: 'info@cismet.de',
				foto: 'https://updates.cismet.de/docs/h2.shell.0.png',
				fotos: [
					'https://updates.cismet.de/docs/h2.shell.0.png',
					'https://updates.cismet.de/docs/h2.shell.1.png',
					'https://updates.cismet.de/docs/h2.shell.2.png'
				],

				secondaryInfos: {
					title: 'Datenblatt: Wasserstoffstation Shell Tankstelle',
					image: 'https://updates.cismet.de/docs/h2.shell.0.png',
					mainSections: [ { title: 'Adresse:', text: '' }, { title: '', text: '' } ],
					secondarySections: [
						{
							title: '',
							type: '',
							md: '',
							actions: []
						},
						{
							title: '',
							type: '',
							md: '',
							actions: []
						}
					]
				},

				id: 42,
				name: 'Shell Tankstelle',
				zusatzinfo:
					'Autobahnanbindung A1 (Dreieck Wuppertal Nord) und A46 (Wuppertal Oberbarmen).',
				online: true,
				color: '#247CE0',
				strasse: 'Schmiedestraße',
				hausnummer: '91',
				oeffnungszeiten: '24 Stunden / 7 Tage',
				authentifizierung: [ 'Offener Zugang während der Öffnungszeit.' ],
				steckerverbindungen: [],
				ladekosten: 'Tagespreis für Wasserstoff.',
				ladeplaetze: 2,
				wasserstoff: true,
				geojson: {
					type: 'Point',
					coordinates: [ 378213.832675781275611, 5685536.171230468899012 ]
				},
				betreiber: {
					id: 1,
					strasse: 'Schmiedestraße',
					hausnummer: '91',
					plz: '42279',
					ort: 'Wuppertal',
					telefon: '+49-202-6294410',
					homepage:
						'https://www.think-ing.de/unternehmen/shell-deutsche-shell-holding-gmbh-hamburg',
					name: 'Deutsche Shell Holding GmbH'
				},
				svgBadge: `
                <svg width="132px" height="132px" viewBox="0 0 132 132" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="piktogramm_wasserstoff_kfz">
                            <path d="M13.11,-1.42108547e-14 L117.97,-1.42108547e-14 C125.18,-1.42108547e-14 131.08,5.9 131.08,13.11 L131.08,117.97 C131.08,125.18 125.18,131.08 117.97,131.08 L13.11,131.08 C5.9,131.08 -1.42108547e-14,125.18 -1.42108547e-14,117.97 L-1.42108547e-14,13.11 C-1.42108547e-14,5.9 5.9,-1.42108547e-14 13.11,-1.42108547e-14 Z" id="Path" class="bg-fill" fill="#247CE0"></path>
                            <path d="M31.77,124.37 C27.88,124.37 24.36,122.79 21.81,120.24 C19.27,117.7 17.69,114.17 17.69,110.29 C17.69,106.4 19.27,102.88 21.81,100.33 C24.36,97.78 27.88,96.2 31.77,96.2 C35.66,96.2 39.18,97.78 41.73,100.33 C44.28,102.88 45.85,106.4 45.85,110.29 C45.85,114.17 44.28,117.7 41.73,120.24 C39.18,122.79 35.66,124.37 31.77,124.37 L31.77,124.37 Z M26.45,115.61 C27.81,116.97 29.69,117.82 31.77,117.82 C33.85,117.82 35.73,116.97 37.09,115.61 C38.46,114.25 39.3,112.37 39.3,110.29 C39.3,108.21 38.46,106.33 37.09,104.96 C35.73,103.6 33.85,102.76 31.77,102.76 C29.69,102.76 27.81,103.6 26.45,104.96 C25.09,106.33 24.24,108.21 24.24,110.29 C24.24,112.37 25.09,114.25 26.45,115.61 L26.45,115.61 Z" id="Shape" fill="#FFFFFF" class="fg-fill" fill-rule="nonzero"></path>
                            <path d="M95.54,124.37 C91.66,124.37 88.13,122.79 85.59,120.24 C83.04,117.7 81.46,114.17 81.46,110.29 C81.46,106.4 83.04,102.88 85.59,100.33 C88.13,97.78 91.66,96.2 95.54,96.2 C99.43,96.2 102.95,97.78 105.5,100.33 C108.05,102.88 109.63,106.4 109.63,110.29 C109.63,114.17 108.05,117.7 105.5,120.24 C102.95,122.79 99.43,124.37 95.54,124.37 L95.54,124.37 Z M90.22,115.61 C91.58,116.97 93.46,117.82 95.54,117.82 C97.62,117.82 99.5,116.97 100.87,115.61 C102.23,114.25 103.07,112.37 103.07,110.29 C103.07,108.21 102.23,106.33 100.87,104.96 C99.5,103.6 97.62,102.76 95.54,102.76 C93.46,102.76 91.58,103.6 90.22,104.96 C88.86,106.33 88.02,108.21 88.02,110.29 C88.02,112.37 88.86,114.25 90.22,115.61 L90.22,115.61 Z" id="Shape" fill="#FFFFFF" class="fg-fill" fill-rule="nonzero"></path>
                            <path d="M40.57,83.95 L105.43,83.95 C105.07,82.88 104.74,81.77 104.4,80.65 C102.47,75.19 100.53,69.08 95.11,68.08 C89.99,67.14 85.11,66.74 80.41,66.64 C73.25,66.49 67.44,67.03 65.42,67.43 C60.38,68.42 56.93,71.72 53.3,75.19 C52.21,76.23 51.1,77.29 49.85,78.38 C49.77,78.46 49.69,78.52 49.6,78.58 C47.25,80.35 44.79,81.91 42.23,83.17 C41.68,83.44 41.13,83.7 40.57,83.95 L40.57,83.95 Z M11.66,108.46 C7.01,105.74 5.29,101.61 5.61,96.75 C6.32,85.76 16.81,84.46 32.38,81.15 C32.52,81.09 32.68,81.04 32.84,81.01 C35.29,80.49 37.66,79.63 39.93,78.51 C42.22,77.38 44.4,76 46.47,74.44 C47.54,73.5 48.64,72.45 49.72,71.42 C53.91,67.42 57.9,63.6 64.42,62.31 C66.63,61.88 72.9,61.28 80.51,61.44 C85.47,61.55 91.03,61.97 96.44,62.97 C107.89,65.08 106.74,76.64 114.9,82.46 C117.28,84.15 118.41,85.16 120.59,87.01 C130.61,95.46 125.49,112.22 115.18,111.92 L115.1,111.92 C115.14,111.38 115.16,110.84 115.16,110.29 C115.16,104.91 112.98,100.05 109.46,96.53 C105.94,93 101.07,90.82 95.7,90.82 C90.33,90.82 85.46,93 81.94,96.53 C78.42,100.05 76.24,104.91 76.24,110.29 C76.24,110.65 76.25,111.02 76.27,111.38 L51.17,111.4 C51.19,111.03 51.2,110.66 51.2,110.29 C51.2,104.91 49.02,100.05 45.5,96.53 C41.98,93 37.11,90.82 31.74,90.82 C26.36,90.82 21.5,93 17.98,96.53 C14.84,99.66 12.77,103.85 12.35,108.52 L11.66,108.46 L11.66,108.46 Z" id="Shape" class="fg-fill" fill="#FFFFFF"></path>
                            <path d="M22.06,46.41 L22.06,29.47 L22.02,29.94 C20.19,29.8 19.2,30.02 18.74,30.6 C18.22,31.25 18.1,32.5 18.1,34.25 L18.1,34.25 L18.1,41.74 L18.1,41.78 C18.03,43.87 16.87,45.22 15.41,45.82 C14.84,46.06 14.22,46.17 13.6,46.17 C12.98,46.16 12.36,46.03 11.79,45.78 C10.37,45.15 9.29,43.8 9.28,41.75 L9.27,41.74 L9.27,23.99 L9.28,23.99 C9.26,23.2 9.29,22.67 9.41,22.21 C9.54,21.66 9.77,21.27 10.13,20.84 L10.12,20.84 L15.57,13.71 L17.65,15.3 L14.28,19.7 C15.06,19.87 15.76,20.27 16.31,20.81 C17.05,21.55 17.5,22.57 17.5,23.7 C17.5,24.84 17.05,25.86 16.31,26.6 C15.57,27.34 14.54,27.8 13.41,27.8 C12.87,27.8 12.36,27.7 11.89,27.51 L11.89,41.74 L11.89,41.74 C11.89,42.6 12.31,43.15 12.85,43.39 C13.08,43.5 13.35,43.55 13.62,43.55 C13.89,43.56 14.16,43.51 14.42,43.4 C14.99,43.17 15.44,42.61 15.49,41.74 L15.48,41.74 L15.48,34.25 L15.49,34.25 C15.49,31.93 15.71,30.19 16.7,28.96 C17.72,27.69 19.35,27.14 22.06,27.32 L22.06,9.01 L28.22,9.01 L28.22,23.74 L40.39,23.74 L40.39,9.01 L46.55,9.01 L46.55,46.41 L40.39,46.41 L40.39,30.06 L28.22,30.06 L28.22,46.41 L22.06,46.41 Z M14.45,22.66 C14.19,22.4 13.82,22.23 13.41,22.23 C13,22.23 12.64,22.4 12.37,22.66 C12.1,22.93 11.94,23.3 11.94,23.7 C11.94,24.11 12.1,24.48 12.37,24.75 C12.64,25.01 13,25.18 13.41,25.18 C13.82,25.18 14.19,25.01 14.45,24.75 C14.72,24.48 14.88,24.11 14.88,23.7 C14.88,23.3 14.72,22.93 14.45,22.66 Z M58.69,48.48 L58.69,51.65 L48.86,51.65 C48.96,50.45 49.28,49.31 49.82,48.22 C50.36,47.14 51.41,45.72 52.97,43.95 C54.2,42.55 54.96,41.6 55.24,41.11 C55.66,40.38 55.87,39.66 55.87,38.93 C55.87,38.15 55.7,37.56 55.35,37.16 C55,36.77 54.54,36.57 53.98,36.57 C52.74,36.57 52.07,37.5 51.98,39.36 L49.18,38.99 C49.35,37.17 49.85,35.84 50.7,34.99 C51.54,34.14 52.66,33.72 54.05,33.72 C55.59,33.72 56.75,34.22 57.52,35.22 C58.3,36.22 58.69,37.36 58.69,38.66 C58.69,39.39 58.59,40.1 58.39,40.78 C58.2,41.47 57.89,42.16 57.48,42.86 C57.06,43.55 56.38,44.44 55.41,45.51 C54.51,46.53 53.94,47.2 53.7,47.53 C53.46,47.85 53.27,48.17 53.12,48.48 L58.69,48.48 L58.69,48.48 Z" id="Shape" fill="#FFFFFF" class="fg-fill" fill-rule="nonzero"></path>
                        </g>
                    </g>
                </svg>
               `,
				svgBadgeDimension: {
					width: '132',
					height: '132'
				}
			},
			original_properties: {
				id: 42,
				name: 'Shell Tankstelle',
				zusatzinfo:
					'Autobahnanbindung A1 (Dreieck Wuppertal Nord) und A46 (Wuppertal Oberbarmen).',
				online: true,
				strasse: 'Schmiedestraße',
				hausnummer: '91',
				oeffnungszeiten: '24 Stunden / 7 Tage',
				authentifizierung: [ 'Offener Zugang während der Öffnungszeit.' ],
				steckerverbindungen: [],
				ladekosten: 'Tagespreis für Wasserstoff.',
				ladeplaetze: 2,
				wasserstoff: true,

				betreiber: {
					id: 1,
					strasse: 'Schmiedestraße',
					hausnummer: '91',
					plz: '42279',
					ort: 'Wuppertal',
					telefon: '+49-202-6294410',
					homepage:
						'https://www.think-ing.de/unternehmen/shell-deutsche-shell-holding-gmbh-hamburg',
					name: 'Deutsche Shell Holding GmbH'
				}
			}
		}

		// {
		// 	id: 35,
		// 	index: 1,
		// 	text: 'IKEA Wuppertal',
		// 	type: 'Feature',
		// 	selected: false,
		// 	geometry: {
		// 		type: 'Point',
		// 		coordinates: [ 378394.92, 5685662.84 ]
		// 	},
		// 	crs: {
		// 		type: 'name',
		// 		properties: {
		// 			name: 'urn:ogc:def:crs:EPSG::25832'
		// 		}
		// 	},
		// 	properties: {
		// 		id: 35,
		// 		name: 'IKEA Wuppertal',
		// 		info: {
		// 			title: 'IKEA Wuppertal',
		// 			subtitle: 'Kundenparkplatz (Wegweisung führt zu den Ladeplätzen.)',
		// 			additionalInfo: 'Schmiedestraße 81',
		// 			header: 'Wasserstofftankstelle (Testelement)',
		// 			actions: [ { name: 'zoomToFeature' }, {} ]
		// 		},

		// 		zusatzinfo: 'Kundenparkplatz',
		// 		online: true,
		// 		detailbeschreibung: 'Wegweisung führt zu den Ladeplätzen.',
		// 		strasse: 'Schmiedestraße',
		// 		hausnummer: '81',
		// 		foto: 'ikea.jpg',
		// 		oeffnungszeiten: 'Mo,Di,Mi,Do,Sa 10.00-20.00 Uhr | Fr 10.00-22.00 Uhr',
		// 		stromart: 'AC/DC',
		// 		authentifizierung: [ 'Offener Zugang während der Öffnungszeit.' ],
		// 		steckerverbindungen: [
		// 			{
		// 				anzahl: 2,
		// 				steckdosentyp: 'Typ 2',
		// 				leistung: 22,
		// 				strom: 32,
		// 				spannung: 400
		// 			},
		// 			{
		// 				anzahl: 2,
		// 				steckdosentyp: 'CHAdeMO',
		// 				leistung: 20,
		// 				strom: 50,
		// 				spannung: 500
		// 			}
		// 		],
		// 		ladekosten: 'Zurzeit keine',
		// 		gruener_strom: true,
		// 		ladeplaetze: 4,
		// 		parkgebuehr: 'Vorgaben des Betreibers beachten.',
		// 		parkhaus: false,
		// 		schnellladestation: false,
		// 		wasserstoff: false,
		// 		geojson: {
		// 			type: 'Point',
		// 			coordinates: [ 378394.92, 5685662.84 ]
		// 		},
		// 		betreiber: {
		// 			id: 8,
		// 			strasse: 'Schmiedestraße',
		// 			hausnummer: '81',
		// 			plz: '42279',
		// 			ort: 'Wuppertal',
		// 			telefon: '+49-6192-9399999',
		// 			homepage: '',
		// 			name: 'IKEA Einrichtungshaus Wuppertal'
		// 		},
		// 		color: '#247CE0',

		// 		svgBadge: `<svg width="524px" height="524px" viewBox="0 0 524 524" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
		//             <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
		//                 <path d="M52.3641,0 L471.2871,0 C500.0874,0 523.6512,23.5638 523.6512,52.3641 L523.6512,471.2871 C523.6512,500.0874 500.0874,523.6512 471.2871,523.6512 L52.3641,523.6512 C23.5638,523.6512 0,500.0874 0,471.2871 L0,52.3641 C0,23.5638 23.5638,0 52.3641,0 Z" id="Path" fill="#003B80" class="bg-fill"></path>
		//                 <path d="M126.923,496.835 C111.3925,496.835 97.3278,490.53652 87.1469,480.3557 C76.9661,470.1749 70.6676,456.1096 70.6676,440.5791 C70.6676,425.0486 76.96608,410.9834 87.1469,400.803 C97.3277,390.6222 111.3925,384.3237 126.923,384.3237 C142.4545,384.3237 156.5187,390.62218 166.6996,400.803 C176.8804,410.9833 183.1789,425.0486 183.1789,440.5791 C183.1789,456.1106 176.88042,470.1748 166.6996,480.3557 C156.5188,490.5365 142.4545,496.835 126.923,496.835 Z M105.6591,461.8436 C111.10089,467.28539 118.62,470.65247 126.923,470.65247 C135.22654,470.65247 142.7457,467.28539 148.1874,461.8436 C153.62919,456.40181 156.99627,448.8827 156.99627,440.5792 C156.99627,432.27566 153.62919,424.7571 148.1874,419.3153 C142.74561,413.87351 135.2265,410.50643 126.923,410.50643 C118.61998,410.50643 111.1009,413.87351 105.6591,419.3153 C100.21731,424.75709 96.85023,432.2757 96.85023,440.5792 C96.85023,448.88222 100.21731,456.4019 105.6591,461.8436 Z" id="Shape" fill="#FFFFFF" class="fg-fill" fill-rule="nonzero"></path>
		//                 <path d="M381.68,496.835 C366.1495,496.835 352.0848,490.53652 341.9039,480.3557 C331.7231,470.1749 325.4246,456.1096 325.4246,440.5791 C325.4246,425.0486 331.72308,410.9834 341.9039,400.803 C352.0847,390.6222 366.1495,384.3237 381.68,384.3237 C397.2115,384.3237 411.2757,390.62218 421.4566,400.803 C431.6374,410.9833 437.9359,425.0486 437.9359,440.5791 C437.9359,456.1106 431.63742,470.1748 421.4566,480.3557 C411.2758,490.5365 397.2115,496.835 381.68,496.835 L381.68,496.835 Z M360.4161,461.8436 C365.85789,467.28539 373.377,470.65247 381.68,470.65247 C389.98354,470.65247 397.5027,467.28539 402.9444,461.8436 C408.38619,456.40181 411.75327,448.8827 411.75327,440.5792 C411.75327,432.27566 408.38619,424.7571 402.9444,419.3153 C397.50261,413.87351 389.9835,410.50643 381.68,410.50643 C373.37698,410.50643 365.8579,413.87351 360.4161,419.3153 C354.97431,424.75709 351.60723,432.2757 351.60723,440.5792 C351.60723,448.88222 354.97431,456.4019 360.4161,461.8436 Z" id="Shape" fill="#FFFFFF" class="fg-fill" fill-rule="nonzero"></path>
		//                 <path d="M162.06665,335.351 L421.157,335.351 C419.72743,331.07329 418.40207,326.66414 417.06047,322.2 C409.3696,300.3904 401.59027,275.9626 379.94297,271.9761 C359.49547,268.21052 340.01767,266.60553 321.20497,266.20808 C292.60417,265.603262 269.39907,267.7649 261.34737,269.35313 C241.22607,273.32346 227.42517,286.51583 212.94417,300.35853 C208.57639,304.53413 204.14997,308.76576 199.14907,313.13563 C198.828072,313.416307 198.494506,313.672897 198.15099,313.906969 C188.75773,320.996689 178.93249,327.227069 168.70969,332.266169 C166.51559,333.347509 164.30107,334.377009 162.06665,335.351 L162.06665,335.351 Z M46.577,433.2697 C28.0046,422.4343 21.1511,405.9278 22.4089,386.5144 C25.25495,342.5863 67.1518,337.3938 129.3519,324.1726 C129.931582,323.932768 130.54164,323.742158 131.17787,323.60758 C140.99162,321.52606 150.44617,318.10138 159.51427,313.63149 C168.65199,309.12704 177.35927,303.61819 185.62097,297.38729 C189.9301,293.61386 194.30521,289.43145 198.62217,285.30459 C215.35177,269.31279 231.29487,254.07139 257.36017,248.92859 C266.17637,247.18954 291.22367,244.81478 321.61117,245.45783 C341.44187,245.876751 363.64837,247.57181 385.25687,251.55156 C430.98527,259.97188 426.39647,306.18416 459.02467,329.41276 C468.497,336.15635 473.01817,340.21256 481.75637,347.58456 C521.76337,381.33446 501.29227,448.31756 460.11747,447.11236 L459.788617,447.109742 C459.967706,444.956482 460.060392,442.778622 460.060392,440.579282 C460.060392,419.113782 451.355732,399.674782 437.284192,385.604282 C423.212592,371.532682 403.774192,362.828082 382.308092,362.828082 C360.842592,362.828082 341.403592,371.532742 327.333092,385.604282 C313.261492,399.674782 304.556892,419.113782 304.556892,440.579282 C304.556892,442.039222 304.59826,443.489742 304.677856,444.929782 L204.413856,445.0099 C204.496069,443.54368 204.539532,442.06645 204.539532,440.57928 C204.539532,419.11378 195.834872,399.67478 181.763332,385.60428 C167.691732,371.53268 148.253332,362.82808 126.787232,362.82808 C105.321732,362.82808 85.882732,371.53274 71.812232,385.60428 C59.297532,398.11798 51.028532,414.87848 49.351732,433.53358 L46.576382,433.26966 L46.577,433.2697 Z" id="Shape" fill="#FFFFFF" class="fg-fill"></path>
		//                 <text id="H" font-family="ArialMT, Arial" font-size="150" font-weight="normal" fill="#FFFFFF">
		//                     <tspan x="308" y="158">H</tspan>
		//                 </text>
		//                 <text id="2" font-family="ArialMT, Arial" font-size="100" font-weight="normal" fill="#FFFFFF">
		//                     <tspan x="410" y="193">2</tspan>
		//                 </text>
		//             </g>
		//         </svg>`,
		// 		svgBadgeDimension: {
		// 			width: '524',
		// 			height: '524'
		// 		}
		// 	}
		// }
	]
};
