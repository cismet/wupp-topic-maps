import React from 'react';
import { Button } from 'react-bootstrap';
import GruenerStromFC from './filtercontrols/GruenerStrom';
import OeffnungszeitenFC from './filtercontrols/Oeffnungszeiten';
import OnlineFC from './filtercontrols/Online';
import TypFC from './filtercontrols/Typ';
import LadeboxFC from './filtercontrols/Ladebox';
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
							<TypFC filter={filter} setFilter={setFilter} />
							<OnlineFC filter={filter} setFilter={setFilter} />
							<OeffnungszeitenFC filter={filter} setFilter={setFilter} />
							<GruenerStromFC filter={filter} setFilter={setFilter} />
							<LadeboxFC filter={filter} setFilter={setFilter} />

							<p>
								<Button
									bsSize='small'
									onClick={() => {
										setFilter({
											stationsart: [ 'Ladestation', 'Verleihstation' ],
											nur_online: false,
											immer_offen: false,
											gruener_strom: false,
											ladebox: false
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
