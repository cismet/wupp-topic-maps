import React from 'react';
import GenericSecondaryInfo from 'components/commons/GenericSecondaryInfo';
import MainSection from './Ladestation00MainSection';
import Laden from './Ladestation10LademoeglichkeitSection';
import Bezahlen from './Ladestation20BezahlenSection';
import Betreiber from './Ladestation30BetreiberSection';
const Comp = ({ station, visible, uiHeight, setVisibleState, links }) => {
	return (
		<GenericSecondaryInfo
			visible={visible}
			onHide={() => {
				setVisibleState(false);
			}}
			uiHeight={uiHeight}
			imageUrl={station.foto}
			setVisibleState={setVisibleState}
			title={'Datenblatt: Ladestation ' + station.standort}
			titleIconName='charging-station'
			mainSection={<MainSection station={station} />}
			subSections={[
				<Laden station={station} />,
				<Bezahlen station={station} />,
				<Betreiber station={station} links={links} />
			]}
		/>
	);
};

export default Comp;
