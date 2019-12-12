import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/commons/Icon';
import { FormGroup, ControlLabel, Radio, Checkbox } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';

// Since this component is simple and static, there's no parent container for it.
const Comp = ({ filter, setFilter }) => {
	return (
		<div>
			<FormGroup>
				<ControlLabel>
					Ökostrom
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
							readOnly={true}
							key={'filter.emob.green.only'}
							onClick={(e) => {
								const f = JSON.parse(JSON.stringify(filter));
								f.nur_gruener_strom = e.target.checked;
								setFilter(f);
							}}
							checked={filter.nur_gruener_strom === true}
							inline
						>
							nur Ökostrom-Ladestationen
						</Radio>
					</div>
					<div>
						<Radio
							readOnly={true}
							key={'filter.emob.green.all'}
							onClick={(e) => {
								const f = JSON.parse(JSON.stringify(filter));
								f.nur_gruener_strom = !e.target.checked;
								setFilter(f);
							}}
							checked={filter.nur_gruener_strom === false}
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
