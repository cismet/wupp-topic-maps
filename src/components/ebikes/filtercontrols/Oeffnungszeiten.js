import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { ControlLabel, FormGroup, Radio } from 'react-bootstrap';
// Since this component is simple and static, there's no parent container for it.
const Comp = ({ filter, setFilter }) => {
	return (
		<div>
			<FormGroup>
				<ControlLabel>
					Ladestation - Öffnungszeiten
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
							disabled={!filter.stationsart.includes('Ladestation')}
							readOnly={true}
							key={'filter.ebikes.open.24/7'}
							onClick={(e) => {
								const f = JSON.parse(JSON.stringify(filter));
								if (e.target.checked) {
									f.immer_offen = true;
								} else {
									f.immer_offen = false;
								}
								setFilter(f);
							}}
							checked={filter.immer_offen === true}
							inline
						>
							24/7
						</Radio>
					</div>
					<div>
						<Radio
							disabled={!filter.stationsart.includes('Ladestation')}
							readOnly={true}
							key={'filter.ebikes.open.*'}
							onClick={(e) => {
								const f = JSON.parse(JSON.stringify(filter));
								if (e.target.checked) {
									f.immer_offen = false;
								} else {
									f.immer_offen = true;
								}
								setFilter(f);
							}}
							checked={filter.immer_offen === false}
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
