import Icon from 'components/commons/Icon';
import PropTypes from 'prop-types';
import React from 'react';
import { Accordion, Button, Modal, Panel, Table } from 'react-bootstrap';
import CismetFooterAcks from 'components/commons/CismetFooterAcknowledgements';
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
	const properties = feature.properties;
	let foto;
	if (properties.foto !== undefined) {
		foto = properties.secondaryInfos.image;
	}
	let iconName = 'charging-station';

	let steckerverbindungenArr = [];
	let steckerverbindungenTableArr = [];
	if (properties.steckerverbindungen && properties.steckerverbindungen.length > 0) {
		properties.steckerverbindungen.forEach((v, index) => {
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
	if (properties.betreiber.telefon) {
		links.push(
			<IconLink
				key={`IconLink.tel`}
				tooltip='Betreiber Anrufen'
				href={'tel:' + properties.betreiber.telefon}
				iconname='phone'
			/>
		);
	}
	if (properties.betreiber.email) {
		links.push(
			<IconLink
				key={`IconLink.email`}
				tooltip='E-Mail an Betreiber schreiben'
				href={'mailto:' + properties.betreiber.email}
				iconname='envelope-square'
			/>
		);
	}
	if (properties.betreiber.homepage) {
		links.push(
			<IconLink
				key={`IconLink.web`}
				tooltip='Betreiberwebseite'
				href={properties.betreiber.homepage}
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
					<Icon name={iconName} /> {`Datenblatt: Ladestation ${properties.name}`}
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
							{properties.strasse} {properties.hausnummer}
						</div>
						<br />
						<div>{properties.detailbeschreibung}</div>
						<div> {properties.zusatzinfo}</div>
						<br />
						<div>
							<b>Öffnungszeiten:</b>
							<p>{properties.oeffnungszeiten}</p>
						</div>
					</div>
				</div>
				<Accordion key={'1'} name={'1'} style={{ marginBottom: 6 }} defaultActiveKey={'1'}>
					<Panel
						header={
							properties.online === true ? (
								'Zapfmöglichkeit verfügbar (online)'
							) : (
								'Zapfmöglichkeit momentan nicht verfügbar (offline)'
							)
						}
						eventKey={'1'}
						bsStyle={properties.online === true ? 'info' : 'default'}
					>
						<div>
							<b>Zapfsäulen:</b> {properties.ladeplaetze}
						</div>
					</Panel>
				</Accordion>
				<Accordion key={'2'} name={'2'} style={{ marginBottom: 6 }} defaultActiveKey={'2'}>
					<Panel header={'Bezahlen'} eventKey={'2'} bsStyle={'warning'}>
						<div>
							<b>Authentifizierung:</b> {properties.authentifizierung.join(' / ')}
						</div>
						<div>
							<b>Ladekosten:</b>{' '}
							{properties.ladekosten.startsWith('http') ? (
								<a href={properties.ladekosten} target='_ladekosten'>
									in anderem Fenster anschauen
								</a>
							) : (
								properties.ladekosten
							)}
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
						<div>{properties.betreiber.name}</div>
						<div>
							{properties.betreiber.strasse} {properties.betreiber.hausnummer}
						</div>
						<div>
							{properties.betreiber.plz} {properties.betreiber.ort}
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
