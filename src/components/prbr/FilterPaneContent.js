import React from 'react';

import { Icon } from 'react-fa';
import { FormGroup, Checkbox, Radio, ControlLabel, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faParking, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
// Since this component is simple and static, there's no parent container for it.
const Comp = ({ width, filter, setFilter, featureRenderingOption, pieChart }) => {
	let widePieChartPlaceholder = null;
	let narrowPieChartPlaceholder = null;
	if (width < 995) {
		narrowPieChartPlaceholder = (
			<div>
				<br />
				{pieChart}
			</div>
		);
	} else {
		widePieChartPlaceholder = <td>{pieChart}</td>;
	}

	let injectQueryParameter =
		'&inject=' +
		window.btoa(JSON.stringify([ { action: 'setFilterAndApply', payload: filter } ]));
	if (new URLSearchParams(window.location.href).get('getinjectorstring')) {
		console.log(injectQueryParameter);
	}
	return (
		<div>
			<table border={0} width='100%'>
				<tbody>
					<tr>
						<td valign='center' style={{ width: '330px' }}>
							<FormGroup>
								<ControlLabel>
									Umweltzone
									{'  '}
									<FontAwesomeIcon
										icon={faMinusCircle}
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
										<Checkbox
											readOnly={true}
											key={'filter.prbr.envzone.within'}
											onClick={(e) => {
												const f = JSON.parse(JSON.stringify(filter));
												f.envZoneWithin = e.target.checked;
												setFilter(f);
											}}
											checked={filter.envZoneWithin === true}
											inline
										>
											innerhalb
										</Checkbox>
									</div>
									<div>
										<Checkbox
											readOnly={true}
											key={'filter.prbr.envzone.outside'}
											onClick={(e) => {
												const f = JSON.parse(JSON.stringify(filter));
												f.envZoneOutside = e.target.checked;
												setFilter(f);
											}}
											checked={filter.envZoneOutside === true}
											inline
										>
											außerhalb
										</Checkbox>
									</div>
								</div>
							</FormGroup>
							<br />
							<FormGroup>
								<ControlLabel>
									Art der Anlage
									{'  '}
									<FontAwesomeIcon
										icon={faParking}
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
										<Checkbox
											readOnly={true}
											key={'filter.prbr.bandr'}
											onClick={(e) => {
												const f = JSON.parse(JSON.stringify(filter));
												f.bandr = e.target.checked;
												setFilter(f);
											}}
											checked={filter.bandr === true}
											inline
										>
											B+R
										</Checkbox>
									</div>
									<div>
										<Checkbox
											readOnly={true}
											key={'filter.prbr.pandr'}
											onClick={(e) => {
												const f = JSON.parse(JSON.stringify(filter));
												f.pandr = e.target.checked;
												setFilter(f);
											}}
											checked={filter.pandr === true}
											inline
										>
											P+R
										</Checkbox>
									</div>
								</div>
							</FormGroup>
							<br />
							<br />
							<p>
								<Button
									bsSize='small'
									onClick={() => {
										setFilter({
											envZoneWithin: true,
											envZoneOutside: true,
											bandr: true,
											pandr: true
										});
									}}
								>
									Filter zurücksetzen (Alle Anlagen anzeigen)
								</Button>
							</p>
						</td>
						{widePieChartPlaceholder}
					</tr>
				</tbody>
			</table>
			{narrowPieChartPlaceholder}
		</div>
	);
};

export default Comp;
