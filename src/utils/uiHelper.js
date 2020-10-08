import React from 'react';
import IconLink from 'components/commons/IconLink';
import slugify from 'slugify';
import { Link } from 'react-scroll';
import { Icon } from 'react-fa';
import { Label } from 'react-bootstrap';
export const getActionLinksForFeature = (
	feature,
	{
		displayZoomToFeature = false,
		zoomToFeature = () => {
			console.warn('no action cause zoomToFeature was not set in config object');
		},
		displaySecondaryInfoAction = false,
		setVisibleStateOfSecondaryInfo = () => {
			console.warn(
				'no action cause setVisibleStateOfSecondaryInfo was not set in config object'
			);
		}
	}
) => {
	const links = [];
	if (displayZoomToFeature === true) {
		links.push(
			<IconLink
				key={`zoom`}
				tooltip='Auf Ladestation zoomen'
				onClick={() => {
					zoomToFeature(feature);
				}}
				iconname={'search-location'}
			/>
		);
	}
	if (displaySecondaryInfoAction === true) {
		links.push(
			<IconLink
				key={`IconLink.secondaryInfo`}
				tooltip='Datenblatt anzeigen'
				onClick={() => {
					setVisibleStateOfSecondaryInfo(true);
				}}
				iconname='info'
			/>
		);
	}
	if (feature.properties.tel !== undefined) {
		links.push(
			<IconLink
				key={`IconLink.tel`}
				tooltip='Anrufen'
				href={'tel:' + feature.properties.tel}
				iconname='phone'
			/>
		);
	}
	if (feature.properties.email !== undefined) {
		links.push(
			<IconLink
				key={`IconLink.email`}
				tooltip='E-Mail schreiben'
				href={'mailto:' + feature.properties.email}
				iconname='envelope-square'
			/>
		);
	}
	if (feature.properties.url !== undefined) {
		links.push(
			<IconLink
				key={`IconLink.web`}
				tooltip='Zur Homepage'
				href={feature.properties.url}
				target='_blank'
				iconname='external-link-square'
			/>
		);
	}
	return links;
};

const FAQEntry = ({
	id,
	title,
	containerId = 'myMenu',
	linkToKey = 'help',
	content,
	showOnSeperatePage
}) => {
	return (
		<div>
			<div name={id}>
				<br />
			</div>
			<h4 id={id}>
				{title}{' '}
				<Link
					to={linkToKey}
					containerId={showOnSeperatePage === false ? containerId : undefined}
					style={{ cursor: 'pointer', color: '#00000044' }}
				>
					<Icon name={'arrow-circle-up'} />
				</Link>
			</h4>
			{content}
		</div>
	);
};

const FAQLink = (props) => {
	const { id, title, containerId = 'myMenu', bsStyle = 'default', showOnSeperatePage } = props;
	return (
		<Link
			to={id}
			containerId={showOnSeperatePage === false ? containerId : undefined}
			style={{ textDecoration: 'none' }}
		>
			<Label style={{ cursor: 'pointer' }} bsStyle={bsStyle}>
				{title}
			</Label>{' '}
		</Link>
	);
};

export const faqEntriesFactory = (showOnSeperatePage, entryDescriptionArray = []) => {
	let linkArray = [];
	let entryArray = [];
	for (const entryDescription of entryDescriptionArray) {
		entryDescription.showOnSeperatePage = showOnSeperatePage;
		if (entryDescription.id === undefined) {
			entryDescription.id = slugify(entryDescription.title);
		}
		linkArray.push(<FAQLink key={'FAQLink.' + entryDescription.id} {...entryDescription} />);
		entryArray.push(
			<FAQEntry key={'FAQEntryLink.' + entryDescription.id} {...entryDescription} />
		);
	}
	return { linkArray, entryArray };
};
