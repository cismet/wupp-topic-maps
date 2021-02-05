import React from 'react';
import { triggerLightBoxForFeature } from '../../utils/commonHelpers';

/* eslint-disable jsx-a11y/anchor-is-valid */

// Since this component is simple and static, there's no parent container for it.
const Comp = ({
	currentFeature,
	getPhotoUrl = (feature) => (feature || { properties: {} }).properties.foto,
	getPhotoSeriesUrl = (feature) => (feature || { properties: {} }).properties.fotostrecke,
	getPhotoSeriesArray = (feature) => (feature || { properties: {} }).properties.fotos,
	urlManipulation = (input) => input,
	captionFactory,
	width = 150,
	uiStateActions
}) => {
	if (
		currentFeature === undefined ||
		urlManipulation(getPhotoUrl(currentFeature)) === undefined ||
		getPhotoUrl(currentFeature) === ''
	) {
		return <div />;
	} else {
		return (
			<table style={{ width: '100%', opacity: 0.9 }}>
				<tbody>
					<tr>
						<td style={{ textAlign: 'right', verticalAlign: 'top' }}>
							<a
								onClick={() => {
									triggerLightBoxForFeature({
										currentFeature,
										uiStateActions,
										captionFactory,
										getPhotoUrl,
										getPhotoSeriesUrl,
										getPhotoSeriesArray,
										urlManipulation
									});
								}}
								target='_fotos'
							>
								<img
									alt='Bild'
									style={{ paddingBottom: '5px' }}
									src={urlManipulation(getPhotoUrl(currentFeature))}
									width='150'
								/>
							</a>
						</td>
					</tr>
				</tbody>
			</table>
		);
	}
};
export default Comp;
