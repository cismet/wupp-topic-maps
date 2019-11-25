import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Accordion, Panel } from 'react-bootstrap';
import { Icon } from 'react-fa';
import GenericRVRStadtplanwerkMenuFooter from '../commons/GenericRVRStadtplanwerkMenuFooter';
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';
import { getColorForProperties } from '../../utils/emobHelper';
import CismetFooterAcks from '../commons/CismetFooterAcknowledgements';

import IconLink from '../commons/IconLink';

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
	let steckerverbindungen: '';
	if (ladestation.foto !== undefined) {
		foto = 'https://www.wuppertal.de/geoportal/emobil/autos/fotos/' + ladestation.foto;
	}
	let iconName = 'battery-quarter';

	let steckerverbindungenArr = [];
	if (ladestation.steckerverbindungen && ladestation.steckerverbindungen.length > 0) {
		ladestation.steckerverbindungen.map((v) => {
			steckerverbindungenArr.push(
				`${v.anzahl} x ${v.steckdosentyp} (${v.leistung}kW,${v.strom}A,${v.spannung}V)`
			);
		});
		steckerverbindungen = steckerverbindungenArr.join(', ');
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
				<div style={{ width: '100%', minHeight: 150 }}>
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
							width='150'
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
						bsStyle={ladestation.online === true ? 'primary' : 'default'}
					>
						<div>
							<b>Ladeplätze:</b> {ladestation.ladeplaetze}
						</div>
						<div>
							<b>Steckerverbindungen:</b> {steckerverbindungen}
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
				<Accordion key={'1'} name={'1'} style={{ marginBottom: 6 }} defaultActiveKey={'1'}>
					<Panel header={'Bezahlen'} eventKey={'1'} bsStyle={'warning'}>
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

				<Accordion key={'2'} name={'2'} style={{ marginBottom: 6 }} defaultActiveKey={'2'}>
					<Panel header={'Betreiber'} eventKey={'2'} bsStyle={'success'}>
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