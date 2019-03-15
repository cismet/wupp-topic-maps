import React from 'react';
import GenericModalMenuSection from '../commons/GenericModalMenuSection';
import MyLocation from '../commons/GenericHelpTextForMyLocation';

const Component = ({ uiState, uiStateActions }) => {
  return (
    <GenericModalMenuSection
      uiState={uiState}
      uiStateActions={uiStateActions}
      sectionKey="standort"
      sectionTitle="Mein Standort"
      sectionBsStyle="warning"
      sectionContent={<MyLocation />}
    />
  );
};
export default Component;
