import Color from 'color';
import ColorHash from 'color-hash';
import createSVGPie from 'create-svg-pie';
import L from 'leaflet';
import queryString from 'query-string';
import React from 'react';
import SVGInline from 'react-svg-inline';
import slugify from 'slugify';
import createElement from 'svg-create-element';
import { poiColors } from '../constants/colors.js';
import store from '../redux/store';

const fallbackSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="311.668" height="311.668">
        <path class="bg-fill" fill="#C32D6A"  d="M0-.661h313.631v313.63H0z"/>
        <path class="fg-fill" fill="#FFF"  d="M292.827 156.794c0 18.76-3.584 36.451-10.733 53.095-7.187 16.681-16.929 31.17-29.302 43.523-12.354 12.392-26.88 22.152-43.523 29.302s-34.335 10.733-53.094 10.733c-18.74 0-36.432-3.584-53.104-10.733-16.653-7.149-31.17-16.91-43.533-29.302-12.354-12.354-22.125-26.843-29.273-43.523-7.159-16.644-10.743-34.335-10.743-53.095 0-18.74 3.584-36.432 10.743-53.084 7.149-16.653 16.919-31.17 29.273-43.533 12.363-12.354 26.88-22.144 43.533-29.293 16.671-7.148 34.363-10.742 53.104-10.742 18.759 0 36.45 3.594 53.094 10.742 16.644 7.149 31.17 16.939 43.523 29.293 12.373 12.363 22.115 26.88 29.302 43.533 7.149 16.652 10.733 34.344 10.733 53.084zm-24.612 0c0-15.347-2.936-29.854-8.77-43.523-5.853-13.66-13.859-25.575-24.021-35.746-10.143-10.132-22.058-18.14-35.727-23.983-13.649-5.881-28.177-8.808-43.523-8.808-15.356 0-29.855 2.926-43.543 8.808-13.66 5.843-25.556 13.851-35.708 23.983-10.152 10.171-18.159 22.086-24.021 35.746-5.853 13.669-8.789 28.177-8.789 43.523 0 15.385 2.936 29.874 8.789 43.524 5.862 13.669 13.869 25.584 24.021 35.745 10.152 10.142 22.048 18.149 35.708 24.002 13.688 5.872 28.187 8.788 43.543 8.788 15.347 0 29.874-2.916 43.523-8.788 13.669-5.853 25.584-13.86 35.727-24.002 10.161-10.161 18.168-22.076 24.021-35.745 5.834-13.65 8.77-28.139 8.77-43.524zm-32.79 0c0 10.943-2.078 21.237-6.234 30.865-4.155 9.608-9.855 17.997-17.005 25.184-7.149 7.149-15.537 12.812-25.146 16.968-9.628 4.156-19.923 6.253-30.865 6.253-10.943 0-21.219-2.097-30.846-6.253s-18.035-9.818-25.184-16.968c-7.158-7.187-12.811-15.575-16.977-25.184-4.166-9.628-6.244-19.922-6.244-30.865 0-10.924 2.078-21.18 6.244-30.846 4.166-9.627 9.818-18.016 16.977-25.165 7.149-7.178 15.557-12.83 25.184-16.996s19.903-6.263 30.846-6.263c10.942 0 21.237 2.097 30.865 6.263 9.608 4.166 17.996 9.818 25.146 16.996 7.149 7.149 12.85 15.538 17.005 25.165 4.156 9.666 6.234 19.922 6.234 30.846z"/>
    </svg>
`;
const ladestationSVG = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Creator: CorelDRAW -->
<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve"  shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd"
viewBox="0 0 524.197 523.652"
 xmlns:xlink="http://www.w3.org/1999/xlink">
 <g id="Ebene_x0020_1">
  <metadata id="CorelCorpID_0Corel-Layer"/>
  <path class="bg-fill" fill="#003B80" d="M52.3641 0l418.923 0c28.8003,0 52.3641,23.5638 52.3641,52.3641l0 418.923c0,28.8003 -23.5638,52.3641 -52.3641,52.3641l-418.923 0c-28.8003,0 -52.3641,-23.5638 -52.3641,-52.3641l0 -418.923c0,-28.8003 23.5638,-52.3641 52.3641,-52.3641z"/>
  <path class="fg-fill" fill="white" fill-rule="nonzero" d="M126.923 496.835c-15.5305,0 -29.5952,-6.29848 -39.7761,-16.4793 -10.1808,-10.1808 -16.4793,-24.2461 -16.4793,-39.7766 0,-15.5305 6.29848,-29.5957 16.4793,-39.7761 10.1808,-10.1808 24.2456,-16.4793 39.7761,-16.4793 15.5315,0 29.5957,6.29848 39.7766,16.4793 10.1808,10.1803 16.4793,24.2456 16.4793,39.7761 0,15.5315 -6.29848,29.5957 -16.4793,39.7766 -10.1808,10.1808 -24.2451,16.4793 -39.7766,16.4793zm-21.2639 -34.9914c5.44179,5.44179 12.9609,8.80887 21.2639,8.80887 8.30354,0 15.8227,-3.36708 21.2644,-8.80887 5.44179,-5.44179 8.80887,-12.9609 8.80887,-21.2644 0,-8.30354 -3.36708,-15.8221 -8.80887,-21.2639 -5.44179,-5.44179 -12.9609,-8.80887 -21.2644,-8.80887 -8.30302,0 -15.8221,3.36708 -21.2639,8.80887 -5.44179,5.44179 -8.80887,12.9604 -8.80887,21.2639 0,8.30302 3.36708,15.8227 8.80887,21.2644z"/>
  <path class="fg-fill" fill="white" fill-rule="nonzero" d="M381.68 496.835c-15.5305,0 -29.5952,-6.29848 -39.7761,-16.4793 -10.1808,-10.1808 -16.4793,-24.2461 -16.4793,-39.7766 0,-15.5305 6.29848,-29.5957 16.4793,-39.7761 10.1808,-10.1808 24.2456,-16.4793 39.7761,-16.4793 15.5315,0 29.5957,6.29848 39.7766,16.4793 10.1808,10.1803 16.4793,24.2456 16.4793,39.7761 0,15.5315 -6.29848,29.5957 -16.4793,39.7766 -10.1808,10.1808 -24.2451,16.4793 -39.7766,16.4793zm-21.2639 -34.9914c5.44179,5.44179 12.9609,8.80887 21.2639,8.80887 8.30354,0 15.8227,-3.36708 21.2644,-8.80887 5.44179,-5.44179 8.80887,-12.9609 8.80887,-21.2644 0,-8.30354 -3.36708,-15.8221 -8.80887,-21.2639 -5.44179,-5.44179 -12.9609,-8.80887 -21.2644,-8.80887 -8.30302,0 -15.8221,3.36708 -21.2639,8.80887 -5.44179,5.44179 -8.80887,12.9604 -8.80887,21.2639 0,8.30302 3.36708,15.8227 8.80887,21.2644z"/>
  <path class="fg-fill" fill="white" d="M162.067 335.351l259.09 0c-1.42957,-4.27771 -2.75493,-8.68686 -4.09653,-13.151 -7.69087,-21.8096 -15.4702,-46.2374 -37.1175,-50.2239 -20.4475,-3.76558 -39.9253,-5.37057 -58.738,-5.76802 -28.6008,-0.604818 -51.8059,1.55682 -59.8576,3.14505 -20.1213,3.97033 -33.9222,17.1627 -48.4032,31.0054 -4.36778,4.1756 -8.7942,8.40723 -13.7951,12.7771 -0.320998,0.280677 -0.654564,0.537267 -0.99808,0.771339 -9.39326,7.08972 -19.2185,13.3201 -29.4413,18.3592 -2.1941,1.08134 -4.40862,2.11084 -6.64304,3.08483zm-115.49 97.9187c-18.5724,-10.8354 -25.4259,-27.3419 -24.1681,-46.7553 2.84605,-43.9281 44.7429,-49.1206 106.943,-62.3418 0.579682,-0.239832 1.18974,-0.430442 1.82597,-0.56502 9.81375,-2.08152 19.2683,-5.5062 28.3364,-9.97609 9.13772,-4.50445 17.845,-10.0133 26.1067,-16.2442 4.30913,-3.77343 8.68424,-7.95584 13.0012,-12.0827 16.7296,-15.9918 32.6727,-31.2332 58.738,-36.376 8.8162,-1.73905 33.8635,-4.11381 64.251,-3.47076 19.8307,0.418921 42.0372,2.11398 63.6457,6.09373 45.7284,8.42032 41.1396,54.6326 73.7678,77.8612 9.47233,6.74359 13.9935,10.7998 22.7317,18.1718 40.007,33.7499 19.5359,100.733 -21.6389,99.5278l-0.328853 -0.00261826c0.179089,-2.15326 0.271775,-4.33112 0.271775,-6.53046 0,-21.4655 -8.70466,-40.9045 -22.7762,-54.975 -14.0716,-14.0716 -33.51,-22.7762 -54.9761,-22.7762 -21.4655,0 -40.9045,8.70466 -54.975,22.7762 -14.0716,14.0705 -22.7762,33.5095 -22.7762,54.975 0,1.45994 0.0413685,2.91046 0.120964,4.3505l-100.264 0.0801187c0.0822133,-1.46622 0.125676,-2.94345 0.125676,-4.43062 0,-21.4655 -8.70466,-40.9045 -22.7762,-54.975 -14.0716,-14.0716 -33.51,-22.7762 -54.9761,-22.7762 -21.4655,0 -40.9045,8.70466 -54.975,22.7762 -12.5147,12.5137 -20.7837,29.2742 -22.4605,47.9293l-2.77535 -0.26392z"/>
  <path class="fg-fill" fill="white" d="M379.639 47.3371c0.99808,-0.0356083 0.148193,-0.0534125 0.773433,-0.0534125l38.7596 0c23.9277,0 39.0503,15.9017 45.4959,36.2503 1.21958,3.85093 2.10822,7.89876 2.66643,12.0461l56.8628 -0.103159 0 18.7792 -56.5664 0.102636c-0.510037,5.01449 -1.4966,9.9143 -2.95916,14.5308 -6.44091,20.3297 -21.5545,36.2084 -45.4996,36.2084l-38.7596 0c-0.651946,0 0.35713,-0.0198988 -1.04416,-0.0612672l-1.03107 -0.0298481c-6.96142,-0.381742 -12.3488,-6.15081 -12.3435,-13.04l-0.0319427 0 0 -9.28434 -53.0087 0c-5.20562,0 -9.42573,-4.22011 -9.42573,-9.42573 0,-5.20562 4.22011,-9.42573 9.42573,-9.42573l53.0087 0 0 -33.1477 -54.2571 0c-5.20562,0 -9.42573,-4.22011 -9.42573,-9.42573 0,-5.20562 4.22011,-9.42573 9.42573,-9.42573l54.2571 0 0 -11.4172c0,-7.23006 5.86123,-13.0913 13.0913,-13.0913 0.196369,0 0.391691,0.00471286 0.585966,0.0136149z"/>
 </g>
</svg>
`;

export const getConnectorImageUrl = (type) => {
  const sluggedType = slugify(type);

  return '/images/emob/dynamic/' + sluggedType + '.png';
};

export const getFeatureStyler = (svgSize = 24, colorizer = getColorForProperties) => {
  return (feature) => {
    var color = Color(colorizer(feature.properties));
    let radius = svgSize / 2; //needed for the Tooltip Positioning
    let canvasSize = svgSize;
    if (feature.selected) {
      canvasSize = svgSize + 12;
    }

    let selectionBox = canvasSize - 6;
    let badge = feature.properties.svgBadge || fallbackSVG; //|| `<image x="${(svgSize - 20) / 2}" y="${(svgSize - 20) / 2}" width="20" height="20" xlink:href="/pois/signaturen/`+getSignatur(feature.properties)+`" />`;

    let svg = `<svg id="badgefor_${feature.id}" height="${canvasSize}" width="${canvasSize}"> 
                    <style>
                    /* <![CDATA[ */
                        #badgefor_${feature.id} .bg-fill  {
                            fill: ${colorizer(feature.properties)};
                        }
                        #badgefor_${feature.id} .bg-stroke  {
                            stroke: ${colorizer(feature.properties)};
                        }
                        #badgefor_${feature.id} .fg-fill  {
                            fill: white;
                        }
                        #badgefor_${feature.id} .fg-stroke  {
                            stroke: white;
                        }
                    /* ]]> */
                    </style>
                <svg x="${svgSize / 12}" y="${svgSize / 12}"  width="${
      svgSize - (2 * svgSize) / 12
    }" height="${svgSize - (2 * svgSize) / 12}" viewBox="0 0 ${
      feature.properties.svgBadgeDimension.width
    } ${feature.properties.svgBadgeDimension.height}">       
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
                            fill: ${colorizer(feature.properties)};
                        }
                        #badgefor_${feature.id} .bg-stroke  {
                            stroke: ${colorizer(feature.properties)};
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
                <svg x="${selectionOffset + innerBadgeOffset}" y="${
          selectionOffset + innerBadgeOffset
        }" width="${badgeDimension}" height="${badgeDimension}" viewBox="0 0 ` +
        feature.properties.svgBadgeDimension.width +
        ` ` +
        feature.properties.svgBadgeDimension.height +
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
      svgSize: canvasSize,
    };
    return style;
  };
};
export const getPoiClusterIconCreatorFunction = (
  svgSize = 24,
  colorizer = getColorForProperties
) => {
  //return a function because the functionCall of the iconCreateFunction cannot be manipulated
  return (cluster) => {
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
      colors.push(Color(colorizer(marker.feature.properties)));
      if (marker.feature.selected === true) {
        containsSelection = true;
      }
      if (marker.feature.inCart) {
        inCart = true;
      }
    }
    const pie = createSVGPie(values, r, colors);

    let canvasSize = (svgSize / 3.0) * 5.0;
    let background = createElement('svg', {
      width: canvasSize,
      height: canvasSize,
      viewBox: `0 0 ${canvasSize} ${canvasSize}`,
    });

    //Kleiner Kreis in der Mitte
    // (blau wenn selektion)
    let innerCircleColor = '#ffffff';
    if (containsSelection) {
      innerCircleColor = 'rgb(67, 149, 254)';
    }

    //inner circle
    pie.appendChild(
      createElement('circle', {
        cx: r,
        cy: r,
        r: svgSize / 3.0,
        'stroke-width': 0,
        opacity: '0.5',
        fill: innerCircleColor,
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
      createElement('circle', {
        cx: canvasSize / 2.0,
        cy: canvasSize / 2.0,
        r: r,
        'stroke-width': 2,
        stroke: '#000000',
        opacity: '0.5',
        fill: 'none',
      })
    );

    if (inCart) {
      background
        .appendChild(
          createElement('text', {
            x: '50%',
            y: '50%',
            'text-anchor': 'middle',
            'font-family': 'FontAwesome',
            fill: '#fff',
            'font-size': '26',
            dy: '.4em',
            opacity: '0.5',
          })
        )
        .appendChild(document.createTextNode('\uf005'));
    }

    background
      .appendChild(
        createElement('text', {
          x: '50%',
          y: '50%',
          'text-anchor': 'middle',
          dy: '.3em',
        })
      )
      .appendChild(document.createTextNode(childCount));

    pie.setAttribute('x', (canvasSize - r * 2) / 2.0);
    pie.setAttribute('y', (canvasSize - r * 2) / 2.0);

    var divIcon = L.divIcon({
      className: 'leaflet-data-marker',
      html: background.outerHTML || new XMLSerializer().serializeToString(background), //IE11 Compatibility
      iconAnchor: [canvasSize / 2.0, canvasSize / 2.0],
      iconSize: [canvasSize, canvasSize],
    });
    //console.log(background.outerHtml)
    return divIcon;
  };
};

export const getColorForProperties = (properties) => {
  if (properties.online === false) {
    return '#888A87';
  } else {
    return '#003D7D';
  }
};
export const getColorFromLebenslagenCombination = (combination) => {
  let qColorRules;
  let colorCandidate;
  let lookup = null;
  try {
    qColorRules = queryString.parse(store.getState().routing.location.search).colorRules;

    if (qColorRules) {
      try {
        lookup = JSON.parse(qColorRules);
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    //problem dduring colorRulesn override
  }
  if (lookup === null) {
    lookup = poiColors;
  }

  colorCandidate = lookup[combination];
  if (colorCandidate) {
    return colorCandidate;
  } else {
    let colorHash = new ColorHash({ saturation: 0.3 });
    const c = colorHash.hex(combination);
    console.debug(
      "Keine vordefinierte Farbe für '" +
        combination +
        "' vorhanden. (Ersatz wird automatisch erstellt) --> " +
        c
    );
    return c;
  }
  //return "#A83F6A";
};

export const featureHoverer = (feature) => {
  return '<div>' + feature.text + '</div>';
};

const getSignatur = (properties) => {
  // if (properties.online === false) {
  // 	return 'pikto_e-mobil_X.svg';
  // } else {
  return 'pikto_e-mobil.svg';
  // }
};

export const addSVGToFeature = (feature, manualReloadRequested) => {
  return new Promise(function (fulfilled, rejected) {
    let cacheHeaders = new Headers();
    if (manualReloadRequested) {
      cacheHeaders.append('pragma', 'no-cache');
      cacheHeaders.append('cache-control', 'no-cache');
    }

    fetch('/svgs/' + getSignatur(feature), { method: 'get', headers: cacheHeaders })
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error("Server svg response wasn't OK");
        }
      })
      .then((svgText) => {
        const svgDocument = new DOMParser().parseFromString(svgText, 'application/xml');
        const svgObject = svgDocument.documentElement;
        if (svgObject.tagName === 'svg') {
          feature.svgBadge = svgText;
          feature.svgBadgeDimension = {
            width: svgObject.getAttribute('width'),
            height: svgObject.getAttribute('height'),
          };
          fulfilled(feature);
        } else {
          throw new Error("Server svg response wasn't a SVG");
        }
      })
      .catch(function (error) {
        console.error('Problem bei /svgs/' + getSignatur(feature), error);
        console.error(error);

        //fallback SVG
        console.log('Will use fallbackSVG for ' + getSignatur(feature));

        feature.svgBadge = fallbackSVG;
        feature.svgBadgeDimension = {
          width: '311.668',
          height: '311.668',
        };
        fulfilled(feature);
      });
  });
};

export const getSymbolSVG = (
  svgSize = 30,
  bg = '#FF0000',
  kind = '-',
  svgStyleRelatedId = 'default',
  svgCodeInput = ladestationSVG
) => {
  let bdim = {
    width: 20,
    height: 20,
  };

  let svgCode = `<svg  id="${svgStyleRelatedId}" height="${svgSize}" width="${svgSize}"> 
                    <style>
                    /* <![CDATA[ */
                        #${svgStyleRelatedId} .bg-fill  {
                            fill: ${bg};
                        }
                        #${svgStyleRelatedId} .bg-stroke  {
                            stroke: ${bg};
                        }
                        #${svgStyleRelatedId} .fg-fill  {
                            fill: white;
                        }
                        #${svgStyleRelatedId} .fg-stroke  {
                            stroke: white;
                        }
                    /* ]]> */
                    </style>
                <svg x="${svgSize / bdim.width / 2}" y="${svgSize / bdim.height / 2}"  width="${
    svgSize - (2 * svgSize) / bdim.width / 2
  }" height="${svgSize - (2 * svgSize) / bdim.height / 2}" viewBox="0 0 ${bdim.width} ${
    bdim.height || 24
  }">       
                    ${svgCodeInput}
                </svg>
                </svg>  `;

  return <SVGInline svg={svgCode} />;
};
