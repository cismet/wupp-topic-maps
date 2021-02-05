export const getSimpleHelpForGenericTM = (title, simpleHelp) => {
	let titleContent;
	if (title !== undefined) {
		titleContent = 'Die Karte <b>' + title + '</b>';
	} else {
		titleContent = 'Die vorliegende Karte';
	}
	return [
		{
			type: 'FAQS',
			configs: [
				{
					title: 'Datengrundlage',
					bsStyle: 'default',
					contentBlockConf: {
						type: 'DOCBLOCK',
						docBlockConfigs: [
							{
								type: 'HTML',
								content:
									'\n\t\t\t\t\t\t\t\t\t\t' +
									titleContent +
									' bietet ihnen die folgenden\n\t\t\t\t\t\t\t\t\t\tHintergrundkarten an, die auf verschiedenen Geodatendiensten und Geodaten\n\t\t\t\t\t\t\t\t\t\tbasieren:\n\t\t\t\t\t\t\t\t\t\t'
							},
							{
								type: 'HTML',
								content: '<p><ul><li id="lic_lbk"/><li id="lic_sp"/></ul></p>',
								replaceConfig: {
									lic_lbk: {
										type: 'LICENSE_LBK'
									},
									lic_sp: {
										type: 'LICENSE_STADTPLAN'
									}
								}
							}
						]
					}
				},
				{
					title: 'Hintergrund',
					bsStyle: 'default',
					contentBlockConf: {
						type: simpleHelp.type || 'md',
						content: simpleHelp.content
					}
				},
				{
					title: 'Fachobjekte auswählen und abfragen',
					bsStyle: 'success',
					contentBlockConf: {
						type: 'FACHOBJEKTEAUSWAEHLENUNDABFRAGEN'
					}
				},
				{
					title: 'Kartendarstellung der Fachobjekte',
					bsStyle: 'success',
					contentBlockConf: {
						type: 'KARTENDARSTELLUNGDERFACHOBJEKTE'
					}
				},
				{
					title: ' In Karte positionieren',
					bsStyle: 'warning',
					contentBlockConf: {
						type: 'INKARTEPOSITIONIEREN'
					}
				},
				{
					title: 'Mein Standort',
					bsStyle: 'warning',
					contentBlockConf: {
						type: 'MEINSTANDORT'
					}
				},
				{
					title: 'Einstellungen',
					bsStyle: 'info',
					contentBlockConf: {
						type: 'EINSTELLUNGEN'
					}
				}
			]
		}
	];
};
