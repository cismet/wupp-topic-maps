import { faPlug } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Checkbox, ControlLabel, FormGroup } from 'react-bootstrap';
// Since this component is simple and static, there's no parent container for it.

//select '['||array_to_string(array( select '"'||name||'"' from emob_steckdosentyp as x),',')||']'
const stecker = [ 'Schuko', 'Typ 2', 'CHAdeMO', 'CCS', 'Tesla Supercharger', 'Drehstrom' ];

const Comp = ({ filter, setFilter }) => {
	return (
		<div>
			<FormGroup>
				<ControlLabel>
					Steckertypen
					{'  '}
					<FontAwesomeIcon
						icon={faPlug}
						size='2x'
						style={{
							color: 'grey',
							width: '30px',
							textAlign: 'center'
						}}
					/>
				</ControlLabel>
				<div>
					{stecker.map((typ) => {
						return (
							<div>
								<Checkbox
									readOnly={true}
									key={'filter.emob.stecker.' + typ}
									onClick={(e) => {
										const f = JSON.parse(JSON.stringify(filter));
										const add = filter.stecker.indexOf(typ) === -1;

										if (add === true) {
											f.stecker.push(typ);
										} else {
											f.stecker.splice(filter.stecker.indexOf(typ), 1);
										}

										//f.stecker = e.target.checked;
										setFilter(f);
									}}
									checked={filter.stecker.indexOf(typ) !== -1}
									inline
								>
									{typ}
								</Checkbox>
							</div>
						);
					})}
				</div>
			</FormGroup>
			<br />
		</div>
	);
};

export default Comp;
