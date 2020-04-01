import Icon from 'components/commons/Icon';
import PropTypes from 'prop-types';
import React from 'react';
import { OverlayTrigger, Tooltip, Well } from 'react-bootstrap';
import Color from 'color';
import CollapsibleABWell from 'components/commons/CollapsibleABWell';
import InfoBoxHeader from 'components/commons/InfoBoxHeader';

/* eslint-disable jsx-a11y/anchor-is-valid */

// Since this component is simple and static, there's no parent container for it.
const Comp = ({ collapsed, setCollapsed, showApplicationMenu }) => {
	let divWhenLarge = (
		<div>
			<h4
				style={{
					marginLeft: 5,
					marginRight: 5,
					paddingTop: '0px',
					marginTop: '0px',
					marginBottom: '4px',
					textAlign: 'center'
				}}
			/>

			<h4>Hinweise</h4>
			<p>
				Doppelklick in Karte für Auswahl einer Hauptnutzungsfläche und Anzeige der
				Flächeninformation | Flächenauswahl über Änderungsverfahren (ÄV) oder B-Plan durch
				Eingabe der ÄV- oder B-Plan-Nummer im Suchfeld und Auswahl [<Icon name='file' overlay='F' marginRight='2px' />,{' '}
				<Icon name='file' overlay='B' marginRight='2px' />] aus Vorschlagsliste{' '}
				<a onClick={() => showApplicationMenu(true)}>
					<Icon name='angle-double-right' /> Kompaktanleitung
				</a>
			</p>
		</div>
	);

	let divWhenCollapsed = (
		<div>
			<table border={0} style={{ width: '100%' }}>
				<tbody>
					<tr>
						<td
							style={{
								textAlign: 'left',
								verticalAlign: 'top',

								maxWidth: '160px',
								overflowWrap: 'break-word'
							}}
						>
							<h4>Hinweise ...</h4>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);

	return (
		<div pixelwidth={350}>
			<InfoBoxHeader content='FNP-Arbeitskarte | aktuelle Hauptnutzungen' />
			<CollapsibleABWell
				collapsed={collapsed}
				divWhenLarge={divWhenLarge}
				divWhenCollapsed={divWhenCollapsed}
				setCollapsed={(collapsed) => {
					setCollapsed(collapsed);
				}}
			/>
		</div>
	);
};

export default Comp;
