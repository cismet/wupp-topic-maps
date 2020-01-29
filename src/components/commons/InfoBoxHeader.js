import Color from 'color';
import PropTypes from 'prop-types';
import React from 'react';

// Since this component is simple and static, there's no parent container for it.
const Comp = ({ headerColor = '#928888', content }) => {
	let headerBackgroundColor = Color(headerColor);
	let textColor = 'black';
	if (headerBackgroundColor.isDark()) {
		textColor = 'white';
	}
	return (
		<table style={{ width: '100%' }}>
			<tbody>
				<tr>
					<td
						style={{
							textAlign: 'left',
							verticalAlign: 'top',
							background: headerColor,
							color: textColor,
							opacity: '0.9',
							paddingLeft: '3px',
							paddingTop: '0px',
							paddingBottom: '0px'
						}}
					>
						{content}
					</td>
				</tr>
			</tbody>
		</table>
	);
};

export default Comp;
Comp.propTypes = {
	headerColor: PropTypes.string,
	text: PropTypes.string
};
