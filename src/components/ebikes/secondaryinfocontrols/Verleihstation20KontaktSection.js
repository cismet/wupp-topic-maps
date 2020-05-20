import PropTypes from 'prop-types';
import React from 'react';
import GenericSecondaryInfoPanelSection from 'components/commons/GenericSecondaryInfoPanelSection';

const Comp = ({ station, links }) => {
	return (
		<GenericSecondaryInfoPanelSection
			header='Kontakt'
			bsStyle='success'
			content={
				<div>
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
					<div>{station.standort}</div>
					<div>
						{station.strasse}
						{station.hausnummer !== undefined ? ', ' + station.hausnummer : ''}
					</div>
				</div>
			}
		/>
	);
};

export default Comp;
