import { getColorForProperties as poiColorizer } from "../utils/stadtplanHelper";
import "url-search-params-polyfill";

export const getColorForProperties = (properties) => {    
  let searchParams = new URLSearchParams(window.location.href);
  let openForPublic= searchParams.get("openForPublic")||"147DA3";
  let closedForPublic=searchParams.get("closedForPublic")||"52A6C4"

  if (properties.more.zugang === "öffentlich" && properties.more.betreiber === "Verein") {
    return "#"+openForPublic;
  } else if (properties.more.zugang === "nicht öffentlich") {
    return "#"+closedForPublic;
  } else {
    return poiColorizer(properties);
  }
};

