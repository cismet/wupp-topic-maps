import React from 'react';
import { Well } from 'react-bootstrap';
import Icon from 'components/commons/Icon';
/* eslint-disable jsx-a11y/anchor-is-valid */

const COMP = ({
	externalCollapsedState = false,
	fixedRow = false,
	divWhenCollapsed = (
		<div>
			divWhenCollapsed divWhenCollapsed divWhenCollapsed divWhenCollapsed divWhenCollapsed
		</div>
	),
	divWhenLarge = (
		<div>
			divWhenLarge divWhenLarge divWhenLarge divWhenLarge divWhenLarge divWhenLarge
			divWhenLarge divWhenLarge divWhenLarge divWhenLarge divWhenLarge divWhenLarge
			divWhenLarge divWhenLarge divWhenLarge
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
	collapseButtonAreaStyle = {
		background: '#cccccc',
		opacity: '0.9',
		width: 25,
		cursor: 'pointer'
	},
	bsSize = 'small',
	style = { pointerEvents: 'auto', padding: 0 },
	onClick = () => {},
	keyToUse,
	debugBorder = 0,
	tableStyle = {},
	collapsed,
	setCollapsed
}) => {
	const buttonInUse = <div>{collapsed === true ? upButton : downButton}</div>;

	let shownDiv;
	if (collapsed) {
		shownDiv = <div>{divWhenCollapsed}</div>;
	} else {
		shownDiv = <div style={{ padding: 9 }}>{divWhenLarge}</div>;
	}

	if (fixedRow) {
		return (
			<Well onClick={onClick} key={keyToUse} bsSize={bsSize} style={style}>
				<table width='100%' border={debugBorder} style={tableStyle}>
					<tbody>
						<tr>
							<td style={{ verticalAlign: 'middle' }}>{shownDiv}</td>
							<td
								rowSpan='2'
								style={{
									verticalAlign: 'middle',
									textAlign: 'center',
									...collapseButtonAreaStyle
								}}
								onClick={() => setCollapsed(!collapsed)}
							>
								{buttonInUse}
							</td>
						</tr>
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
							<td style={{ verticalAlign: 'middle' }}>{shownDiv}</td>

							<td
								style={{
									verticalAlign: 'middle',
									textAlign: 'center',
									...collapseButtonAreaStyle
								}}
								onClick={() => setCollapsed(!collapsed)}
							>
								{buttonInUse}
							</td>
						</tr>
					</tbody>
				</table>
			</Well>
		);
	}
};

export default COMP;
