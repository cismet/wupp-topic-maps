import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Well } from 'react-bootstrap';
import { Icon } from 'react-fa';
import Color from 'color';
//import useLocalforage from 'use-localforage';

const COMP = ({
	externalCollapsedState = false,
	fixedRow = false,
	alwaysVisibleDiv = <div>alwaysVisibleDiv</div>,
	collapsibleDiv = (
		<div>
			collapsibleDiv collapsibleDiv collapsibleDiv collapsibleDiv collapsibleDiv
			collapsibleDiv collapsibleDiv collapsibleDiv collapsibleDiv collapsibleDiv
			collapsibleDiv collapsibleDiv collapsibleDiv collapsibleDiv collapsibleDiv
			collapsibleDiv collapsibleDiv collapsibleDiv collapsibleDiv collapsibleDiv{' '}
		</div>
	),
	upButton = (
		<h4 style={{ margin: 2 }}>
			<Icon
				title='vollständige Info-Box'
				style={{ color: '#7e7e7e' }}
				name='chevron-circle-up'
			/>
		</h4>
	),
	downButton = (
		<h4 style={{ margin: 2 }}>
			<Icon
				title='kompakte Info-Box'
				style={{ color: '#7e7e7e' }}
				name='chevron-circle-down'
			/>
		</h4>
	),
	collapseButtonAreaStyle = {},
	bsSize = 'small',
	style = { pointerEvents: 'auto' },
	onClick = () => {},
	keyToUse,
	debugBorder = 0,
	tableStyle = {},
	collapsed,
	setCollapsed,
	isCollapsible = true
}) => {
	const [ internalCollapsed, setInternalCollapsed ] = useState(
		//keyToUse + '.collapsedState'
		false
	);

	const buttonInUse = (
		<div>
			<a onClick={() => setCollapsed(!collapsed)} style={{ textDecoration: 'none' }}>
				{collapsed === true ? upButton : downButton}
			</a>
		</div>
	);

	if (fixedRow) {
		return (
			<Well onClick={onClick} key={keyToUse} bsSize={bsSize} style={style}>
				<table width='100%' border={debugBorder} style={tableStyle}>
					<tbody>
						<tr>
							<th style={{ verticalAlign: 'middle' }}>{alwaysVisibleDiv}</th>
							{isCollapsible && (
								<th
									rowSpan='2'
									style={{
										verticalAlign: 'middle',
										textAlign: 'center',
										...collapseButtonAreaStyle
									}}
								>
									{buttonInUse}
								</th>
							)}
						</tr>
						{(!isCollapsible || !collapsed === true) && (
							<tr>
								<td>{collapsibleDiv}</td>
							</tr>
						)}
					</tbody>
				</table>
			</Well>
		);
	} else {
		return (
			<Well onClick={onClick} key={keyToUse} bsSize={bsSize} style={style}>
				<table width='100%' border={debugBorder}>
					<tbody>
						<tr>
							<th style={{ verticalAlign: 'middle' }}>{alwaysVisibleDiv}</th>
							{isCollapsible && (
								<th
									style={{
										verticalAlign: 'middle',
										textAlign: 'center',
										...collapseButtonAreaStyle
									}}
								>
									{buttonInUse}
								</th>
							)}
						</tr>
						{(!isCollapsible || !collapsed === true) && (
							<tr>
								<td colSpan='2'>{collapsibleDiv}</td>
							</tr>
						)}
					</tbody>
				</table>
			</Well>
		);
	}
};

export default COMP;
