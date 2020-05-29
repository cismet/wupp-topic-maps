import React from 'react';
import GenericSecondaryInfo from 'components/commons/GenericSecondaryInfo';
import MainSection from '././Verleihstation00MainSection';
import Verleih from './Verleihstation10VerleihSection';
import Kontakt from './Verleihstation20KontaktSection';

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
			title={'Datenblatt: Verleihstation ' + station.standort}
			titleIconName='bicycle'
			mainSection={<MainSection station={station} />}
			subSections={[
				<Verleih station={station} />,
				<Kontakt station={station} links={links} />
			]}
		/>
	);
};

export default Comp;
