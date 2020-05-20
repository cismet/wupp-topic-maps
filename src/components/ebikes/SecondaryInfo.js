import Icon from 'components/commons/Icon';
import PropTypes from 'prop-types';
import React from 'react';
import { Accordion, Button, Modal, Panel, Table } from 'react-bootstrap';
import CismetFooterAcks from 'components/commons/CismetFooterAcknowledgements';
import GenericRVRStadtplanwerkMenuFooter from '../commons/GenericRVRStadtplanwerkMenuFooter';
import GenericSecondaryInfo from '../commons/GenericSecondaryInfo';
import GenericInfoPanelSection from '../commons/GenericSecondaryInfoPanelSection';
import IconLink from '../commons/IconLink';
import { getLinksForStation } from '../../utils/ebikesHelper';
import LadestationInfo from './secondaryinfocontrols/Ladestation';
import VerleihstationInfo from './secondaryinfocontrols/Verleihstation';
const Comp = (props) => {
	const { visible, uiHeight, setVisibleState, feature } = props;

	if (feature !== undefined) {
		const station = feature.properties;
		const links = getLinksForStation(station, {
			phone: true,
			email: true,
			web: true
		});
		if (station.typ === 'Ladestation') {
			return <LadestationInfo {...props} station={station} links={links} />;
		} else {
			//typ==="Verleihstation"

			return <VerleihstationInfo {...props} station={station} links={links} />;
			return (
				<GenericSecondaryInfo
					visible={visible}
					uiHeight={uiHeight}
					onHide={() => {
						setVisibleState(false);
					}}
					imageUrl={station.foto}
					setVisibleState={setVisibleState}
					title={'Datenblatt: Verleihstation ' + station.standort}
					titleIconName='bicycle'
				/>
			);
		}
	}
};

export default Comp;
