import 'whatwg-fetch';
import { DRPROCESSOR } from '../constants/services';

export const downloadFile = (url, success) => {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'blob';
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			if (success) success(xhr.response);
		}
	};
	xhr.send(null);
};

export const prepareMergeMultipleFiles = (mergeConf, done) => {
	fetch(DRPROCESSOR + '/api/pdfmerge/and/wait/for/status', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(mergeConf)
	})
		.then(function(response) {
			if (response.status >= 200 && response.status < 300) {
				response.json().then(function(result) {
					done({
						file: mergeConf.name + '.pdf',
						url:
							DRPROCESSOR +
							'/api/download/pdfmerge/' +
							result.id +
							'/' +
							mergeConf.name
					});
				});
			} else {
				//TODO Error
				done({
					error: ':-('
				});
			}
		})
		.catch((e) => {
			console.log(e);
			done({
				error: ':-('
			});
		});
};

export const prepareDownloadMultipleFiles = (mergeConf, done) => {
	fetch(DRPROCESSOR + '/api/zip/and/wait/for/status', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(mergeConf)
	})
		.then((response) => {
			if (response.status >= 200 && response.status < 300) {
				return response.json();
			} else {
				console.log('Error:' + response.status + ' -> ' + response.statusText);
				done({
					error: response.status + ' -> ' + response.statusText
				});
			}
		})
		.catch((e) => {
			console.log(e);
			done({
				error: ':-('
			});
		})
		.then((result) => {
			if (result && !result.error) {
				done({
					file: mergeConf.name + '.zip',
					url: DRPROCESSOR + '/api/download/zip/' + result.id + '/' + mergeConf.name
				});
			}
		});

	// downloadSingleFile({
	//     "file":mergeConf.name+".zip",
	//     "url":"https://doc-processor.cismet.de/api/download/zip/5aa1d7a18c3d220c9fb5f5e1b44814c9-196/BPLAN_Plaene_und_Zusatzdokumente.1073V"
	//     //,
	//     //"urlOrig":DRPROCESSOR+"/api/download/zip/"+result.id+"/"+mergeConf.name
	// });
	// done();
};

export const downloadSingleFile = (downloadOptions, done) => {
	try {
		console.log('downloadSingleFile:' + downloadOptions.url);
		console.log(downloadOptions);
		let link = document.createElement('a');
		document.body.appendChild(link);
		link.setAttribute('type', 'hidden');
		link.href = downloadOptions.url;
		//link.href="https://cismet.de";
		//link.download = downloadOptions.file;
		link.target = '_blank';
		link.click();
		if (done) {
			done();
		}
	} catch (err) {
		window.alert(err);
	}
};
