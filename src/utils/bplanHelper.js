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
export const getFeatureOpacityConsideringSelection = (feature) => {
  if (feature.selected) {
    return 0.5;
  }else {
    return 0.4;
  }
};

export const bplanLabeler = (feature) => {
  return "<h3 style='color:"+getLineColorFromFeature(feature)+";text-shadow: 1px 1px 0px  #000000,-1px 1px 0px  #000000, 1px -1px 0px  #000000, -1px -1px 0px  #000000, 0px 0px 6px #000000; '>"+feature.properties.nummer+"</h3>";  
};
