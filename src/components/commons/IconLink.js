import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/commons/Icon';

// Since this component is simple and static, there's no parent container for it.
const IconLink = ({ tooltip, href, target, onClick, iconname }) => {
	return (
		<a title={tooltip} href={href} onClick={onClick} target={target}>
			<Icon
				style={{ color: 'grey', width: '26px', textAlign: 'center' }}
				size='2x'
				name={iconname}
			/>
		</a>
	);
};

export default IconLink;
IconLink.propTypes = {
	tooltip: PropTypes.string,
	href: PropTypes.string,
	target: PropTypes.string,
	iconname: PropTypes.string
};

IconLink.defaultProps = {
	tooltip: null,
	iconname: 'external-link-square'
};
