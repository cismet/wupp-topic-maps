import React from 'react';
import IconLink from 'components/commons/IconLink';
import slugify from 'slugify';
import { Link } from 'react-scroll';
import { Icon } from 'react-fa';
import { Label } from 'react-bootstrap';
import SVGInline from 'react-svg-inline';

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

export const getSymbolSVGGetter = (
	svgCode = `
<svg xmlns="http://www.w3.org/2000/svg" width="20.0" height="20.0">
	<path aaa="aaa" class="fg-fill" fill="#FFF"  d="M0 0h20.008v16.945H0z"/>
	<path class="bg-fill" fill="#C32D6A"  stroke="#C32D6A" stroke-width=".011" 
	d="M0.000900073 0.000610049l20.0016 0 0 5.81939c-0.659583,-0.00680055 -1.11354,-0.349628 -1.56825,-0.692836 -0.8652,-0.653153 -1.73191,-1.30706 -3.41128,-1.30706 -1.67824,0 -2.54042,0.652393 -3.40259,1.30479 -0.459627,0.347748 -0.918874,0.695486 -1.59773,0.695486 -0.678855,0 -1.13847,-0.347738 -1.59772,-0.695486 -0.86218,-0.652393 -1.72435,-1.30479 -3.40259,-1.30479 -1.679,0 -2.54609,0.654283 -3.41166,1.30706 -0.459627,0.346608 -0.918494,0.692836 -1.58904,0.692836l0 2.50034c1.66766,0 2.52982,-0.650503 3.39351,-1.30252 0.461897,-0.348498 0.924925,-0.697757 1.6068,-0.697757 0.678855,0 1.13848,0.347738 1.59772,0.695486 0.86218,0.652393 1.72435,1.30479 3.40259,1.30479 1.67824,0 2.54042,-0.652393 3.40259,-1.30479 0.459627,-0.347748 0.918874,-0.695486 1.59773,-0.695486 0.681875,0 1.14452,0.349258 1.60642,0.697757 0.85991,0.648993 1.71868,1.29685 3.3731,1.30215l0 5.42554c-0.659583,-0.00681055 -1.11353,-0.349638 -1.56825,-0.692846 -0.8652,-0.653153 -1.73191,-1.30706 -3.41128,-1.30706 -1.67824,0 -2.54042,0.652393 -3.40259,1.30479 -0.459627,0.347748 -0.918874,0.695486 -1.59773,0.695486 -0.678845,0 -1.13847,-0.347738 -1.59772,-0.695486 -0.86218,-0.652393 -1.72435,-1.30479 -3.40259,-1.30479 -1.679,0 -2.54609,0.654283 -3.41166,1.30706 -0.459627,0.346608 -0.918494,0.692846 -1.58903,0.692846l0 2.50034c1.66765,0 2.52982,-0.650513 3.3935,-1.30253 0.461897,-0.348498 0.924925,-0.697757 1.6068,-0.697757 0.678855,0 1.13848,0.347748 1.59773,0.695486 0.86217,0.652393 1.72435,1.3048 3.40259,1.3048 1.67824,0 2.54041,-0.652403 3.40259,-1.3048 0.459617,-0.347738 0.918864,-0.695486 1.59772,-0.695486 0.681875,0 1.14453,0.349258 1.60642,0.697757 0.85991,0.648993 1.71868,1.29686 3.3731,1.30215l0 3.75637 -20.0016 0 0 -20.0016 0.000760062 0.000380031z"/>
</svg>
`,
	svgBadgeDimension
) => {
	console.log('yyy getSymbolSVGGetter', svgCode);

	return (svgSize = 30, bg = '#FF0000', svgStyleRelatedId = 'default') => {
		let bdim = {
			width: svgBadgeDimension.width,
			height: svgBadgeDimension.height
		};

		let svg = `<svg  id="${svgStyleRelatedId}" height="${svgSize}" width="${svgSize}"> 
                    <style>
                    /* <![CDATA[ */
                        #${svgStyleRelatedId} .bg-fill  {
                            fill: ${bg};
                        }
                        #${svgStyleRelatedId} .bg-stroke  {
                            stroke: ${bg};
                        }
                        #${svgStyleRelatedId} .fg-fill  {
                            fill: white;
                        }
                        #${svgStyleRelatedId} .fg-stroke  {
                            stroke: white;
                        }
                    /* ]]> */
                    </style>
                <svg x="${svgSize / bdim.width / 2}" y="${svgSize /
			bdim.height /
			2}"  width="${svgSize - 2 * svgSize / bdim.width / 2}" height="${svgSize -
			2 * svgSize / bdim.height / 2}" viewBox="0 0 ${bdim.width} ${bdim.height || 24}">       
                    ${svgCode}
                </svg>
                </svg>  `;

		return <SVGInline svg={svg} />;
	};
};
