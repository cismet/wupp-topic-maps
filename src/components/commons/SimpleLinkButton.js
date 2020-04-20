import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Since this component is simple and static, there's no parent container for it.

//This is a first idea how to avoid the
/* eslint-disable jsx-a11y/anchor-is-valid */
//linting warning

//it is not used anywhere atm

//Basically the liniting warning says: dont use a link without href. use a button with a proper styling

//known problems:

//* the wrapping of the text is not exactly the same like the wrapping of a link
//* refactoring the code is not ease

const SimpleLinkButton = (props) => {
	//	return <a {...props}>{props.children}</a>; //to compare outcome
	return (
		<button
			style={{ border: 0, padding: 0, wordWrap: 'break-word', textAlign: 'left' }}
			class='btn-link'
			{...props}
		>
			{props.children}
		</button>
	);
};

export default SimpleLinkButton;
