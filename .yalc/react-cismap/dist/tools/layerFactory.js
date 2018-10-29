import React from 'react';
import Layers from '../constants/layers';
import { namedStyles } from '../constants/layers';
import objectAssign from 'object-assign';

export default function getLayers(layerString) {
	var namedMapStyle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';
	var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
		layerSeparator: '|'
	};
	var namedStylesConfig = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : namedStyles;

	var layerArr = layerString.split(config.layerSeparator || '|');
	var namedMapStyleExtension = namedMapStyle;
	if (namedMapStyleExtension === null || namedMapStyleExtension === '') {
		namedMapStyleExtension = 'default';
	}
	namedMapStyleExtension = '.' + namedMapStyleExtension;
	var getLayer = function getLayer(layerWithNamedStyleExtension) {
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		var layerAndNamedStyleArray = layerWithNamedStyleExtension.split('.');
		var namedStyleOptions = {};

		if (layerAndNamedStyleArray.length > 1) {
			//the last named style is overriding the ones before
			var first = true;
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = layerAndNamedStyleArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var element = _step.value;

					if (first) {
						first = false;
					} else {
						namedStyleOptions = objectAssign({}, namedStyleOptions, namedStylesConfig[element]);
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}
		var mergedOptions = objectAssign({}, namedStyleOptions, options);
		var layerGetter = Layers.get(layerAndNamedStyleArray[0]);
		if (layerGetter) {
			return layerGetter(mergedOptions);
		} else {
			return null;
		}
	};

	return React.createElement(
		'div',
		null,
		layerArr.map(function (layerWithOptions) {
			var layOp = layerWithOptions.split('@');
			if (!isNaN(parseInt(layOp[1], 10))) {
				var layerWithNamedStyleExtension = layOp[0] + namedMapStyleExtension;

				var layerOptions = {
					opacity: parseInt(layOp[1] || '100', 10) / 100.0
				};
				return getLayer(layerWithNamedStyleExtension, layerOptions);
			}
			if (layOp.length === 2) {
				try {
					var _layerOptions = JSON.parse(layOp[1]);
					var _layerWithNamedStyleExtension = layOp[0] + namedMapStyleExtension;
					return getLayer(_layerWithNamedStyleExtension, _layerOptions);
				} catch (error) {
					console.error(error);
					console.error('Problems during parsing of the layer options. Skip options. You will get the 100% Layer:' + layOp[0]);
					var _layerWithNamedStyleExtension2 = layOp[0] + namedMapStyleExtension;
					return getLayer(_layerWithNamedStyleExtension2);
				}
			} else {
				var _layerWithNamedStyleExtension3 = layOp[0] + namedMapStyleExtension;
				return getLayer(_layerWithNamedStyleExtension3);
			}
		})
	);
}