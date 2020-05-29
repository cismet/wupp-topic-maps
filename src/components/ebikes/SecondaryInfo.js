import React from 'react';
import { getLinksForStation } from '../../utils/ebikesHelper';
import LadestationInfo from './secondaryinfocontrols/Ladestation';
import VerleihstationInfo from './secondaryinfocontrols/Verleihstation';
const Comp = (props) => {
	//{ visible, uiHeight, setVisibleState, feature }
	//decomposition only of feature. the rest is given to the subcomponents with {...props}
	const { feature } = props;

	if (feature !== undefined) {
		const station = feature.properties;
		const links = getLinksForStation(station, {
			phone: true,
			email: true,
			web: true
		});
		if (station.typ === 'Ladestation') {
			return <LadestationInfo {...props} station={station} links={links} />;
		} else {
			//typ==="Verleihstation"
			return <VerleihstationInfo {...props} station={station} links={links} />;
		}
	}
};

export default Comp;
