import React from 'react';
import { Link } from 'react-scroll';
import Markdown from 'react-markdown';

const DemoMenuIntroduction = ({ uiStateActions, markdown }) => {
	return <Markdown escapeHtml={false} source={markdown} />;
};
export default DemoMenuIntroduction;
