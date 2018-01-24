import React from 'react';
import ColorHash from 'color-hash';
import Color from 'color';
import {Icon} from 'react-fa'
import L from 'leaflet';

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

export const ehrenAmtClusterIconCreator = (cluster) => {
    var childCount = cluster.getChildCount();
    let radius = 8;
    let selectionBox = 30;
    let weight = 2;
    let svgSize = radius * 2 + weight * 2;
   // var color = Color(getColorForProperties(feature));
    // let svg = `<svg height="${svgSize}" width="${svgSize}">
    //             <circle cx="${svgSize / 2}" cy="${svgSize / 2}" r="${radius}" stroke="${color.darken(0.5)}" stroke-width="${weight}" fill="${color}" />
    //             </svg>  `

    // var divIcon = L.divIcon({
    //     className: "leaflet-data-marker",
    //     html: theStyle.svg,
    //     iconAnchor: [
    //         theStyle.svgSize / 2,
    //         theStyle.svgSize / 2
    //     ],
    //     iconSize: [theStyle.svgSize, theStyle.svgSize]
    // });

    // marker = L.marker(latlng, {icon: divIcon});
    var c = ' marker-cluster-';
    if (childCount < 10) {
        c += 'small';
    } else if (childCount < 100) {
        c += 'medium';
    } else {
        c += 'large';
    }

    return new L.DivIcon({
        html: '<div><span>_' + childCount + '_</span></div>',
        className: 'marker-cluster' + c,
        iconSize: new L.Point(40, 40)
    });
};

export const getColorForProperties = (feature) => {
    let colorHash = new ColorHash({saturation: 0.3});
    return colorHash.hex("" + JSON.stringify(feature.properties));
};

//
// export const featureLabeler = (feature) => {   let base = {
// "color":getColorForProperties(feature),     };   return (     <Icon
// style={base} name="circle" />   ); };

export const featureHoverer = (feature) => {
    return "<div>" + feature.text + "</div>";
};
