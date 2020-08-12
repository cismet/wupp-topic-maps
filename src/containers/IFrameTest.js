import React, { useEffect } from 'react';
/* eslint-disable jsx-a11y/anchor-is-valid */

// Since this component is simple and static, there's no parent container for it.

const Comp = () => {
	const hashChange = () => {
		console.log('hashChange', window.location.hash);

		var hash = window.location.hash;
		var keyword = 'rc';
		var topicMapUrl = 'http://localhost:3000/';
		var targetUrl = hash.substring(
			hash.indexOf('rc=[') + keyword.length + 2,
			hash.indexOf(']')
		);
		console.log('targetUrl', targetUrl);
		document.getElementsByClassName('SP-Iframe__main')[0].contentWindow.postMessage(
			{
				type: 'topicMap.RC',
				payload: targetUrl
			},
			topicMapUrl
		);
	};

	useEffect(() => {
		window.onhashchange = hashChange;
	}, []);
	return (
		<div style={{ margin: '100px' }}>
			<h2 className='alt-header'>iFrame</h2>
			<p>
				<iframe
					src='http://localhost:3000/#/bplaene?allowRemoteControl=true'
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
						<a href='#/iframetest?rc=[/bplaene?gazHit=eyJzb3J0ZXIiOjE5ODksInN0cmluZyI6Ijg5MiIsImdseXBoIjoiZmlsZSIsIm92ZXJsYXkiOiJCIiwieCI6Mzc0MTk4LjQxLCJ5Ijo1NjgxNDczLjc1LCJtb3JlIjp7InpsIjoxOCwidiI6Ijg5MiJ9LCJ0eXBlIjoiYnBsYWVuZSJ9]'>
							> Bebauungsplan 892 - Steinweg / Alter Markt - 3. Änderung
						</a>{' '}
					</li>
					<li>
						<a href='#/iframetest?rc=[/bplaene?gazHit=eyJzb3J0ZXIiOjE0MDUsInN0cmluZyI6IjExNTUiLCJnbHlwaCI6ImZpbGUiLCJvdmVybGF5IjoiQiIsIngiOjM3NTAzMi42LCJ5Ijo1NjgxOTIxLjE5LCJtb3JlIjp7InpsIjoxOCwidiI6IjExNTUifSwidHlwZSI6ImJwbGFlbmUifQ==]'>
							> Bebauungsplan 1155 - Berliner Straße / Bredde
						</a>{' '}
					</li>
					<li>
						<a href='#/iframetest?rc=[/fnp/rechtsplan?gazHit=eyJzb3J0ZXIiOjE2Niwic3RyaW5nIjoiMTE0IiwiZ2x5cGgiOiJmaWxlIiwib3ZlcmxheSI6IkYiLCJ4IjozNzQ0MjkuNiwieSI6NTY4MjA1OC4wMSwibW9yZSI6eyJ6bCI6MTUsInYiOiIxMTQifSwidHlwZSI6ImFlbmRlcnVuZ3N2In0=]'>
							> 114. Änderung des Flächennutzungsplanes - Bahnhof Heubruch
						</a>{' '}
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Comp;
