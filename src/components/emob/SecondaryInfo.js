import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Accordion, Panel } from 'react-bootstrap';
import { Icon } from 'react-fa';
import GenericRVRStadtplanwerkMenuFooter from '../commons/GenericRVRStadtplanwerkMenuFooter';
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';
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
	let iconName = 'battery-quarter';

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
				<Accordion key={'1'} name={'1'} style={{ marginBottom: 6 }} defaultActiveKey={'1'}>
					<Panel header={'Laden'} eventKey={'1'} bsStyle={'primary'}>
						<div>
							<b>Steckerverbindungen:</b> {ladestation.oeffnungszeiten}
						</div>
						<br />
						<br />
					</Panel>
				</Accordion>
				<Accordion key={'1'} name={'1'} style={{ marginBottom: 6 }} defaultActiveKey={'1'}>
					<Panel header={'Bezahlen'} eventKey={'1'} bsStyle={'warning'}>
						<br />
						<br />
						<br />
					</Panel>
				</Accordion>

				<Accordion key={'2'} name={'2'} style={{ marginBottom: 6 }} defaultActiveKey={'2'}>
					<Panel header={'Betreiber'} eventKey={'2'} bsStyle={'success'}>
						<p>{ladestation.betreiber.name}</p>
						<p>
							{ladestation.betreiber.strasse} {ladestation.betreiber.hausnummer}
						</p>
						<p>
							{ladestation.betreiber.plz} {ladestation.betreiber.ort}
						</p>
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
									verticalAlign: 'top',
									paddingRight: '30px'
								}}
							>
								<GenericRVRStadtplanwerkMenuFooter />
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
