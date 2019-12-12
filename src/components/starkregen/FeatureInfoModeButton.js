import React from 'react';
import Icon from 'components/commons/Icon';
import { Well, Button } from 'react-bootstrap';

const Comp = ({ setFeatureInfoModeActivation }) => {
	return (
		<div
			key='featureInfoModeButton'
			style={{ marginBottom: 5, textAlign: 'right', pointerEvents: 'auto' }}
		>
			<Button
				id='cmdShowGetFeatureInfo'
				title='Maximalen Wasserstand abfragen'
				onClick={(e) => {
					e.stopPropagation();
					setFeatureInfoModeActivation(true);
				}}
			>
				<Icon name='crosshairs' />
			</Button>
		</div>
	);
};

export default Comp;
