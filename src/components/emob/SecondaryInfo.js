import Icon from 'components/commons/Icon';
import PropTypes from 'prop-types';
import React from 'react';
import { Accordion, Button, Modal, Panel, Table } from 'react-bootstrap';
import CismetFooterAcks from '../commons/CismetFooterAcknowledgements';
import GenericRVRStadtplanwerkMenuFooter from '../commons/GenericRVRStadtplanwerkMenuFooter';
import IconLink from '../commons/IconLink';
import { getConnectorImageUrl } from '../../utils/emobHelper';
const Comp = ({ visible, feature, setVisibleState, uiHeight }) => {
	const close = () => {
		setVisibleState(false);
	};

	const modalBodyStyle = {
		overflowY: 'auto',
		overflowX: 'hidden',
		maxHeight: uiHeight - 200
	};
	const ladestation = feature.properties;
	let foto;
	if (ladestation.foto !== undefined) {
		foto = 'https://www.wuppertal.de/geoportal/emobil/autos/fotos/' + ladestation.foto;
	}
	let iconName = 'charging-station';

	let steckerverbindungenArr = [];
	let steckerverbindungenTableArr = [];
	if (ladestation.steckerverbindungen && ladestation.steckerverbindungen.length > 0) {
		ladestation.steckerverbindungen.forEach((v, index) => {
			steckerverbindungenArr.push(
				`${v.anzahl} x ${v.steckdosentyp} (${v.leistung}kW,${v.strom}A,${v.spannung}V)`
			);
			for (let i = 0; i < v.anzahl; ++i) {
				let imageUrl = getConnectorImageUrl(v.steckdosentyp);
				let image;
				if (imageUrl) {
					image = <img alt={v.steckdosentyp} src={imageUrl} width='50' />;
				} else {
					image = <Icon name='question' style={{ fontSize: 50 }} />;
				}
				steckerverbindungenTableArr.push(
					//`${v.anzahl} x ${v.steckdosentyp} (${v.leistung}kW,${v.strom}A,${v.spannung}V)`
					<tr key={index + '.' + i}>
						<td
							style={{
								verticalAlign: 'middle',
								textAlign: 'center'
							}}
						>
							{image}
						</td>
						<td style={{ verticalAlign: 'middle' }}>{v.steckdosentyp}</td>
						<td style={{ verticalAlign: 'middle' }}>
							{v.leistung}kW ({v.strom}A, {v.spannung}V)
						</td>
					</tr>
				);
			}
		});
	}
	let links = [];
	if (ladestation.betreiber.telefon) {
		links.push(
			<IconLink
				key={`IconLink.tel`}
				tooltip='Betreiber Anrufen'
				href={'tel:' + ladestation.betreiber.telefon}
				iconname='phone'
			/>
		);
	}
	if (ladestation.betreiber.email) {
		links.push(
			<IconLink
				key={`IconLink.email`}
				tooltip='E-Mail an Betreiber schreiben'
				href={'mailto:' + ladestation.betreiber.email}
				iconname='envelope-square'
			/>
		);
	}
	if (ladestation.betreiber.homepage) {
		links.push(
			<IconLink
				key={`IconLink.web`}
				tooltip='Betreiberwebseite'
				href={ladestation.betreiber.homepage}
				target='_blank'
				iconname='external-link-square'
			/>
		);
	}
	return (
		<Modal
			style={{
				zIndex: 2900000000
			}}
			height='100%'
			bsSize='large'
			show={visible}
			onHide={close}
			keyboard={false}
		>
			<Modal.Header>
				<Modal.Title>
					<Icon name={iconName} /> {`Datenblatt: Ladestation ${ladestation.name}`}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body style={modalBodyStyle} id='myMenu' key={'prbr.secondaryInfo'}>
				<div style={{ width: '100%', minHeight: 250 }}>
					{foto !== undefined && (
						<img
							alt='Bild'
							style={{
								paddingLeft: 10,
								paddingRight: 10,
								float: 'right',
								paddingBottom: '5px'
							}}
							src={foto}
							width='250'
						/>
					)}
					<div style={{ fontSize: '115%', padding: '10px', paddingTop: '0px' }}>
						<div>
							<b>Adresse:</b>
						</div>
						<div>
							{ladestation.strasse} {ladestation.hausnummer}
						</div>
						<br />
						<div>{ladestation.detailbeschreibung}</div>
						<div> {ladestation.zusatzinfo}</div>
						<br />
						<div>
							<b>Öffnungszeiten:</b> {ladestation.oeffnungszeiten}
						</div>
					</div>
				</div>
				<Accordion key={'1'} name={'1'} style={{ marginBottom: 6 }} defaultActiveKey={'1'}>
					<Panel
						header={
							ladestation.online === true ? (
								'Lademöglichkeit verfügbar (online)'
							) : (
								'Lademöglichkeit momentan nicht verfügbar (offline)'
							)
						}
						eventKey={'1'}
						bsStyle={ladestation.online === true ? 'info' : 'default'}
					>
						<div>
							<b>Ladeplätze:</b> {ladestation.ladeplaetze}
						</div>
						<div>
							{/* <b>Steckerverbindungen:</b> {steckerverbindungen} */}
							<b>Steckerverbindungen:</b>
							<Table striped bordered condensed hover style={{ marginTop: 8 }}>
								<tbody>{steckerverbindungenTableArr}</tbody>
							</Table>
							<div style={{ textAlign: 'right' }}>
								<a
									href='https://github.com/cismet/wupp-topic-maps/blob/feature/039-winter-2019-dev-sprint/public/images/emob/'
									target='_license'
								>
									Bildnachweis
								</a>
							</div>
						</div>
						<div>
							<b>Strom:</b> {ladestation.stromart}
						</div>
						<div>
							<b>Schnellladestation:</b>{' '}
							{ladestation.schnellladestation === true ? 'Ja' : 'Nein'}
						</div>
					</Panel>
				</Accordion>
				<Accordion key={'2'} name={'2'} style={{ marginBottom: 6 }} defaultActiveKey={'2'}>
					<Panel header={'Bezahlen'} eventKey={'2'} bsStyle={'warning'}>
						<div>
							<b>Authentifizierung:</b> {ladestation.authentifizierung.join(' / ')}
						</div>
						<div>
							<b>Ladekosten:</b>{' '}
							{ladestation.ladekosten.startsWith('http') ? (
								<a href={ladestation.ladekosten} target='_ladekosten'>
									in anderem Fenster anschauen
								</a>
							) : (
								ladestation.ladekosten
							)}
						</div>
						<div>
							<b>Parkgebühr:</b> {ladestation.parkgebuehr}
						</div>
					</Panel>
				</Accordion>

				<Accordion key={'3'} name={'3'} style={{ marginBottom: 6 }} defaultActiveKey={'3'}>
					<Panel header={'Betreiber'} eventKey={'3'} bsStyle={'success'}>
						<div
							style={{
								paddingLeft: 10,
								paddingRight: 10,
								float: 'right',
								paddingBottom: '5px'
							}}
						>
							{links}
						</div>
						<div>{ladestation.betreiber.name}</div>
						<div>
							{ladestation.betreiber.strasse} {ladestation.betreiber.hausnummer}
						</div>
						<div>
							{ladestation.betreiber.plz} {ladestation.betreiber.ort}
						</div>
						<br />
					</Panel>
				</Accordion>
			</Modal.Body>
			<Modal.Footer>
				<table
					style={{
						width: '100%'
					}}
				>
					<tbody>
						<tr>
							<td
								style={{
									textAlign: 'left',
									verticalAlign: 'bottom',
									paddingRight: '30px'
								}}
							>
								<div>
									<span style={{ fontSize: '11px' }}>
										<CismetFooterAcks />
									</span>
								</div>
							</td>
							<td>
								<Button
									id='cmdCloseModalApplicationMenu'
									bsStyle='primary'
									type='submit'
									onClick={close}
								>
									Ok
								</Button>
							</td>
						</tr>
					</tbody>
				</table>
			</Modal.Footer>
		</Modal>
	);
};

export default Comp;
Comp.propTypes = {
	menuIcon: PropTypes.string,
	menuTitle: PropTypes.string,
	menuIntroduction: PropTypes.object,
	menuSections: PropTypes.array,
	menuFooter: PropTypes.object,

	uiStateActions: PropTypes.object,
	uiState: PropTypes.object,
	kitasState: PropTypes.object,
	kitasActions: PropTypes.object,
	mappingState: PropTypes.object,
	mappingActions: PropTypes.object
};

Comp.defaultProps = {
	menuIcon: 'bars',
	menuTitle: 'Einstellungen und Hilfe',
	menuSections: [],
	menuFooter: <GenericRVRStadtplanwerkMenuFooter />
};
