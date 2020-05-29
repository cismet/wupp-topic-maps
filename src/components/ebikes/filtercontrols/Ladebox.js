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
					Ladestation - Ladebox vorhanden
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
							key={'filter.ebikes.ladebox_zu.only'}
							onClick={(e) => {
								const f = JSON.parse(JSON.stringify(filter));
								f.ladebox_zu = e.target.checked;
								setFilter(f);
							}}
							checked={filter.ladebox_zu === true}
							inline
						>
							nur Ladestationen mit Ladeboxen
						</Radio>
					</div>
					<div>
						<Radio
							disabled={!filter.stationsart.includes('Ladestation')}
							readOnly={true}
							key={'filter.ebikes.ladebox_zu.all'}
							onClick={(e) => {
								const f = JSON.parse(JSON.stringify(filter));
								f.ladebox_zu = !e.target.checked;
								setFilter(f);
							}}
							checked={filter.ladebox_zu === false}
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
