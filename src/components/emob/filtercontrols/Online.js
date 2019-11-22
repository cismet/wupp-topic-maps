import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'react-fa';
import { FormGroup, ControlLabel, Radio, Checkbox } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn } from '@fortawesome/free-solid-svg-icons';
// Since this component is simple and static, there's no parent container for it.
const Comp = ({ filter, setFilter }) => {
	return (
		<div>
			<FormGroup>
				<ControlLabel>
					Verfügbarkeit
					{'  '}
					<FontAwesomeIcon
						icon={faToggleOn}
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
							key={'filter.emob.online.only'}
							onClick={(e) => {
								const f = JSON.parse(JSON.stringify(filter));
								f.nur_online = e.target.checked;
								setFilter(f);
							}}
							checked={filter.nur_online === true}
							inline
						>
							nur verfügbare Ladestationen
						</Radio>
					</div>
					<div>
						<Radio
							readOnly={true}
							key={'filter.emob.online.all'}
							onClick={(e) => {
								const f = JSON.parse(JSON.stringify(filter));
								f.nur_online = !e.target.checked;
								setFilter(f);
							}}
							checked={filter.nur_online === false}
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
