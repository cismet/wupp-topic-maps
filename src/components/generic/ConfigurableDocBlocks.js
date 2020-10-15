import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import parse, { domToReact } from 'html-react-parser';
import Markdown from 'react-markdown';
import LicenseLuftbildKarte from 'components/commons/LicenseLuftbildkarte';
import LicenseStadtplanTagNacht from 'components/commons/LicenseStadtplanTagNacht';
import { faqEntriesFactory } from 'utils/uiHelper';
import GenericHelpTextForMyLocation from 'components/commons/GenericHelpTextForMyLocation';

export const DOCBLOCKSTYLES = {
	TEXT: 'TEXT',
	HTML: 'HTML',
	MARKDOWN: 'MARKDOWN',
	FAQS: 'FAQS',
	DOCBLOCK: 'DOCBLOCK',
	LICENSE_LBK: 'LICENSE_LBK',
	LICENSE_STADTPLAN: 'LICENSE_STADTPLAN',
	MYLOCATION: 'MYLOCATION'
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

const getBlock4Config = (block) => {
	switch (block.type) {
		case DOCBLOCKSTYLES.TEXT:
			//params: text, style
			return <div style={block.style}>{block.text}</div>;
			break;
		case DOCBLOCKSTYLES.MARKDOWN:
			//params: md, style
			return (
				<div style={block.style}>
					<Markdown escapeHtml={false} source={block.md} />
				</div>
			);
			break;

		case DOCBLOCKSTYLES.LICENSE_LBK:
			//params: faqConfig, style
			return <LicenseLuftbildKarte />;
			break;
		case DOCBLOCKSTYLES.LICENSE_STADTPLAN:
			//params: faqConfig, style
			return <LicenseStadtplanTagNacht />;
			break;
		case DOCBLOCKSTYLES.MYLOCATION:
			//params: faqConfig, style
			return <GenericHelpTextForMyLocation />;
			break;
		case DOCBLOCKSTYLES.DOCBLOCK:
			//params: docBlockConfigs, style, innerStyle
			return (
				<div style={block.style}>
					<ConfigurableDocBlocks
						style={block.innerStyle}
						configs={block.docBlockConfigs}
					/>
				</div>
			);
			break;
		case DOCBLOCKSTYLES.HTML:
			//params: docBlockConfigs, style, innerStyle

			if (block.replaceConfig === undefined) {
				return <div style={block.style}>{parse(block.html)}</div>;
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

				const x = parse(block.html, options);
				return x;
			}
			break;
		case DOCBLOCKSTYLES.FAQS: {
			const showOnSeperatePage = false;
			for (const faqConfig of block.configs) {
				if (faqConfig.contentBlockConf !== undefined) {
					faqConfig.content = getBlock4Config(faqConfig.contentBlockConf);
				}
			}

			const { linkArray, entryArray } = faqEntriesFactory(showOnSeperatePage, block.configs);
			return (
				<div style={block.style} name='help'>
					<font size='3'>{linkArray}</font>
					{entryArray}
				</div>
			);
		}

		default:
			break;
	}
};
