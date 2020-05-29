import { faLeaf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { ControlLabel, FormGroup, Radio } from 'react-bootstrap';

// Since this component is simple and static, there's no parent container for it.
const Comp = ({ filter, setFilter }) => {
	return (
		<div>
			<FormGroup>
				<ControlLabel>
					Ladestation - Ökostrom
					{'  '}
					<FontAwesomeIcon
						icon={faLeaf}
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
							key={'filter.emob.green.only'}
							onClick={(e) => {
								const f = JSON.parse(JSON.stringify(filter));
								f.gruener_strom = e.target.checked;
								setFilter(f);
							}}
							checked={filter.gruener_strom === true}
							inline
						>
							nur Ökostrom-Ladestationen
						</Radio>
					</div>
					<div>
						<Radio
							disabled={!filter.stationsart.includes('Ladestation')}
							readOnly={true}
							key={'filter.emob.green.all'}
							onClick={(e) => {
								const f = JSON.parse(JSON.stringify(filter));
								f.gruener_strom = !e.target.checked;
								setFilter(f);
							}}
							checked={filter.gruener_strom === false}
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
