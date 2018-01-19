import React from 'react';
import ColorHash from 'color-hash';
import Color from 'color';
import {Icon} from 'react-fa'

export const featureStyler = (feature) => {
  var color = Color(getColorForProperties(feature));
  let radius = 8;
  let selectionBox = 30;
  let weight = 2;
  let svgSize = radius * 2 + weight * 2;
  if (feature.selected) {
    svgSize = 36;
  }

  let svg = `<svg height="${svgSize}" width="${svgSize}">
            <circle cx="${svgSize / 2}" cy="${svgSize / 2}" r="${radius}" stroke="${color.darken(0.5)}" stroke-width="${weight}" fill="${color}" />
        </svg>  `
  if (feature.selected) {


    svg = `<svg height="${svgSize}" width="${svgSize}">
              <rect visible="false" x="${ (svgSize - selectionBox) / 2}" y="${ (svgSize - selectionBox) / 2}" rx="8" ry="8" width="${selectionBox}" height="${selectionBox}" fill="rgba(67, 149, 254, 0.8)" stroke-width="0"/>
              <circle cx="${svgSize / 2}" cy="${svgSize / 2}" r="${radius}" stroke="${color.darken(0.5)}" stroke-width="${weight}" fill="${color}" />
          </svg>  `
  }
  const style = {
    radius,
    fillColor: color,
    color: color.darken(0.5),
    weight,
    opacity: 1,
    fillOpacity: 0.8,
    svg,
    svgSize
  };
  return style;
};

//
// export const getTooltipStyleFromFeatureConsideringSelection = (feature) => {
//   let base = {
//     "color":getLineColorFromFeature(feature),
//     "textShadow": "1px 1px 0px  #000000,-1px 1px 0px  #000000, 1px -1px 0px  #000000, -1px -1px 0px  #000000, 2px 2px 15px #000000",
//   };
//    if (feature.selected) {
//     const radius=10;
//     const borderDef=`${radius}px ${radius}px ${radius}px ${radius}px`;
//     return {
//       ...base,
//       "background": "rgba(67, 149, 254, 0.8)",
//       "-webkit-border-radius": borderDef,
//       "moz-border-radius": borderDef,
//       "border-radius": borderDef,
//       "padding":"5px"
//     };
//   }else {
//     return base;
//   }
// };

export const getColorForProperties = (feature) => {
  let colorHash = new ColorHash({saturation: 0.3});
  return colorHash.hex("" + JSON.stringify(feature.properties));
};

//
// export const featureLabeler = (feature) => {
//   let base = {
//       "color":getColorForProperties(feature),
//     };
//   return (
//     <Icon style={base} name="circle" />
//   );
// };

export const featureHoverer = (feature) => {
  return "<div>" + feature.text + "</div>";
};
