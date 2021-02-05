import React, { Component } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import StackTrace from 'stacktrace-js';
import { getTopicMapVersion as getVersion } from './constants/versions';
import store from './redux/store';
window.onerror = function(msg, file, line, col, error) {
	StackTrace.fromError(error).then((err) => {
		// StackTrace.report(
		// 	err,
		// 	`//${window.location.hostname}:${process.env.REACT_APP_LOGGER_PORT ||
		// 		3334}/jsnlog.logger`,
		// 	{
		// 		type: 'window.onerror',
		// 		url: window.location.href,
		// 		userId: window.userId,
		// 		agent: window.navigator.userAgent,
		// 		date: new Date(),
		// 		msg: msg
		// 	}
		// );
	});
};

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { error: null };
	}

	componentDidCatch(error, errorInfo) {
		this.setState({ error, errorInfo });
		StackTrace.fromError(error).then((errorStack) => {
			// StackTrace.report(
			// 	err,
			// 	`//${window.location.hostname}:${process.env.REACT_APP_LOGGER_PORT ||
			// 		3334}/jsnlog.logger`,
			// 	{
			// 		type: 'React boundary',
			// 		url: window.location.href,
			// 		userId: window.userId,
			// 		agent: window.navigator.userAgent,
			// 		date: new Date(),
			// 		msg: error.toString()
			// 	}
			// );
			this.setState({ error, errorInfo, errorStack });
		});
	}

	render() {
		if (this.state.error && this.state.errorInfo && this.state.errorStack) {
			const stringifiedStack = this.state.errorStack
				.map(function(sf) {
					return sf.toString();
				})
				.join('\n');

			const br = '\n';
			const globalState = store.getState();

			// let mailToHref =
			// 	'mailto:bugs@cismet.de?subject=Fehler%20in%20einer%20TopicMap' +
			// 	'&body=' +
			// 	encodeURI(
			// 		`Sehr geehrte Damen und Herren,${br}${br}` +
			// 			`während der Bearbeitung des Kassenzeichen ${this.state
			// 				.kassenzeichenkassenzeichennummer} ist der untenstehende Fehler passiert: ` +
			// 			`${br}${br}` +
			// 			`[Tragen Sie hier bitte ein, was Sie gemacht haben oder was Ihnen aufgefallen ist.]${br}` +
			// 			`${br}${br}` +
			// 			`Mit freundlichen Grüßen${br}` +
			// 			`${br}${br}${br}` +
			// 			`[Bitte überschreiben Sie den nachfolgenden Block mit Ihren Kontaktinformationen, damit wir ggf mit Ihnen Kontakt aufnehmen können]` +
			// 			`${br}${br}` +
			// 			`Vor- und Nachname${br}` +
			// 			`ggf E-Mail-Adresse${br}` +
			// 			`ggf. Telefonnummer${br}${br}` +
			// 			`!! Mit Absenden dieser E-Mail erkläre ich mein Einverständnis mit der zweckgebundenen Verarbeitung meiner personenbezogenen Daten gemäß der Information nach Artikel 13 bzw. Art. 14 Datenschutz-Grundverordnung (DS-GVO).` +
			// 			`${br}${br}` +
			// 			`----------------------${br}` +
			// 			`${this.state.error.message}${br}` +
			// 			`----------------------${br}` +
			// 			`${stringifiedStack}${br}` +
			// 			`----------------------${br}`
			// 	);

			let attachmentText =
				`----------------------${br}` +
				`${this.state.error.message}${br}` +
				`----------------------${br}` +
				`${stringifiedStack}${br}` +
				`----------------------${br}` +
				`${br}${br}` +
				`----------------------${br}` +
				`DATA STATE${br}` +
				`----------------------${br}` +
				`${JSON.stringify(globalState, null, 2)}${br}` +
				`----------------------${br}`;

			//render fallback UI
			return (
				<div
					style={{
						backgroundColor: 'red',
						width: '100%',
						height: '100%',
						minHeight: '100vh',
						background: "url('/images/error.jpg')",
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat'
					}}
				>
					<div
						style={{
							position: 'absolute',
							top: '0px',
							left: '0px',
							width: '100%',
							height: '250px',
							backgroundColor: 'rgba(0,0,0,0.4)'
						}}
					/>

					<div
						style={{
							position: 'absolute',
							bottom: '0px',
							left: '0px',
							width: '100%'
						}}
					>
						<div
							style={{
								fontSize: '9px',
								textAlign: 'right',
								color: 'rgba(256,256,256,0.5)',
								margin: 4
							}}
						>
							{getVersion()}
						</div>
					</div>
					<Grid>
						<Row className='show-grid'>
							<Col xs={12} md={12}>
								<h1 style={{ color: 'white' }}>
									<img alt='' width={180} src='/images/wuppertal-white.svg' />
								</h1>
								<h2 style={{ color: 'white' }}>Topic Maps - Wuppertal</h2>
								<h3 style={{ color: 'white' }}>{document.title}</h3>
								<h3 style={{ color: 'white' }}>{window.location.href}</h3>
							</Col>
						</Row>
						<Row>
							<Col xs={5} md={5}>
								<div
									style={{
										position: 'fixed',
										top: '2%',
										right: '8%'
									}}
								>
									<h4 style={{ color: 'white' }}>Stadt Wuppertal</h4>
									<h4 style={{ color: 'white' }}>
										Vermessung, Katasteramt und Geodaten
									</h4>

									<h4 style={{ color: 'white' }}>
										<a
											style={{ color: 'white' }}
											href='mailto:geodatenzentrum@stadt.wuppertal.de'
										>
											geodatenzentrum@stadt.wuppertal.de
										</a>
									</h4>
								</div>
							</Col>
						</Row>
					</Grid>
					<div style={{ margin: 25, overflow: 'auto' }}>
						<h2 style={{ color: 'white' }}>
							Es ist ein Fehler aufgetreten. Das tut uns leid. ¯\_(ツ)_/¯
						</h2>
						<h4 style={{ color: 'white' }}>
							Sie können die Entwickler unterstützen, indem Sie den Fehler an uns
							melden.
						</h4>
						<h4 style={{ color: 'white' }}>
							Bitte schicken Sie uns dazu eine Mail und fügen sie optional noch den
							Report als Anhang hinzu.
							<br />
							<br />
							<button
								style={{ backgroundColor: '#3a5e63' }}
								onClick={() => {
									var dataStr =
										'data:text/plain;charset=utf-8,' +
										encodeURIComponent(attachmentText);
									var downloadAnchorNode = document.createElement('a');
									downloadAnchorNode.setAttribute('href', dataStr);
									downloadAnchorNode.setAttribute(
										'download',
										'problemReport.topic-maps.txt'
									);
									window.document.body.appendChild(downloadAnchorNode); // required for firefox
									downloadAnchorNode.click();
									downloadAnchorNode.remove();
								}}
							>
								Problemreport erzeugen (sehr groß)
							</button>
						</h4>
						<pre style={{ backgroundColor: '#fff4', color: 'white' }}>
							{this.state.error.message}
						</pre>
						{/* <pre style={{ backgroundColor: '#fff4', color: 'white' }}>
							{this.state.error.stack}
						</pre>
						<pre style={{ backgroundColor: '#fff4', color: 'white' }}>
							{this.state.errorInfo.componentStack}
						</pre> */}
						<pre style={{ height: '80%', backgroundColor: '#fff4', color: 'white' }}>
							{stringifiedStack}
						</pre>
						{/* <button style={{ marginTop: 25 }} onClick={resetErrorBoundary}>
							Einfach nochmal probieren (hilf eigentlich nie)
						</button> */}
						<br />

						{/* <button style={{ marginTop: 25 }} onClick={resetErrorBoundary}>
					Einfach nochmal probieren (hilf eigentlich nie)
				</button> */}
					</div>
				</div>
			);
		} else {
			//when there's not an error, render children untouched
			return this.props.children;
		}
	}
}

export default ErrorBoundary;
