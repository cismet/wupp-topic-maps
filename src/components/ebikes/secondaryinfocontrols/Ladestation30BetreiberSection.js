import PropTypes from 'prop-types';
import React from 'react';
import GenericSecondaryInfoPanelSection from 'components/commons/GenericSecondaryInfoPanelSection';

const Comp = ({ station, links }) => {
	return (
		<GenericSecondaryInfoPanelSection
			header={'Betreiber '}
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
					<div>{station.betreiber.name}</div>
					<div>
						{station.betreiber.strasse}
						{station.betreiber.hausnummer !== undefined ? (
							', ' + station.betreiber.hausnummer
						) : (
							''
						)}
					</div>
					<div>
						{station.betreiber.plz} {station.betreiber.ort}
					</div>
					<div>{station.betreiber.bemerkung}</div>
				</div>
			}
		/>
	);
};

export default Comp;
