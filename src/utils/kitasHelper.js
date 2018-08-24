import Color from "color";
import L from "leaflet";
import createSVGPie from "create-svg-pie";
import createElement from "svg-create-element";
import { constants as kitasConstants } from "../redux/modules/kitas";

const childSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
    <rect class="bg-fill" x="0" y="0" rx="100" ry="100" width="600" height="600"/>
    <svg x="108" y="44">
        <path class="fg-fill" d="M120 72c0-39.765 32.235-72 72-72s72 32.235 72 72c0 39.764-32.235 72-72 72s-72-32.236-72-72zm254.627 1.373c-12.496-12.497-32.758-12.497-45.254 0L242.745 160H141.254L54.627 73.373c-12.496-12.497-32.758-12.497-45.254 0-12.497 12.497-12.497 32.758 0 45.255L104 213.254V480c0 17.673 14.327 32 32 32h16c17.673 0 32-14.327 32-32V368h16v112c0 17.673 14.327 32 32 32h16c17.673 0 32-14.327 32-32V213.254l94.627-94.627c12.497-12.497 12.497-32.757 0-45.254z"/>
    </svg>
    </svg>

`;

export const getFeatureStyler = (svgSize = 30, featureRenderingOptions) => {
  return feature => {
    var color = Color(getColorForProperties(feature.properties, featureRenderingOptions));
    let radius = svgSize / 2; //needed for the Tooltip Positioning
    let canvasSize = svgSize;
    if (feature.selected) {
      canvasSize = svgSize + 12;
    }

    let selectionBox = canvasSize - 6;
    let badge = childSVG;

    let bdim = feature.properties.svgBadgeDimension || {
      width: 24,
      height: 24
    };

    let svg = `<svg id="badgefor_${feature.id}" height="${canvasSize}" width="${canvasSize}"> 
                    <style>
                    /* <![CDATA[ */
                        #badgefor_${feature.id} .bg-fill  {
                            fill: ${getColorForProperties(
                              feature.properties,
                              featureRenderingOptions
                            )};
                        }
                        #badgefor_${feature.id} .bg-stroke  {
                            stroke: ${getColorForProperties(
                              feature.properties,
                              featureRenderingOptions
                            )};
                        }
                        #badgefor_${feature.id} .fg-fill  {
                            fill: white;
                        }
                        #badgefor_${feature.id} .fg-stroke  {
                            stroke: white;
                        }
                    /* ]]> */
                    </style>
                <svg x="${svgSize / 12}" y="${svgSize / 12}"  width="${svgSize -
      (2 * svgSize) / 12}" height="${svgSize - (2 * svgSize) / 12}" viewBox="0 0 ${
      bdim.width
    } ${bdim.height || 24}">       
                    ${badge}
                </svg>
                </svg>  `;

    if (feature.selected) {
      let selectionOffset = (canvasSize - selectionBox) / 2;

      let badgeDimension = svgSize - (2 * svgSize) / 12;
      let innerBadgeOffset = (selectionBox - badgeDimension) / 2;

      svg =
        `<svg id="badgefor_${feature.id}" height="${canvasSize}" width="${canvasSize}">
                    <style>
                    /* <![CDATA[ */
                        #badgefor_${feature.id} .bg-fill  {
                            fill: ${getColorForProperties(
                              feature.properties,
                              featureRenderingOptions
                            )};
                        }
                        #badgefor_${feature.id} .bg-stroke  {
                            stroke: ${getColorForProperties(
                              feature.properties,
                              featureRenderingOptions
                            )};
                        }
                        #badgefor_${feature.id} .fg-fill  {
                            fill: white;
                        }
                        #badgefor_${feature.id} .fg-stroke  {
                            stroke: white;
                        }
                    /* ]]> */
                    </style>
                <rect x="${selectionOffset}" y="${selectionOffset}" rx="8" ry="8" width="${selectionBox}" height="${selectionBox}" fill="rgba(67, 149, 254, 0.8)" stroke-width="0"/>
                <svg x="${selectionOffset + innerBadgeOffset}" y="${selectionOffset +
          innerBadgeOffset}" width="${badgeDimension}" height="${badgeDimension}" viewBox="0 0 ` +
        bdim.width +
        ` ` +
        bdim.height +
        `">
                ${badge}

                </svg>
                </svg>`;
    }

    const style = {
      radius,
      fillColor: color,
      color: color.darken(0.5),
      opacity: 1,
      fillOpacity: 0.8,
      svg,
      svgSize: canvasSize
    };
    return style;
  };
};
export const getKitaClusterIconCreatorFunction = (svgSize = 24, featureRenderingOptions) => {
  //return a function because the functionCall of the iconCreateFunction cannot be manipulated
  return cluster => {
    var childCount = cluster.getChildCount();
    const values = [];
    const colors = [];

    const r = svgSize / 1.5;
    // Pie with default colors
    let childMarkers = cluster.getAllChildMarkers();

    let containsSelection = false;
    let inCart = false;
    for (let marker of childMarkers) {
      values.push(1);
      colors.push(Color(getColorForProperties(marker.feature.properties, featureRenderingOptions)));
      if (marker.feature.selected === true) {
        containsSelection = true;
      }
      if (marker.feature.inCart) {
        inCart = true;
      }
    }
    const pie = createSVGPie(values, r, colors);

    let canvasSize = (svgSize / 3.0) * 5.0;
    let background = createElement("svg", {
      width: canvasSize,
      height: canvasSize,
      viewBox: `0 0 ${canvasSize} ${canvasSize}`
    });

    //Kleiner Kreis in der Mitte
    // (blau wenn selektion)
    let innerCircleColor = "#ffffff";
    if (containsSelection) {
      innerCircleColor = "rgb(67, 149, 254)";
    }

    //inner circle
    pie.appendChild(
      createElement("circle", {
        cx: r,
        cy: r,
        r: svgSize / 3.0,
        "stroke-width": 0,
        opacity: "0.5",
        fill: innerCircleColor
      })
    );

    // //Debug Rectangle -should be commnented out
    // background.appendChild(createElement('rect', {
    //     x:0,
    //     y:0,
    //     width: canvasSize,
    //     height: canvasSize,
    //     "stroke-width":1,
    //     stroke: "#000000",
    //     opacity: "1",
    //     fill: "#ff0000"

    // }));

    background.appendChild(pie);

    // Umrandung
    background.appendChild(
      createElement("circle", {
        cx: canvasSize / 2.0,
        cy: canvasSize / 2.0,
        r: r,
        "stroke-width": 2,
        stroke: "#000000",
        opacity: "0.5",
        fill: "none"
      })
    );

    if (inCart) {
      background
        .appendChild(
          createElement("text", {
            x: "50%",
            y: "50%",
            "text-anchor": "middle",
            "font-family": "FontAwesome",
            fill: "#fff",
            "font-size": "26",
            dy: ".4em",
            opacity: "0.5"
          })
        )
        .appendChild(document.createTextNode("\uf005"));
    }

    background
      .appendChild(
        createElement("text", {
          x: "50%",
          y: "50%",
          "text-anchor": "middle",
          dy: ".3em"
        })
      )
      .appendChild(document.createTextNode(childCount));

    pie.setAttribute("x", (canvasSize - r * 2) / 2.0);
    pie.setAttribute("y", (canvasSize - r * 2) / 2.0);

    var divIcon = L.divIcon({
      className: "leaflet-data-marker",
      html: background.outerHTML || new XMLSerializer().serializeToString(background), //IE11 Compatibility
      iconAnchor: [canvasSize / 2.0, canvasSize / 2.0],
      iconSize: [canvasSize, canvasSize]
    });
    //console.log(background.outerHtml)
    return divIcon;
  };
};

const opts = [];
const kC = kitasConstants;

opts.push({});
opts[opts.length - 1][kC.TRAEGERTYP.indexOf(kC.TRAEGERTYP_STAEDTISCH)] = "#00A0B0";
opts[opts.length - 1][kC.TRAEGERTYP.indexOf(kC.TRAEGERTYP_ANDERE)] = "#A1BBC1";
opts[opts.length - 1][kC.TRAEGERTYP.indexOf(kC.TRAEGERTYP_BETRIEBSKITA)] = "#594F4F";
opts[opts.length - 1][kC.TRAEGERTYP.indexOf(kC.TRAEGERTYP_ELTERNINITIATIVE)] = "#9DE0AD";
opts[opts.length - 1][kC.TRAEGERTYP.indexOf(kC.TRAEGERTYP_KATHOLISCH)] = "#7FBCB5";
opts[opts.length - 1][kC.TRAEGERTYP.indexOf(kC.TRAEGERTYP_EVANGELISCH)] = "#547980";

// opts[opts.length - 1][kC.TRAEGERTYP.indexOf(kC.TRAEGERTYP_STAEDTISCH)] = "#547980";
// opts[opts.length - 1][kC.TRAEGERTYP.indexOf(kC.TRAEGERTYP_ANDERE)] = "#00A0B0";
// opts[opts.length - 1][kC.TRAEGERTYP.indexOf(kC.TRAEGERTYP_BETRIEBSKITA)] = "#594F4F";
// opts[opts.length - 1][kC.TRAEGERTYP.indexOf(kC.TRAEGERTYP_ELTERNINITIATIVE)] = "#45ADA8";
// opts[opts.length - 1][kC.TRAEGERTYP.indexOf(kC.TRAEGERTYP_KATHOLISCH)] = "#9DE0AD";
// opts[opts.length - 1][kC.TRAEGERTYP.indexOf(kC.TRAEGERTYP_EVANGELISCH)] = "#7FBCB5";

opts.push({});
opts[opts.length - 1][kC.TRAEGERTYP.indexOf(kC.TRAEGERTYP_STAEDTISCH)] = "#FFC000";
opts[opts.length - 1][kC.TRAEGERTYP.indexOf(kC.TRAEGERTYP_ANDERE)] = "#26978F";
opts[opts.length - 1][kC.TRAEGERTYP.indexOf(kC.TRAEGERTYP_BETRIEBSKITA)] = "#E26B0A";
opts[opts.length - 1][kC.TRAEGERTYP.indexOf(kC.TRAEGERTYP_ELTERNINITIATIVE)] = "#CB0D0D";
opts[opts.length - 1][kC.TRAEGERTYP.indexOf(kC.TRAEGERTYP_KATHOLISCH)] = "#538DD5";
opts[opts.length - 1][kC.TRAEGERTYP.indexOf(kC.TRAEGERTYP_EVANGELISCH)] = "#6BB6D7";

opts.push({});
opts[opts.length - 1][kC.TRAEGERTYP.indexOf(kC.TRAEGERTYP_STAEDTISCH)] = "#B0CBEC";
opts[opts.length - 1][kC.TRAEGERTYP.indexOf(kC.TRAEGERTYP_ANDERE)] = "#3C70BB";
opts[opts.length - 1][kC.TRAEGERTYP.indexOf(kC.TRAEGERTYP_BETRIEBSKITA)] = "#337F99";
opts[opts.length - 1][kC.TRAEGERTYP.indexOf(kC.TRAEGERTYP_ELTERNINITIATIVE)] = "#9CD3CD";
opts[opts.length - 1][kC.TRAEGERTYP.indexOf(kC.TRAEGERTYP_KATHOLISCH)] = "#6998DC";
opts[opts.length - 1][kC.TRAEGERTYP.indexOf(kC.TRAEGERTYP_EVANGELISCH)] = "#96C1EB";


export const getColorForProperties = (properties, featureRendering) => {
  if (featureRendering === kitasConstants.FEATURE_RENDERING_BY_PROFIL) {
    if (properties.plaetze_fuer_behinderte === true) {
      return "#00B4CC";
    } else {
      return "#A83F6A";
    }
  } else if (featureRendering === kitasConstants.FEATURE_RENDERING_BY_TRAEGERTYP) {
    const lookup = opts[0];
    const color = lookup[properties.traegertyp];
    if (color) {
      return color;
    } else {
      return "#AAAAAA";
    }
  } else if (featureRendering === kitasConstants.FEATURE_RENDERING_BY_TRAEGERTYP2) {
    const lookup = opts[1];
    const color = lookup[properties.traegertyp];
    if (color) {
      return color;
    } else {
      return "#AAAAAA";
    }
  } else if (featureRendering === kitasConstants.FEATURE_RENDERING_BY_TRAEGERTYP3) {
    const lookup = opts[2];
    const color = lookup[properties.traegertyp];
    if (color) {
      return color;
    } else {
      return "#AAAAAA";
    }
  } else {
    return "#333333";
  }
};

export const getAgeString = properties => {
  switch (kitasConstants.ALTER[properties.alter]) {
    case kitasConstants.ALTER_UNTER2:
      return "unter 2 Jahre";
    case kitasConstants.ALTER_AB2:
      return "ab 2 Jahre";
    case kitasConstants.ALTER_AB3:
      return "ab 3 Jahre";
    default:
      return "keine Angabe";
  }
};

export const getHoursString = properties => {
  switch (kitasConstants.STUNDEN[properties.stunden]) {
    case kitasConstants.STUNDEN_NUR_35:
      return "nur 35h pro Woche";
    case kitasConstants.STUNDEN_NUR_35_u_45:
      return "35h oder 45h pro Woche";
    case kitasConstants.STUNDEN_NUR_45:
      return "nur 45h pro Woche";
    default:
      return "keine Angabe";
  }
};

export const getDescription = properties => {
  switch (kitasConstants.TRAEGERTYP[properties.traegertyp]) {
    case kitasConstants.TRAEGERTYP_STAEDTISCH:
      return (
        "Kindertageseinrichtung mit " + properties.plaetze + " Plätzen in städtischer Trägerschaft"
      );
    case kitasConstants.TRAEGERTYP_EVANGELISCH:
      return (
        "Kindertageseinrichtung mit " +
        properties.plaetze +
        " Plätzen in kirchlicher Trägerschaft (evangelisch)"
      );
    case kitasConstants.TRAEGERTYP_KATHOLISCH:
      return (
        "Kindertageseinrichtung mit " +
        properties.plaetze +
        " Plätzen in kirchlicher Trägerschaft (katholisch)"
      );
    case kitasConstants.TRAEGERTYP_ELTERNINITIATIVE:
      return (
        "Kindertageseinrichtung mit " +
        properties.plaetze +
        " Plätzen in Trägerschaft einer Elterninitiative"
      );
    case kitasConstants.TRAEGERTYP_ANDERE:
      return "Kindertageseinrichtung mit " + properties.plaetze + " Plätzen in freier Trägerschaft";
    case kitasConstants.TRAEGERTYP_BETRIEBSKITA:
      return "Betriebskindertageseinrichtung mit " + properties.plaetze + " Plätzen";
    default:
      return "keine Angabe";
  }
};

export const featureHoverer = feature => {
  return "<div>" + feature.properties.kurzname + "</div>";
};

export const getFilterDescription = filter => {
  let profileDesc;
  let ageDesc;
  let umfangDesc;
  let traegerDesc = "";

  const chkProfilInklusion = filter.profil.indexOf(kitasConstants.PROFIL_INKLUSION) !== -1;
  const chkProfilNormal = filter.profil.indexOf(kitasConstants.PROFIL_NORMAL) !== -1;

  if (chkProfilInklusion && chkProfilNormal) {
    profileDesc = "alle Kitas";
  } else if (chkProfilInklusion) {
    profileDesc = "Kitas mit Schwerpunkt Inklusion";
  } else if (chkProfilNormal) {
    profileDesc = "Kitas ohne Schwerpunkt Inklusion";
  } else {
    return "Kein Kita-Profil ausgewählt.";
  }

  if (filter.traeger.length < kitasConstants.TRAEGERTYP.length) {
    const remainingTraeger = new Set(kitasConstants.TRAEGERTYP);
    const filteredTraeger = new Set();

    for (let traeger of filter.traeger) {
      if (filter.traeger.length > 3) {
        remainingTraeger.delete(traeger);
      } else {
        filteredTraeger.add(traeger);
      }
    }

    if (filter.traeger.length > 3) {
      traegerDesc =
        "| ohne " +
        Array.from(remainingTraeger)
          .map(t => kitasConstants.TRAEGERTEXT_FOR_DESCRIPTION[t])
          .join(" und ");
    } else {
      let joiner;
      if (filteredTraeger.size === 2) {
        joiner = " und ";
      } else {
        joiner = ", ";
      }
      traegerDesc =
        "| nur " +
        Array.from(filteredTraeger)
          .map(t => kitasConstants.TRAEGERTEXT_FOR_DESCRIPTION[t])
          .join(joiner);
    }
  }
  console.log(traegerDesc);

  const radioAgeUnter2 = filter.alter.indexOf(kitasConstants.ALTER_UNTER2) !== -1;
  const radioAgeAb2 = filter.alter.indexOf(kitasConstants.ALTER_AB2) !== -1;
  //onst radioAgeAb3=(filter.profil.indexOf(kitasConstants.ALTER_AB3) !== -1);

  if (radioAgeUnter2) {
    ageDesc = "Kinder unter 2 Jahre";
  } else if (radioAgeAb2) {
    ageDesc = "Kinder ab 2 Jahre";
  } else {
    ageDesc = "Kinder ab 3 Jahre";
  }

  const chkUmfang35h = filter.umfang.indexOf(kitasConstants.STUNDEN_FILTER_35) !== -1;
  const chkUmfang45h = filter.umfang.indexOf(kitasConstants.STUNDEN_FILTER_45) !== -1;

  if (chkUmfang35h && chkUmfang45h) {
    umfangDesc = "35h oder 45h pro Woche";
  } else if (chkUmfang35h) {
    umfangDesc = "35h pro Woche";
  } else if (chkUmfang45h) {
    umfangDesc = "45h pro Woche";
  } else {
    return "Kein Stundenumfang ausgewählt.";
  }

  return `${profileDesc} ${traegerDesc} | ${ageDesc} | ${umfangDesc}`;
};
