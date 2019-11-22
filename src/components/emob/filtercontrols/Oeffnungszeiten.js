import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'react-fa';
import { FormGroup, ControlLabel, Radio, Checkbox } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
// Since this component is simple and static, there's no parent container for it.
const Comp = ({ filter, setFilter }) => {
	return (
		<div>
			<FormGroup>
				<ControlLabel>
					Öffnungszeiten
					{'  '}
					<FontAwesomeIcon
						icon={faClock}
						size='2x'
						style={{
							color: 'grey',
							width: '30px',
							textAlign: 'center'
						}}
					/>
				</ControlLabel>
				<div>
					<div>
						<Radio
							readOnly={true}
							key={'filter.emob.open.24/7'}
							onClick={(e) => {
								const f = JSON.parse(JSON.stringify(filter));
								if (e.target.checked) {
									f.oeffnungszeiten = '24';
								} else {
									f.oeffnungszeiten = '*';
								}
								setFilter(f);
							}}
							checked={filter.oeffnungszeiten === '24'}
							inline
						>
							24/7
						</Radio>
					</div>
					<div>
						<Radio
							readOnly={true}
							key={'filter.emob.open.*'}
							onClick={(e) => {
								const f = JSON.parse(JSON.stringify(filter));
								if (e.target.checked) {
									f.oeffnungszeiten = '*';
								} else {
									f.oeffnungszeiten = '24';
								}
								setFilter(f);
							}}
							checked={filter.oeffnungszeiten === '*'}
							inline
						>
							alle Ladestationen
						</Radio>
					</div>
				</div>
			</FormGroup>
			<br />
		</div>
	);
};

export default Comp;
