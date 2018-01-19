import React from 'react';

export const bplanFeatureStyler = (feature) => {
  const style = {
    "color": getColorFromFeatureConsideringSelection(feature),
    "weight": 3,
    "opacity": 1.0,
//    "dashArray": "30",
    "fillColor": getColorFromFeature(feature),
    "fillOpacity": getFeatureOpacityConsideringSelection(feature)
  };
  return style;
};

export const getColorFromFeature = (feature) => {
  let color = '#ff0000';
  switch (feature.properties.status) {
    case 'rechtskräftig':
      color = "#2AFF00";
      break;
    case 'nicht rechtskräftig':
      color = "#FC0000";
      break;
    default: //beides
      color = "#2AFF00";
  }
  return color;
};

export const getLineColorFromFeature = (feature) => {
  let color = '#ff0000';
  switch (feature.properties.status) {
    case 'rechtskräftig':
      color = "#2AFF00";
      break;
    case 'nicht rechtskräftig':
      color = "#FC0000";
      break;
    default: //beides
      color = "#FC0000";
  }
  return color;
};


export const getColorFromFeatureConsideringSelection = (feature) => {
  if (feature.selected) {
    return '#4395FE';
  }else {
    return getColorFromFeature(feature);
  }
};
export const getLineColorFromFeatureConsideringSelection = (feature) => {
  if (feature.selected) {
    return '#4395FE';
  }else {
    return getLineColorFromFeature(feature);
  }
};

export const getShadowColorFromFeatureConsideringSelection = (feature) => {
  if (feature.selected) {
    return '#4395FE';
  }else {
    return '#000000';
  }
};

export const getTooltipStyleFromFeatureConsideringSelection = (feature) => {
  let base = {
    "color":getLineColorFromFeature(feature),
    "textShadow": "1px 1px 0px  #000000,-1px 1px 0px  #000000, 1px -1px 0px  #000000, -1px -1px 0px  #000000, 2px 2px 15px #000000",
  };
   if (feature.selected) {
    const radius=10;
    const borderDef=`${radius}px ${radius}px ${radius}px ${radius}px`;
    return {
      ...base,
      "background": "rgba(67, 149, 254, 0.8)",
      "-webkit-border-radius": borderDef,
      "moz-border-radius": borderDef,
      "border-radius": borderDef,
      "padding":"5px"
    };
  }else {
    return base;
  }
};




export const getFeatureOpacityConsideringSelection = (feature) => {
  if (feature.selected) {
    return 0.5;
  }else {
    return 0.4;
  }
};

export const bplanLabeler = (feature) => {
  return (
    <h3 style={getTooltipStyleFromFeatureConsideringSelection(feature)} >
      {feature.properties.nummer}
    </h3>
  );
};

// export const bplanLabeler = (feature) => {
//   return (
//     <h3 style='color:"+getLineColorFromFeature(feature)+";text-shadow: 1px 1px 0px  #000000,-1px 1px 0px  #000000, 1px -1px 0px  #000000, -1px -1px 0px  #000000, 0px 0px 6px #000000; '>"+feature.properties.nummer+"</h3>";
//     )
// };
