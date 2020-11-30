import React from 'react';
import parse, { domToReact } from 'html-react-parser';
import Markdown from 'react-markdown';
import LicenseLuftbildKarte from 'components/commons/LicenseLuftbildkarte';
import LicenseStadtplanTagNacht from 'components/commons/LicenseStadtplanTagNacht';
import { faqEntriesFactory } from 'utils/uiHelper';
import GenericHelpTextForMyLocation from 'components/commons/GenericHelpTextForMyLocation';
import InKartePositionieren from 'components/generic/help/InKartePositionieren';
import Einstellungen from 'components/generic/help/Einstellungen';
import KartendarstellungDerFachobjekte from 'components/generic/help/KartendarstellungDerFachobjekte';
import FachobjekteAuswaehlenUndAbfragen from 'components/generic/help/FachobjekteAuswaehlenUndAbfragen';

export const DOCBLOCKSTYLES = {
	TEXT: 'TEXT',
	HTML: 'HTML',
	MARKDOWN: 'MARKDOWN',
	FAQS: 'FAQS',
	DOCBLOCK: 'DOCBLOCK',
	LICENSE_LBK: 'LICENSE_LBK',
	LICENSE_STADTPLAN: 'LICENSE_STADTPLAN',
	MEINSTANDORT: 'MEINSTANDORT',
	INKARTEPOSITIONIEREN: 'INKARTEPOSITIONIEREN',
	EINSTELLUNGEN: 'EINSTELLUNGEN',
	KARTENDARSTELLUNGDERFACHOBJEKTE: 'KARTENDARSTELLUNGDERFACHOBJEKTE',
	FACHOBJEKTEAUSWAEHLENUNDABFRAGEN: 'FACHOBJEKTEAUSWAEHLENUNDABFRAGEN'
};

const ConfigurableDocBlocks = ({
	configs = [
		{
			type: 'TEXT',
			style: { color: 'black' },
			text: '<ConfigurableDocBlocks/> ohne Konfiguration'
		}
	],
	style
}) => {
	const blocks = [];
	for (const block of configs) {
		blocks.push(getBlock4Config(block));
	}

	return <div style={style}>{blocks}</div>;
};

export default ConfigurableDocBlocks;

const getBlock4Config = (block, key) => {
	switch (block.type) {
		case DOCBLOCKSTYLES.TEXT:
			//params: text, style
			return (
				<div key={key} style={block.style}>
					{block.text}
				</div>
			);
		case DOCBLOCKSTYLES.MARKDOWN:
			//params: md, style
			return (
				<div key={key} style={block.style}>
					<Markdown escapeHtml={false} source={block.content} />
				</div>
			);

		case DOCBLOCKSTYLES.LICENSE_LBK:
			return <LicenseLuftbildKarte />;

		case DOCBLOCKSTYLES.LICENSE_STADTPLAN:
			return <LicenseStadtplanTagNacht />;
		case DOCBLOCKSTYLES.MEINSTANDORT:
			return <GenericHelpTextForMyLocation />;
		case DOCBLOCKSTYLES.INKARTEPOSITIONIEREN:
			return <InKartePositionieren />;
		case DOCBLOCKSTYLES.EINSTELLUNGEN:
			return <Einstellungen />;
		case DOCBLOCKSTYLES.KARTENDARSTELLUNGDERFACHOBJEKTE:
			return <KartendarstellungDerFachobjekte />;
		case DOCBLOCKSTYLES.FACHOBJEKTEAUSWAEHLENUNDABFRAGEN:
			return <FachobjekteAuswaehlenUndAbfragen />;

		case DOCBLOCKSTYLES.DOCBLOCK:
			//params: docBlockConfigs, style, innerStyle
			return (
				<div style={block.style}>
					<ConfigurableDocBlocks
						style={block.innerStyle}
						configs={block.docBlockConfigs}
						key={key}
					/>
				</div>
			);
		case DOCBLOCKSTYLES.HTML:
			//params: docBlockConfigs, style, innerStyle

			if (block.replaceConfig === undefined) {
				return (
					<div key={'DOCBLOCKSTYLES.HTML.' + key} style={block.style}>
						{parse(block.content)}
					</div>
				);
			} else {
				const options = {
					replace: ({ attribs, children }) => {
						if (!attribs) return;
						const replacementInfo = block.replaceConfig[attribs.id];
						if (replacementInfo !== undefined) {
							// return tReact.createElement(LicenseLuftbildKarte, {});
							return getBlock4Config(replacementInfo);
						} else {
							return domToReact(children, options);
						}
						// if (Object.keys(block.replaceConfig).indexOf()
						// return React.createElement(LicenseLuftbildKarte, {});
					}
				};

				const x = parse(block.content, options);
				return x;
			}
		case DOCBLOCKSTYLES.FAQS: {
			const showOnSeperatePage = false;
			let i = 0;
			for (const faqConfig of block.configs) {
				let key = 'DOCBLOCKSTYLES.FAQS.' + i;
				if (faqConfig.contentBlockConf !== undefined) {
					faqConfig.content = getBlock4Config(faqConfig.contentBlockConf, key);
				}
				i++;
			}

			const { linkArray, entryArray } = faqEntriesFactory(showOnSeperatePage, block.configs);
			return (
				<div key={'DOCVBLOCKFAQ.' + key} style={block.style} name='help'>
					<font size='3'>{linkArray}</font>
					{entryArray}
				</div>
			);
		}

		default:
			break;
	}
};
