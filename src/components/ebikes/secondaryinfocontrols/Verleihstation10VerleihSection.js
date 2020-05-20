import PropTypes from 'prop-types';
import React from 'react';
import GenericSecondaryInfoPanelSection from 'components/commons/GenericSecondaryInfoPanelSection';
import { getLinkOrText } from 'utils/commonHelpers';

const Comp = ({ station }) => {
	return (
		<GenericSecondaryInfoPanelSection
			header='Verleih'
			bsStyle='info'
			content={
				<div>
					<div>
						<b>Pedelecs:</b> {station.anzahl_pedelec}
					</div>
					<div>
						<b>Speed-Pedelecs:</b> {station.anzahl_spedelec}
					</div>
					<div>
						<b>E-Bikes:</b> {station.anzahl_ebike}
					</div>
					<div>
						<b>Lastenräder:</b> {station.anzahl_lastenrad}
					</div>
					<div>
						<b>Leihgebühr:</b> {getLinkOrText(station.leihgebuehr)}
					</div>
				</div>
			}
		/>
	);
};

export default Comp;
