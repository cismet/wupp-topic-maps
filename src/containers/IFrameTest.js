import React, { useEffect } from 'react';
/* eslint-disable jsx-a11y/anchor-is-valid */

// Since this component is simple and static, there's no parent container for it.

const Comp = () => {
	const hashChange = (event) => {
		console.log('hashChange', window.location.hash);
		console.log('hashChange event', event);
		let parts = event.oldURL.split('#');
		parts.shift();
		const oldHash = parts.join('#');
		console.log('hashChange oldHash', oldHash);

		var hash = window.location.hash;

		var keyword = 'rc';
		if (hash.includes(keyword + '=')) {
			var topicMapUrl = 'http://localhost:3000/';
			var targetUrl = hash.substring(
				hash.indexOf('rc=[') + keyword.length + 2,
				hash.indexOf(']')
			);
			console.log('targetUrl', targetUrl);
			window.location.hash = oldHash;
			document.getElementsByClassName('SP-Iframe__main')[0].contentWindow.postMessage(
				{
					type: 'topicMap.RC',
					payload: targetUrl
				},
				topicMapUrl
			);
		}
	};

	useEffect(() => {
		window.onhashchange = hashChange;
	}, []);
	return (
		<div style={{ margin: '100px' }}>
			<h2 className='alt-header'>iFrame</h2>
			<p>
				<iframe
					title='test'
					src='http://localhost:3000/#/bplaene?allowRemoteControl=true&lat=51.26956716943953&lng=7.186829522224084&zoom=8'
					className='SP-Iframe__main'
					allowfullscreen=''
					style={{ height: '512px', width: '868px' }}
				/>
			</p>
			<div id='rahmen'>
				<p>
					<b>Testlinks (alle ohne Javascript):</b>
				</p>
				<ul>
					<li>
						<a href='#/iframetest?rc=[/baeder?lat=51.25878089628889&lng=7.150964121656309&zoom=8]'>
							>{' '}
							{
								'#/iframetest?rc=[/baeder?lat=51.25878089628889&lng=7.150964121656309&zoom=8]'
							}
						</a>
					</li>
					<li>
						<a href='#/iframetest?rc=[/baeder?lat=51.292918048461644&lng=7.232064588282959&zoom=13]'>
							> Freibad Mählersbeck
						</a>{' '}
					</li>
					<li>
						<a href='#/iframetest?rc=[/bplaene?nr=892]'>
							> Bebauungsplan 892 - Steinweg / Alter Markt - 3. Änderung
						</a>{' '}
					</li>
					<li>
						<a href='#/iframetest?rc=[/bplaene?nr=1155]'>
							> Bebauungsplan 1155 - Berliner Straße / Bredde
						</a>{' '}
					</li>
					<li>
						<a href='#/iframetest?rc=[/fnp/rechtsplan?aev=114]'>
							> 114. Änderung des Flächennutzungsplanes - Bahnhof Heubruch
						</a>{' '}
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Comp;
