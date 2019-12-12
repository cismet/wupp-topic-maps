import React from 'react';

import Icon from 'components/commons/Icon';
import { FormGroup, Checkbox, Radio, ControlLabel, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faParking, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

import OnlineFC from './filtercontrols/Online';
import OeffnungszeitenFC from './filtercontrols/Oeffnungszeiten';
import SteckerFC from './filtercontrols/Stecker';
import GruenerStromFC from './filtercontrols/GruenerStrom';
import SchnelladerFC from './filtercontrols/Schnellader';

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
							<OnlineFC filter={filter} setFilter={setFilter} />
							<OeffnungszeitenFC filter={filter} setFilter={setFilter} />
							<SteckerFC filter={filter} setFilter={setFilter} />
							<GruenerStromFC filter={filter} setFilter={setFilter} />
							<SchnelladerFC filter={filter} setFilter={setFilter} />

							<p>
								<Button
									bsSize='small'
									onClick={() => {
										setFilter({
											nur_online: false,
											oeffnungszeiten: '*',
											stecker: [
												'Schuko',
												'Typ 2',
												'CHAdeMO',
												'CCS',
												'Tesla Supercharger',
												'Drehstrom'
											],
											nur_gruener_strom: false,
											nur_schnelllader: false
										});
									}}
								>
									Filter zurücksetzen (alle Anlagen anzeigen)
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
