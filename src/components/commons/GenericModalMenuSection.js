import React from 'react';
import { Accordion, Panel } from 'react-bootstrap';

const GenericModalMenuSection = ({
  sectionKey,
  sectionTitle,
  sectionBsStyle,
  sectionContent,
  uiState,
  uiStateActions
}) => {
  return (
    <Accordion
      key={sectionKey}
      name={sectionKey}
      style={{ marginBottom: 6 }}
      defaultActiveKey={uiState.applicationMenuActiveKey || sectionKey}
      onSelect={() => {
        if (uiState.applicationMenuActiveKey === sectionKey) {
          uiStateActions.setApplicationMenuActiveKey('none');
        } else {
          uiStateActions.setApplicationMenuActiveKey(sectionKey);
        }
      }}
    >
      <Panel header={sectionTitle} eventKey={sectionKey} bsStyle={sectionBsStyle}>
        {sectionContent}
      </Panel>
    </Accordion>
  );
};
export default GenericModalMenuSection;
