import React from "react";
import { Accordion, Panel } from "react-bootstrap";

const GenericModalMenuSection=({
  sectionKey,
  sectionTitle,
  sectionBsStyle,
  sectionContent,
  uiState,uiStateActions
})=> {
    return (
      <Accordion  
      key={sectionKey}
      defaultActiveKey={uiState.applicationMenuActiveKey || sectionKey}
      onSelect={() => {
        if (uiState.applicationMenuActiveKey === sectionKey) {
          uiStateActions.setApplicationMenuActiveKey("none");
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
}
export default GenericModalMenuSection;