import { actions as bplanActions } from '../redux/modules/bplaene';
import { actions as DocsActions } from '../redux/modules/docs';
const tileservice = 'https://aaa.cismet.de/tiles/';

export function getDocsForStaticEntry(props) {
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
	let title = '-';

	let urlToGetDocsFrom = tileservice + '/static/docs/' + docPackageIdParam + '.json';
	console.log('urlToGetDocsFrom', urlToGetDocsFrom);

	fetch(urlToGetDocsFrom, {
		method: 'get',
		headers: {
			'Content-Type': 'text/plain; charset=UTF-8'
		}
	})
		.then(function(response) {
			if (response.status >= 200 && response.status < 300) {
				response.json().then(function(result) {
					console.log('docs from fetch', result);
					title = result.title;
					let docs = result.docs;
					for (let d of docs) {
						if (d.tilebase === undefined && result.tilereplacementrule !== undefined) {
							d.tilebase = d.url.replace(
								result.tilereplacementrule[0],
								result.tilereplacementrule[1]
							);
						}
						if (d.layer === undefined) {
							d.layer = d.tilebase + '/{z}/{x}/{y}.png';
						}
						if (d.meta === undefined) {
							d.meta = d.tilebase + '/meta.json';
						}

						if (d.file === undefined) {
							d.file = d.url.substring(d.url.lastIndexOf('/') + 1);
						}
					}
					console.log('docs after fetch ', docs);

					setDocs({
						docs,
						docsActions,
						title,
						docPackageIdParam,
						docIndex,
						pageIndex,
						dox,
						gotoWholeDocument
					});
				});
			} else {
				//TODO Error
			}
		})
		.catch((e) => {
			console.log(e);
		});

	//console.log('docs', JSON.stringify(docs));
}

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

	searchForAEVs({
		gazObject: [ gazHit ],
		skipMappingActions: true,
		done: (aevFeatures) => {
			if (aevFeatures === undefined || aevFeatures.length === 0) {
				console.log('::this should not happen -- race condition?');

				return;
			}
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

				if (aev.docUrls.length > 0) {
					let url =
						'https://www.wuppertal.de/geoportal/fnp_dokumente/Info_FNP-Zusatzdokumente_WUP.pdf';
					docs.push({
						group: 'Zusatzdokumente',
						title: 'Info Dateinamen',
						file: 'Info_FNP-Zusatzdokumente_WUP.pdf',
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

			setDocs({
				docs,
				docsActions,
				title,
				docPackageIdParam,
				docIndex,
				pageIndex,
				dox,
				gotoWholeDocument
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
				setDocs({
					docs,
					docsActions,
					title,
					docPackageIdParam,
					docIndex,
					pageIndex,
					dox,
					gotoWholeDocument
				});
			}
		}
	);
}

function setDocs({
	docs,
	docsActions,
	title,
	docPackageIdParam,
	docIndex,
	pageIndex,
	dox,
	gotoWholeDocument
}) {
	docsActions.setDocsInformation(docs, () => {
		docsActions.setViewerTitle(title);

		docsActions.finished(docPackageIdParam, docIndex, pageIndex, () => {
			setTimeout(() => {
				if (true || (dox && dox.docs && dox.docs[docIndex] && dox.docs[docIndex].meta)) {
					gotoWholeDocument();
				} else {
				}
			}, 100);
		});
	});
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
