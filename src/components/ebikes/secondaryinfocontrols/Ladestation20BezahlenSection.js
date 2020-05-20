import PropTypes from 'prop-types';
import React from 'react';
import GenericSecondaryInfoPanelSection from 'components/commons/GenericSecondaryInfoPanelSection';
import { getLinkOrText } from 'utils/commonHelpers';

const Comp = ({ station }) => {
	return (
		<GenericSecondaryInfoPanelSection
			header='Bezahlen'
			bsStyle='warning'
			content={
				<div>
					<div>
						<b>Authentifizierung:</b> {station.zugangsarten.join(',')}
					</div>
					<div>
						<b>Ladekosten:</b> {getLinkOrText(station.ladekosten)}
					</div>
				</div>
			}
		/>
	);
};

export default Comp;
