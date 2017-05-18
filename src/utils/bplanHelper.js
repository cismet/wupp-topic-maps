export const bplanFeatureStyler = (feature) => {
  let color = getColorFromStatus(feature.properties.status);
  const style = {
    "color": color,
    "weight": 6,
    "opacity": 1.0,
    "fillColor": color,
    "fillOpacity": 0.3
  };

  return style;
};

export const getColorFromStatus = (status) => {
  let color = '#ff0000';
  switch (status) {
    case 'rechtskräftig':
      color = "#2AFF00";
      break;
    case 'nicht rechtskräftig':
      color = "#FC0000";
      break;
    default:
      color = "#0000FF";
  }
  return color;
};