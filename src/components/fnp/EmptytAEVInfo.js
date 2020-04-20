import Icon from 'components/commons/Icon';
import React from 'react';
import CollapsibleABWell from 'components/commons/CollapsibleABWell';
import InfoBoxHeader from 'components/commons/InfoBoxHeader';

/* eslint-disable jsx-a11y/anchor-is-valid */

// Since this component is simple and static, there's no parent container for it.
const Comp = ({ collapsed, setCollapsed, showApplicationMenu }) => {
	let divWhenLarge = (
		<div>
			<a
				href={`/#/docs/static/FNP.Legende.und.Dokumente`}
				target='_fnp'
				style={{ color: '#333', float: 'right', paddingLeft: '15px' }}
			>
				<h4
					style={{
						marginLeft: 5,
						marginRight: 5,
						paddingTop: '0px',
						marginTop: '0px',
						marginBottom: '4px',
						textAlign: 'center'
					}}
				>
					{/* <OverlayTrigger placement='left' overlay={'legende '}> */}
					<font size='28'>
						<Icon style={{ textDecoration: 'none' }} name='file-pdf-o' />
					</font>

					{/* </OverlayTrigger> */}
				</h4>
				{/* <OverlayTrigger placement='left' overlay={planTooltip}> */}
				<strong>Legende</strong>
				{/* </OverlayTrigger> */}
			</a>
			<h4>Hinweise | Legende </h4>
			<p>
				für ein Änderungsverfahren (ÄV) Doppelklick auf Geltungsbereich |{' '}
				<Icon name='search' /> für alle ÄV im Kartenausschnitt | ÄV-Nummer im Suchfeld
				eingeben und Auswahl <Icon name='file' overlay='F' marginRight='2px' />aus
				Vorschlagsliste | zurück mit Doppelklick außerhalb eines ÄV{' '}
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
								padding: '5px',
								maxWidth: '160px',
								overflowWrap: 'break-word'
							}}
						>
							<h4>Legende und Dokumente</h4>
						</td>
						<td
							style={{
								textAlign: 'center',
								verticalAlign: 'center',
								padding: '5px',
								paddingTop: '1px'
							}}
						>
							<a
								href={`/#/docs/static/FNP.Legende.und.Dokumente`}
								target='_fnp'
								style={{ color: '#333' }}
							>
								<h4 style={{ marginLeft: 5, marginRight: 5 }}>
									{/* <OverlayTrigger placement='left' overlay={'legende '}> */}
									<Icon
										style={{ textDecoration: 'none', fontSize: 26 }}
										name='file-pdf-o'
									/>
									{/* </OverlayTrigger> */}
								</h4>
							</a>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);

	return (
		<div pixelwidth={350}>
			<InfoBoxHeader content='FNP vom 17.01.2005' />
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
