import React from 'react';
import GenericSecondaryInfoPanelSection from 'components/commons/GenericSecondaryInfoPanelSection';

const Comp = ({ station }) => {
	console.log('station.stecker', station.stecker);

	return (
		<GenericSecondaryInfoPanelSection
			header={
				'Lademöglichkeit ' + (station.online === true ? 'verfügbar' : 'nicht verfügbar')
			}
			bsStyle={station.online === true ? 'info' : 'default'}
			content={
				<div>
					{station.online === true ? (
						<div>
							Es kann keine Aussage darüber getroffen werden, ob die Station momentan
							besetzt ist.
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
								Es sind {station.anzahl_schliessfaecher} Schließfächer mit jeweils{' '}
								{station.anzahl_fach_steckdosen} Steckdosen vorhanden. Sie benötigen
								eine der folgenden Münzen: {station.pfand.join('€, ') + '€'}
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
									{stecker.typ} ({stecker.leistung}kW, {stecker.strom}A,{' '}
									{stecker.spannung}V){station.stecker.length - 1 === index ? (
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
		/>
	);
};

export default Comp;
