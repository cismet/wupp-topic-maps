import Icon from 'components/commons/Icon';
import PropTypes from 'prop-types';
import React from 'react';
import { Accordion, Button, Modal, Panel, Table } from 'react-bootstrap';
import CismetFooterAcks from 'components/commons/CismetFooterAcknowledgements';
import GenericRVRStadtplanwerkMenuFooter from '../commons/GenericRVRStadtplanwerkMenuFooter';
import GenericSecondaryInfo from '../commons/GenericSecondaryInfo';
import GenericInfoPanelSection from '../commons/GenericInfoPanelSection';
import IconLink from '../commons/IconLink';
import { getLinksForStation } from '../../utils/ebikesHelper';
const Comp = ({ visible, uiHeight, setVisibleState, feature }) => {
	const close = () => {
		setVisibleState(false);
	};

	if (feature !== undefined) {
		const station = feature.properties;
		const links = getLinksForStation(station, {
			phone: true,
			email: true,
			web: true
		});
		if (station.typ === 'Ladestation') {
			return (
				<GenericSecondaryInfo
					visible={visible}
					onHide={close}
					uiHeight={uiHeight}
					imageUrl={station.foto}
					setVisibleState={setVisibleState}
					title={'Datenblatt: Ladestation ' + station.standort}
					titleIconName='charging-station'
					mainSection={
						<div style={{ fontSize: '115%', padding: '10px', paddingTop: '0px' }}>
							<div>
								<b>Adresse:</b>
							</div>
							<div>
								{station.strasse} {station.hausnummer || ''}
							</div>
							<br />
							<div>
								<b>Detailinformation:</b>
							</div>
							<div>{station.detailbeschreibung}</div>
							<br />
							<div>
								<b>Bemerkung:</b>
							</div>
							<div>{station.zusatzinfo}</div>
							<br />
							<div>
								<b>Öffnungszeiten:</b> {station.oeffnungszeiten}
							</div>
							<br />
							<div>
								<b>Stellplätze:</b> {station.anzahl_plaetze}
							</div>
						</div>
					}
					subSections={[
						<GenericInfoPanelSection
							header={
								'Lademöglichkeit ' +
								(station.online === true ? 'verfügbar' : 'nicht verfügbar')
							}
							bsStyle={station.online === true ? 'info' : 'default'}
							content={
								<div>
									{station.online === true ? (
										<div>
											Es kann keine Aussage darüber getroffen werden, ob die
											Station momentan besetzt ist.
										</div>
									) : (
										<div>Achtung: Diese Station ist offline.</div>
									)}
									<br />
									<div>
										<b>Ladepunkte:</b> {station.anzahl_ladepunkte}
									</div>
									<br />
									{station.ladebox_zu === true && (
										<div>
											<div>
												Es sind {station.anzahl_schliessfaecher}{' '}
												Schließfächer mit jeweils{' '}
												{station.anzahl_fach_steckdosen} Steckdosen
												vorhanden. Sie benötigen eine der folgenden Münzen:{' '}
												{station.pfand.join('€, ') + '€'}
											</div>
											<br />
										</div>
									)}
									<div>
										<b>Steckerverbindungen:</b>{' '}
										{station.stecker.map((stecker, index) => {
											return (
												<span>
													{station.stecker.length > 1 ? (
														<span>{index + 1}.: </span>
													) : (
														<span />
													)}
													{stecker.typ}, {stecker.leistung}kW,{' '}
													{stecker.strom}A, {stecker.spannung}V{station
														.stecker.length > 1 &&
													station.stecker.length - 1 === index ? (
														<span />
													) : (
														<span>, </span>
													)}
												</span>
											);
										})}
									</div>
								</div>
							}
						/>,
						<GenericInfoPanelSection
							header='Bezahlen'
							bsStyle='warning'
							content={
								<div>
									<div>
										<b>Authentifizierung:</b> {station.zugangsarten.join(',')}
									</div>
									<div>
										<b>Ladekosten:</b> {station.ladekosten}
									</div>
								</div>
							}
						/>,
						<GenericInfoPanelSection
							header={'Betreiber '}
							bsStyle='success'
							content={
								<div>
									<div
										style={{
											paddingLeft: 10,
											paddingRight: 10,
											float: 'right',
											paddingBottom: '5px'
										}}
									>
										{links}
									</div>
									<div>{station.betreiber.name}</div>
									<div>
										{station.betreiber.strasse}
										{station.betreiber.hausnummer !== undefined ? (
											', ' + station.betreiber.hausnummer
										) : (
											''
										)}
									</div>
									<div>
										{station.betreiber.plz} {station.betreiber.ort}
									</div>
									<div>{station.betreiber.bemerkung}</div>
								</div>
							}
						/>
					]}
				/>
			);
		} else {
			//typ==="Verleihstation"

			return (
				<GenericSecondaryInfo
					visible={visible}
					uiHeight={uiHeight}
					onHide={close}
					imageUrl={station.foto}
					setVisibleState={setVisibleState}
					title={'Datenblatt: Verleihstation ' + station.standort}
					titleIconName='bicycle'
				/>
			);
		}
	}
};

export default Comp;
