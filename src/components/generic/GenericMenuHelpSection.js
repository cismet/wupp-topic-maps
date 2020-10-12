import React from 'react';
import GenericModalMenuSection from 'components/commons/GenericModalMenuSection';
import Markdown from 'react-markdown';
import ConfigurableDocBlocks from 'components/generic/ConfigurableDocBlocks';
/* eslint-disable jsx-a11y/anchor-is-valid */

const DemoMenuHelpSection = ({ uiState, uiStateActions, markdown, content }) => {
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey='help'
			sectionTitle='Komnpaktanleitung'
			sectionBsStyle='success'
			sectionContent={content || <Markdown escapeHtml={false} source={markdown} />}
		/>
	);
};
export default DemoMenuHelpSection;
