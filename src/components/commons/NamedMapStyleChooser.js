import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Radio, ControlLabel } from 'react-bootstrap';
import { removeQueryPart, modifyQueryPart } from '../../utils/routingHelper';

// Since this component is simple and static, there's no parent container for it.
const NamedMapStyleChooser = ({
	title,
	currentNamedMapStyle,
	pathname,
	search,
	pushNewRoute,
	setLayerByKey = () => {},
	activeLayerKey = 'none',
	modes,
	vertical = false,
	children
}) => {
	let beforelayerradios = false;
	//keep false when its undefined
	if (
		children !== undefined &&
		children.props !== undefined &&
		children.props.beforelayerradios === true
	) {
		beforelayerradios = true;
	}

	return (
		<FormGroup>
			<ControlLabel>{title}</ControlLabel>
			<br />
			{children !== undefined && beforelayerradios === true && children}
			{modes.map((item, key) => {
				return (
					<span key={'radiobutton.nr.' + key}>
						<Radio
							id={'cboMapStyleChooser_' + item}
							key={key}
							readOnly={true}
							onClick={(e) => {
								if (e.target.checked === true) {
									if (item.layerKey) {
										setLayerByKey(item.layerKey);
									}
									if (item.mode === 'default') {
										pushNewRoute(
											pathname + removeQueryPart(search, 'mapStyle')
										);
									} else {
										pushNewRoute(
											pathname +
												modifyQueryPart(search, {
													mapStyle: item.mode
												})
										);
									}
								}
							}}
							checked={
								currentNamedMapStyle === item.mode &&
								activeLayerKey === (item.layerKey || 'none')
							}
							name='mapBackground'
							inline
						>
							{item.title} &nbsp;
						</Radio>
						{vertical !== false && <br />}
					</span>
				);
			})}
			{children !== undefined && beforelayerradios === false && children}
		</FormGroup>
	);
};

export default NamedMapStyleChooser;
NamedMapStyleChooser.propTypes = {
	title: PropTypes.string,
	vertical: PropTypes.bool,
	currentNamedMapStyle: PropTypes.string.isRequired,
	pathname: PropTypes.string.isRequired,
	search: PropTypes.string.isRequired,
	pushNewRoute: PropTypes.func.isRequired,
	modes: PropTypes.array
};

NamedMapStyleChooser.defaultProps = {
	title: 'Hintergrundkarte:',
	modes: [ { title: 'Tag', mode: 'default' }, { title: 'Nacht', mode: 'night' } ]
};
