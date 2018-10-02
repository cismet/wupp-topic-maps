
import {
    getColorForProperties as poiColorizer,
  } from "../utils/stadtplanHelper";

export const getColorForProperties = properties => {
    if (properties.more.zugang==="öffentlich" && properties.more.betreiber==="Verein") {
        return '#69D2E7';
    }else if (properties.more.zugang==="nicht öffentlich") {
        return '#A7DBD8';
    }
    else {
        return poiColorizer(properties);
    }    
  };