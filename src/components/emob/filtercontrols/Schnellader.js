import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'react-fa';
import { FormGroup, ControlLabel, Radio, Checkbox } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSuperpowers } from '@fortawesome/free-brands-svg-icons';
// Since this component is simple and static, there's no parent container for it.
const Comp = ({ filter, setFilter }) => {
	return (
		<div>
			<FormGroup>
				<ControlLabel>
					Schnelllader
					{'  '}
					<FontAwesomeIcon
						icon={faSuperpowers}
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
							key={'filter.prbr.bandr'}
							onClick={(e) => {
								const f = JSON.parse(JSON.stringify(filter));
								f.nur_schnelllader = e.target.checked;
								setFilter(f);
							}}
							checked={filter.nur_schnelllader === true}
							inline
						>
							nur Schnelllader
						</Radio>
					</div>
					<div>
						<Radio
							readOnly={true}
							key={'filter.prbr.pandr'}
							onClick={(e) => {
								const f = JSON.parse(JSON.stringify(filter));
								f.nur_schnelllader = !e.target.checked;
								setFilter(f);
							}}
							checked={filter.nur_schnelllader === false}
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