import React from 'react';
import { Accordion, Panel } from 'react-bootstrap';

// Since this component is simple and static, there's no parent container for it.
const Comp = ({ header = 'Header', bsStyle = 'success', content }) => {
	return (
		<Accordion style={{ marginBottom: 6 }} defaultActiveKey={'X'}>
			<Panel header={header} eventKey={'X'} bsStyle={bsStyle}>
				{content}
			</Panel>
		</Accordion>
	);
};

export default Comp;
