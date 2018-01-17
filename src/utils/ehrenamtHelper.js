import React from 'react';
import ColorHash from 'color-hash';
import Color from 'color';

export const featureStyler = (feature) => {
  var color = Color(getColorForProperties(feature));
  let radius=8;
  let weight=2;
  if (feature.selected) {
    radius=12;
    weight=4;
  }
  const style = {
   radius,
    fillColor: color,
    color: color.darken(0.5),
    weight,
    opacity: 1,
    fillOpacity: 0.8
};
  return style;
};

export const getColorForProperties = (feature) => {
    let colorHash = new ColorHash({saturation: 0.3});
    return colorHash.hex(""+JSON.stringify(feature.properties));
  };



export const featureLabeler = (feature) => {
  // let s = {
  //   "color":getLineColorFromFeature(feature),
  //   "textShadow": "1px 1px 0px  #000000,-1px 1px 0px  #000000, 1px -1px 0px  #000000, -1px -1px 0px  #000000, 2px 2px 15px "+getShadowColorFromFeatureConsideringSelection(feature),
  // };  style={s}
  return (
    <h3  >
      {feature.text}
    </h3>
  );
};
