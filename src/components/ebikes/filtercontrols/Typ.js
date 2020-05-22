import { faBicycle, faChargingStation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { ControlLabel, FormGroup, Radio } from 'react-bootstrap';
// Since this component is simple and static, there's no parent container for it.
const Comp = ({ filter, setFilter }) => {
	return (
		<div>
			<FormGroup>
				<ControlLabel>
					Typ
					{'  '}
					<FontAwesomeIcon
						icon={faBicycle}
						size='2x'
						style={{
							color: 'grey',
							width: '30px',
							textAlign: 'center'
						}}
					/>{' '}
					<FontAwesomeIcon
						icon={faChargingStation}
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
							key={'filter.ebike.laden.only'}
							onClick={(e) => {
								const f = JSON.parse(JSON.stringify(filter));
								f.stationsart = [ 'Ladestation' ];
								setFilter(f);
							}}
							checked={
								filter.stationsart.includes('Ladestation') &&
								!filter.stationsart.includes('Verleihstation')
							}
							inline
						>
							nur Ladestationen
						</Radio>
					</div>
					<div>
						<Radio
							readOnly={true}
							key={'filter.ebike.renting.only'}
							onClick={(e) => {
								const f = JSON.parse(JSON.stringify(filter));
								f.stationsart = [ 'Verleihstation' ];
								setFilter(f);
							}}
							checked={
								filter.stationsart.includes('Verleihstation') &&
								!filter.stationsart.includes('Ladestation')
							}
							inline
						>
							nur Verleihstationen
						</Radio>
					</div>
					<div>
						<Radio
							readOnly={true}
							key={'filter.ebike.all'}
							onClick={(e) => {
								const f = JSON.parse(JSON.stringify(filter));
								f.stationsart = [ 'Ladestation', 'Verleihstation' ];
								setFilter(f);
							}}
							checked={
								filter.stationsart.includes('Ladestation') &&
								filter.stationsart.includes('Verleihstation')
							}
							inline
						>
							alle Stationen
						</Radio>
					</div>
				</div>
			</FormGroup>
			<br />
		</div>
	);
};

export default Comp;
