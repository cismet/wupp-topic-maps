import React from 'react';
import GenericModalMenuSection from 'components/commons/GenericModalMenuSection';
import MyLocation from 'components/commons/GenericHelpTextForMyLocation';

const Component = ({ uiState, uiStateActions }) => {
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey='standort'
			sectionTitle='Mein Standort'
			sectionBsStyle='success'
			sectionContent={<MyLocation />}
		/>
	);
};
export default Component;
