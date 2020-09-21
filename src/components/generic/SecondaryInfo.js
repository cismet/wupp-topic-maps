import Icon from 'components/commons/Icon';
import PropTypes from 'prop-types';
import React from 'react';
import { Accordion, Button, Modal, Panel, Table } from 'react-bootstrap';
import CismetFooterAcks from 'components/commons/CismetFooterAcknowledgements';
import GenericRVRStadtplanwerkMenuFooter from '../commons/GenericRVRStadtplanwerkMenuFooter';
import IconLink from '../commons/IconLink';
import { getConnectorImageUrl } from '../../utils/emobHelper';
import { getActionLinksForFeature } from 'utils/uiHelper';
import Markdown from 'react-markdown';

const Comp = ({ visible, feature, setVisibleState, uiHeight }) => {
	const close = () => {
		setVisibleState(false);
	};

	const modalBodyStyle = {
		overflowY: 'auto',
		overflowX: 'hidden',
		maxHeight: uiHeight - 200
	};
	const properties = feature.properties.secondaryInfos;
	let foto;
	if (properties.image !== undefined) {
		foto = properties.image;
	}

	let links = getActionLinksForFeature(feature, {
		displayZoomToFeature: false,
		displaySecondaryInfoAction: false
	});

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
					<Icon name={properties.iconName} /> {properties.title}
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
						<Markdown escapeHtml={false} source={properties.md} />
					</div>
				</div>
				{properties.secondarySections.map((item, index) => {
					return (
						<Accordion
							key={index}
							name={index}
							style={{ marginBottom: 6 }}
							defaultActiveKey={index}
						>
							<Panel header={item.title} eventKey={index} bsStyle={item.type}>
								{item.links === true && (
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
								)}
								<Markdown escapeHtml={false} source={item.md} />
							</Panel>
						</Accordion>
					);
				})}
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
