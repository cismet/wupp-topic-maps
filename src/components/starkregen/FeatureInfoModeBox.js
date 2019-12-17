import Icon from 'components/commons/Icon';
import React from 'react';
import { Well } from 'react-bootstrap';
import { getRoundedValueStringForValue } from '../../utils/starkregenHelpers';

const Comp = ({ setFeatureInfoModeActivation, featureInfoValue, showModalMenu, legendObject }) => {
	let headerColor = '#7e7e7e';
	if (featureInfoValue) {
		for (const item of legendObject) {
			if (featureInfoValue > item.lt) {
				headerColor = item.bg;
			}
		}
	}
	if (featureInfoValue <= 0) {
		featureInfoValue = 0;
	}
	return (
		<div
			//onClick={(e) => e.stopPropagation()}
			key='featureInfoModeBox'
			id='featureInfoModeBox'
			style={{
				pointerEvents: 'auto',
				marginBottom: 5,
				float: 'right',
				width: '205px',
				height_: '145px'
			}}
		>
			<table style={{ width: '100%' }}>
				<tbody>
					<tr>
						<td
							style={{
								opacity: '0.9',
								paddingLeft: '2px',
								paddingRight: '15px',
								paddingTop: '0px',
								paddingBottom: '0px',
								background: headerColor,
								textAlign: 'left'
							}}
						>
							Maximaler Wasserstand
						</td>
						<td
							style={{
								opacity: '0.9',
								paddingLeft: '0px',
								paddingTop: '0px',
								paddingRight: '2px',
								paddingBottom: '0px',
								background: headerColor,
								textAlign: 'right'
							}}
						>
							<a
								onClick={() => {
									setFeatureInfoModeActivation(false);
								}}
								style={{ color: 'black' }}
							>
								<Icon name='close' />{' '}
							</a>
						</td>
					</tr>
				</tbody>
			</table>
			<Well
				bsSize='small'
				style={{
					opacity: '0.9',
					paddingBottom: '0px'
				}}
			>
				<table style={{ width: '100%', paddingBottom: '0px' }}>
					<tbody>
						<tr>
							<td
								style={{
									opacity: '0.9',
									paddingLeft: '0px',
									paddingTop: '0px',
									paddingBottom: '0px'
								}}
							>
								{featureInfoValue !== undefined && (
									<h2
										style={{
											marginTop: 0,
											marginBottom: 0,
											textAlign: 'center'
										}}
									>
										{getRoundedValueStringForValue(featureInfoValue)}
									</h2>
								)}
								{featureInfoValue === undefined && (
									<p>
										Klick in die Karte zur Abfrage des simulierten max.
										Wasserstandes
									</p>
								)}
							</td>
						</tr>
						{featureInfoValue !== undefined && (
							<tr>
								<td
									style={{
										opacity: '0.9',
										paddingLeft: '0px',
										paddingTop: '0px',
										paddingBottom: '2px',
										textAlign: 'center'
									}}
								>
									<a onClick={() => showModalMenu('aussagekraft')}>
										Information zur Aussagekraft
									</a>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</Well>
		</div>
	);
};

export default Comp;
