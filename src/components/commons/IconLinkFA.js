import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Since this component is simple and static, there's no parent container for it.
const IconLink = ({ tooltip, href, target, onClick, icon }) => {
	return (
		<a title={tooltip} href={href} onClick={onClick} target={target}>
			<FontAwesomeIcon
				style={{ color: 'grey', width: '26px', textAlign: 'center' }}
				size='2x'
				icon={icon}
			/>
		</a>
	);
};

export default IconLink;
IconLink.propTypes = {
	tooltip: PropTypes.string,
	href: PropTypes.string,
	target: PropTypes.string,
	icon: PropTypes.object
};

IconLink.defaultProps = {
	tooltip: null,
	iconname: 'external-link-square'
};
