import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import L from 'leaflet';
import Icon from 'components/commons/Icon';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faSun } from '@fortawesome/free-solid-svg-icons';

import Control from 'react-leaflet-control';
import { Form, FormGroup, InputGroup, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

const COMP = ({
	searchAfterGazetteer,
	searchInProgress,
	searchAllowed,
	searchIcon,
	overlayFeature,
	gazetteerHit,
	searchButtonTrigger,
	setOverlayFeature,
	gazSearchMinLength = 2,
	enabled = true,
	placeholder = 'Geben Sie einen Suchbegriff ein',
	pixelwidth = 300,
	searchControlPosition = 'bottomleft',
	gazData = [],
	gazetteerHitAction = () => {},
	gazeteerHitTrigger = () => {},
	searchTooltipProvider = function() {
		return (
			<Tooltip
				style={{
					zIndex: 3000000000
				}}
				id='searchTooltip'
			>
				Objekte suchen
			</Tooltip>
		);
	},
	gazClearTooltipProvider = () => (
		<Tooltip
			style={{
				zIndex: 3000000000
			}}
			id='gazClearTooltip'
		>
			Suche zurücksetzen
		</Tooltip>
	),
	renderMenuItemChildren = (option, props, index) => {
		// console.log('option.glyph', option.glyph);
		// console.log('faSun', faSun);
		return (
			<div key={option.sorter}>
				<Icon
					style={{
						marginRight: '10px',
						width: '18px'
					}}
					name={option.glyph}
					overlay={option.overlay}
					size={'lg'}
				/>

				<span>{option.string}</span>
			</div>
		);
	}
}) => {
	const typeahead = useRef(null);
	const searchOverlay = useRef(null);
	const gazClearOverlay = useRef(null);
	const controlRef = useRef(null);
	useEffect(() => {
		if (controlRef.current !== null) {
			L.DomEvent.disableScrollPropagation(controlRef.current.leafletElement._container);
		}
	});

	const internalSearchButtonTrigger = (event) => {
		if (searchOverlay) {
			searchOverlay.current.hide();
		}
		if (searchInProgress === false && searchButtonTrigger !== undefined) {
			clear();
			gazetteerHitAction(null);
			searchButtonTrigger(event);
		} else {
			//console.log("search in progress or no searchButtonTrigger defined");
		}
	};
	const internalClearButtonTrigger = (event) => {
		if (gazClearOverlay) {
			gazClearOverlay.current.hide();
		}
		if (overlayFeature !== null) {
			setOverlayFeature(null);
		}

		clear();
		gazetteerHitAction(null);
	};

	const clear = () => {
		typeahead.current.clear();
	};
	let firstbutton;
	// check for overlayFeature and gazetteerHit because of the new behaviour to show the delete button always
	// if there is a gaz hit in the map
	if (searchAfterGazetteer === true && overlayFeature === null && gazetteerHit === null) {
		firstbutton = (
			<InputGroup.Button
				disabled={searchInProgress || !searchAllowed}
				onClick={(e) => {
					if (searchAllowed) {
						internalSearchButtonTrigger(e);
					} else {
						// Hier kann noch eine Meldung angezeigt werden.
					}
				}}
			>
				<OverlayTrigger
					ref={searchOverlay}
					placement='top'
					overlay={searchTooltipProvider()}
				>
					<Button disabled={searchInProgress || !searchAllowed}>{searchIcon}</Button>
				</OverlayTrigger>
			</InputGroup.Button>
		);
	} else {
		// check for overlayFeature and gazetteerHit because of the new behaviour to show the delete button always
		// if there is a gaz hit in the map
		if (!searchAllowed || overlayFeature !== null || gazetteerHit !== null) {
			firstbutton = (
				<InputGroup.Button onClick={internalClearButtonTrigger}>
					<OverlayTrigger
						ref={gazClearOverlay}
						placement='top'
						overlay={gazClearTooltipProvider()}
					>
						<Button disabled={overlayFeature === null && gazetteerHit === null}>
							<Icon name='times' />
						</Button>
					</OverlayTrigger>
				</InputGroup.Button>
			);
		}
	}

	return (
		<Control ref={controlRef} pixelwidth={pixelwidth} position={searchControlPosition}>
			<Form
				style={{
					width: pixelwidth + 'px'
				}}
				action='#'
			>
				<FormGroup>
					<InputGroup>
						{firstbutton}
						<Typeahead
							id='haz-search-typeahead'
							ref={typeahead}
							style={{ width: `${pixelwidth}px` }}
							labelKey='string'
							options={gazData}
							onChange={gazeteerHitTrigger}
							paginate={true}
							dropup={true}
							disabled={!enabled}
							placeholder={placeholder}
							minLength={gazSearchMinLength}
							filterBy={(option, props) => {
								return option.string
									.toLowerCase()
									.startsWith(props.text.toLowerCase());
							}}
							onInputChange={(text, event) => {}}
							align={'justify'}
							emptyLabel={'Keine Treffer gefunden'}
							paginationText={'Mehr Treffer anzeigen'}
							autoFocus={true}
							submitFormOnEnter={true}
							searchText={'suchen ...'}
							renderMenuItemChildren={renderMenuItemChildren}
						/>
					</InputGroup>
				</FormGroup>
			</Form>
		</Control>
	);
};

export default COMP;

COMP.propTypes = {
	enabled: PropTypes.bool,
	placeholder: PropTypes.string,
	pixelwidth: PropTypes.number,
	searchControlPosition: PropTypes.string,
	firstbutton: PropTypes.object,
	gazData: PropTypes.array,
	gazeteerHitTrigger: PropTypes.func,
	renderMenuItemChildren: PropTypes.func,
	gazClearTooltipProvider: PropTypes.func,
	gazSearchMinLength: PropTypes.number
};
