import React from 'react';
import PropTypes from 'prop-types';

// Since this component is simple and static, there's no parent container for it.
const Legend = ({ legendObjects }) => {
	return (
		<table style={{ width: '100%' }}>
			<tbody>
				<tr>
					{legendObjects.map((item) => {
						return (
							<td
								key={'legend-for-' + item.title}
								style={{
									textAlign: 'center',
									verticalAlign: 'top',
									background: item.bg,
									// color: textColor,
									paddingLeft: '3px',
									paddingTop: '0px',
									paddingBottom: '0px'
								}}
							>
								<div>{item.title}</div>
							</td>
						);
					})}
				</tr>
			</tbody>
		</table>
	);
};

export default Legend;
Legend.propTypes = {
	legendObjects: PropTypes.array.isRequired,
};

Legend.defaultProps = {
	legendObjects: [],
};
