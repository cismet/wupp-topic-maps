import { faToggleOn } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { ControlLabel, FormGroup, Radio } from 'react-bootstrap';
// Since this component is simple and static, there's no parent container for it.
const Comp = ({ filter, setFilter }) => {
	return (
		<div>
			<FormGroup>
				<ControlLabel>
					Ladestation - Verfügbarkeit
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
							disabled={!filter.stationsart.includes('Ladestation')}
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
							nur verfügbare Ladestationen (online)
						</Radio>
					</div>
					<div>
						<Radio
							disabled={!filter.stationsart.includes('Ladestation')}
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
