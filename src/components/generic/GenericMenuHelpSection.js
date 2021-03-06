import React from 'react';
import GenericModalMenuSection from 'components/commons/GenericModalMenuSection';
import Markdown from 'react-markdown';
/* eslint-disable jsx-a11y/anchor-is-valid */

const DemoMenuHelpSection = ({ uiState, uiStateActions, markdown, content }) => {
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey='help'
			sectionTitle='Kompaktanleitung'
			sectionBsStyle='success'
			sectionContent={content || <Markdown escapeHtml={false} source={markdown} />}
		/>
	);
};
export default DemoMenuHelpSection;
