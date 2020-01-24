import { actions as bplanActions } from '../redux/modules/bplaene';
import { actions as DocsActions } from '../redux/modules/docs';
const tileservice = 'https://aaa.cismet.de/tiles/';

export function getDocsForAEVGazetteerEntry(props) {
	let {
		docPackageIdParam,
		docIndex,
		pageIndex,
		gazHit,
		searchForAEVs,
		docsActions,
		dox,
		gotoWholeDocument
	} = props;
	console.log('getDocsForAEVGazetteerEntry', props);

	searchForAEVs({
		gazObject: [ gazHit ],
		skipMappingActions: true,
		done: (aevFeatures) => {
			let docs = [];
			const aev = aevFeatures[0].properties;
			let title =
				aev.verfahren === '' ? 'FNP-Änderung ' + aev.name : 'FNP-Berichtigung ' + aev.name;

			if (aev) {
				const filename =
					aev.verfahren === ''
						? 'FNP-Änderung.' + aev.name + '.pdf'
						: 'FNP-Berichtigung.' + aev.name + '.pdf';
				docs.push({
					group: 'Änderungsverfahren',
					file: filename,
					url: aev.url.replace(
						'http://www.wuppertal.de/geoportal/',
						'https://wunda-geoportal-docs.cismet.de/'
					),
					layer: replaceUmlauteAndSpaces(
						aev.url.replace('http://www.wuppertal.de/geoportal/', tileservice) +
							'/{z}/{x}/{y}.png'
					),
					meta: replaceUmlauteAndSpaces(
						aev.url.replace('http://www.wuppertal.de/geoportal/', tileservice) +
							'/meta.json'
					)
				});

				for (let url of aev.docUrls) {
					const filename = url.substring(url.lastIndexOf('/') + 1);
					docs.push({
						group: 'Zusatzdokumente',
						file: filename,
						url: url.replace(
							'https://www.wuppertal.de/geoportal/',
							'https://wunda-geoportal-docs.cismet.de/'
						),
						layer: replaceUmlauteAndSpaces(
							url.replace('https://www.wuppertal.de/geoportal/', tileservice) +
								'/{z}/{x}/{y}.png'
						),
						meta: replaceUmlauteAndSpaces(
							url.replace('https://www.wuppertal.de/geoportal/', tileservice) +
								'/meta.json'
						)
					});
				}
			}

			console.log('docs', docs);

			docsActions.setDocsInformation(docs, () => {
				docsActions.setViewerTitle(title);
				docsActions.finished(docPackageIdParam, docIndex, pageIndex, () => {
					setTimeout(() => {
						if (
							true ||
							(dox && dox.docs && dox.docs[docIndex] && dox.docs[docIndex].meta)
						) {
							gotoWholeDocument();
						} else {
						}
					}, 100);
				});
			});
		}
	});
}

export function getDocsForBPlanGazetteerEntry(props) {
	let {
		docPackageIdParam,
		docIndex,
		pageIndex,
		gazHit,
		searchForPlans,
		docsActions,
		dox,
		gotoWholeDocument
	} = props;
	console.log('getDocsForBPlanGazetteerEntry', props);

	searchForPlans(
		[
			{
				sorter: 0,
				string: gazHit.string,
				glyph: '-',
				x: gazHit.x,
				y: gazHit.y,
				more: { zl: 18, v: gazHit.more.v }
			}
		],
		null,
		{
			skipMappingActions: true,
			done: (bplanFeatures) => {
				const bplan = bplanFeatures[0].properties;
				let title = 'B-Plan ' + bplan.nummer;

				let docs = [];
				for (const doc of bplan.plaene_rk) {
					docs.push({
						group: 'rechtskraeftig',
						file: doc.file,
						url: doc.url.replace(
							'https://wunda-geoportal-docs.cismet.de/',
							'https://wunda-geoportal-docs.cismet.de/'
						),
						layer: replaceUmlauteAndSpaces(
							doc.url.replace(
								'https://wunda-geoportal-docs.cismet.de/',
								tileservice
							) + '/{z}/{x}/{y}.png'
						),
						meta: replaceUmlauteAndSpaces(
							doc.url.replace(
								'https://wunda-geoportal-docs.cismet.de/',
								tileservice
							) + '/meta.json'
						)
					});
				}
				for (const doc of bplan.plaene_nrk) {
					docs.push({
						group: 'nicht_rechtskraeftig',
						file: doc.file,
						url: doc.url.replace(
							'https://wunda-geoportal-docs.cismet.de/',
							'https://wunda-geoportal-docs.cismet.de/'
						),

						layer: replaceUmlauteAndSpaces(
							doc.url.replace(
								'https://wunda-geoportal-docs.cismet.de/',
								tileservice
							) + '/{z}/{x}/{y}.png'
						),
						meta: replaceUmlauteAndSpaces(
							doc.url.replace(
								'https://wunda-geoportal-docs.cismet.de/',
								tileservice
							) + '/meta.json'
						)
					});
				}
				for (const doc of bplan.docs) {
					docs.push({
						group: 'Zusatzdokumente',
						file: doc.file,
						url: doc.url.replace(
							'https://wunda-geoportal-docs.cismet.de/',
							'https://wunda-geoportal-docs.cismet.de/'
						),
						hideInDocViewer: doc.hideInDocViewer,
						layer: replaceUmlauteAndSpaces(
							doc.url.replace(
								'https://wunda-geoportal-docs.cismet.de/',
								tileservice
							) + '/{z}/{x}/{y}.png'
						),

						meta: replaceUmlauteAndSpaces(
							doc.url.replace(
								'https://wunda-geoportal-docs.cismet.de/',
								tileservice
							) + '/meta.json'
						)
					});
				}
				console.log('docs', docs);

				docsActions.setDocsInformation(docs, () => {
					docsActions.setViewerTitle(title);

					docsActions.finished(docPackageIdParam, docIndex, pageIndex, () => {
						setTimeout(() => {
							if (
								true ||
								(dox && dox.docs && dox.docs[docIndex] && dox.docs[docIndex].meta)
							) {
								gotoWholeDocument();
							} else {
							}
						}, 100);
					});
				});
			}
		}
	);
}

function replaceUmlauteAndSpaces(str) {
	const umlautMap = {
		Ü: 'UE',
		Ä: 'AE',
		Ö: 'OE',
		ü: 'ue',
		ä: 'ae',
		ö: 'oe',
		ß: 'ss',
		' ': '_'
	};
	let ret = str
		.replace(/[\u00dc|\u00c4|\u00d6][a-z]/g, (a) => {
			var big = umlautMap[a.slice(0, 1)];
			return big.charAt(0) + big.charAt(1) + a.slice(1);
		})
		.replace(
			new RegExp('[' + Object.keys(umlautMap).join('|') + ']', 'g'),
			(a) => umlautMap[a]
		);
	// console.log('in', str);
	// console.log('out', ret);
	return ret;
}
