import React from 'react';
import { Link } from 'react-router';

// Since this component is simple and static, there's no parent container for it.
const Comp = () => {
	return (
		<div style={{ margin: '100px' }}>
			<h2 className='alt-header'>Online-B-Plan-Auskunft</h2>
			<p>
				<iframe
					src='http://localhost:3000/#/bplaene'
					className='SP-Iframe__main'
					allowfullscreen=''
					title='Dieser iframe zeigt den Inhalt von https://wunda-geoportal.cismet.de/#/fnp/ an'
					style={{ height: '512px', width: '868px' }}
				/>
			</p>
			<div id='rahmen'>
				<div id='col1'>
					<p>
						<b>Aktuelle Offenlegungen:</b>
					</p>
					<ul>
						<li>
							<a
								onClick={() => {
									document.getElementsByClassName('SP-Iframe__main')[0].src =
										'http://localhost:3000/#/bplaene?gazHit=eyJzb3J0ZXIiOjE0OTcsInN0cmluZyI6IjEyNTkiLCJnbHlwaCI6ImZpbGUiLCJvdmVybGF5IjoiQiIsIngiOjM3NDE3OS41OSwieSI6NTY3NjYxMC41MywibW9yZSI6eyJ6bCI6MTgsInYiOiIxMjU5In0sInR5cGUiOiJicGxhZW5lIn0';
								}}
							>
								Bebauungsplan 1259 - Staasstraße
							</a>{' '}
							(10.06. bis 22.07.2020){' '}
							<a
								href='https://wuppertal.planoffenlegung.de/#/docs/bplaene/1259/1/1'
								target='_planoffenlegung'
							>
								📄
							</a>
						</li>

						<li>
							<a
								onClick={() => {
									document.getElementsByClassName('SP-Iframe__main')[0].src =
										'http://localhost:3000/#/bplaene?gazHit=eyJzb3J0ZXIiOjE0ODYsInN0cmluZyI6IjEyNDEiLCJnbHlwaCI6ImZpbGUiLCJvdmVybGF5IjoiQiIsIngiOjM3NDQzMy44OSwieSI6NTY4MjA2Ni4zMywibW9yZSI6eyJ6bCI6MTgsInYiOiIxMjQxIn0sInR5cGUiOiJicGxhZW5lIn0';
								}}
							>
								Bebauungsplan 1241 - Heubruch
							</a>{' '}
							(10.06. bis 22.07.2020){' '}
							<a
								href='https://wuppertal.planoffenlegung.de/#/docs/bplaene/1241/1/1'
								target='_planoffenlegung'
							>
								📄
							</a>
						</li>
					</ul>
				</div>
			</div>
			<h2 className='alt-header'>FNP-Inspektor</h2>
			<p>
				<iframe
					src='http://localhost:3000/#/fnp/rechtsplan'
					className='SP-Iframe__main'
					allowfullscreen=''
					title='Dieser iframe zeigt den Inhalt von https://wunda-geoportal.cismet.de/#/fnp/ an'
					style={{ height: '512px', width: '868px' }}
				/>
			</p>

			<div id='rahmen2'>
				<div id='col1'>
					<p>
						<b>Aktuelle Offenlegungen:</b>
					</p>
					<ul>
						<li>
							<a
								onClick={() => {
									// console.log(
									// 	'document.getElementsByClassName(',
									// 	document.getElementsByClassName('SP-Iframe__main')
									// );
									document.getElementsByClassName('SP-Iframe__main')[1].src =
										'http://localhost:3000/#/fnp/rechtsplan?gazHit=eyJzb3J0ZXIiOjE2Niwic3RyaW5nIjoiMTE0IiwiZ2x5cGgiOiJmaWxlIiwib3ZlcmxheSI6IkYiLCJ4IjozNzQ0MjkuNiwieSI6NTY4MjA1OC4wMSwibW9yZSI6eyJ6bCI6MTUsInYiOiIxMTQifSwidHlwZSI6ImFlbmRlcnVuZ3N2In0=';
								}}
							>
								114. Änderung des Flächennutzungsplanes - Bahnhof Heubruch
							</a>{' '}
							(10.06. bis 22.07.2020){' '}
							<a
								href='https://wuppertal.planoffenlegung.de/#/docs/aenderungsv/114/1/1'
								target='_planoffenlegung'
							>
								📄
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Comp;
