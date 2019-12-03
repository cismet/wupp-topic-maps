import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { Well, Button } from 'react-bootstrap';

const Comp = ({ aevVisible = false, setAevVisible = (visible) => {}, fontSize = '40px' }) => {
	return (
		<div
			key='featureInfoModeButton'
			style={{
				marginBottom: 5,
				textAlign: 'right',
				pointerEvents: 'auto'
			}}
		>
			<Button
				id='cmdShowGetFeatureInfo'
				title='Maximalen Wasserstand abfragen'
				onClick={(e) => {
					e.stopPropagation();
					setAevVisible(!aevVisible);
				}}
				style={{
					fontSize
				}}
			>
				<FontAwesomeIcon icon={aevVisible === true ? faToggleOn : faToggleOff} />{' '}
				{aevVisible === true ? (
					'Änderungsverfahren verbergen'
				) : (
					'Änderungsverfahren anzeigen'
				)}
			</Button>
		</div>
	);
};

export default Comp;
