import ColorHash from 'color-hash';
import Color from 'color';
import L from 'leaflet';
import createSVGPie from 'create-svg-pie';
import createElement from 'svg-create-element';

export const featureStyler = (feature) => {
    var color = Color(getColorForProperties(feature));
    let radius = 10;
    let selectionBox = 30;
    let weight = 2;
    let svgSize = radius * 2 + weight * 2;
    if (feature.selected) {
        svgSize = 36;
    }
     

    let svg = `<svg height="${svgSize}" width="${svgSize}">            
                    <image x="${(svgSize - 20) / 2}" y="${(svgSize - 20) / 2}" width="20" height="20" xlink:href="/pois/signaturen/`+getSignatur(feature)+`" />
               </svg>  `

    if (feature.selected) {
        svg = `<svg height="${svgSize}" width="${svgSize}">
              <rect visible="false" x="${ (svgSize - selectionBox) / 2}" y="${ (svgSize - selectionBox) / 2}" rx="8" ry="8" width="${selectionBox}" height="${selectionBox}" fill="rgba(67, 149, 254, 0.8)" stroke-width="0"/>
              <image x="${(svgSize - 20) / 2}" y="${(svgSize - 20) / 2}" width="20" height="20" xlink:href="/pois/signaturen/`+getSignatur(feature)+`"  />
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

export const poiClusterIconCreator = (cluster) => {
    var childCount = cluster.getChildCount();
    const color="#A83F6A";
    const values = [];
    const colors = [];
    const r = 16;
     
    // Pie with default colors 
    let childMarkers=cluster.getAllChildMarkers();

    let containsSelection=false;
    let inCart=false;
    for (let marker of childMarkers) {
        values.push(1);
        colors.push(Color(getColorForProperties(marker.feature)));
        if (marker.feature.selected===true){
            containsSelection=true;
        }
        if (marker.feature.inCart){
            inCart=true;
        }
    }
    const pie = createSVGPie(values, r, colors);

    let background=createElement('svg', {
        width:40,
         height:40,
         viewBox:"0 0 40 40"
    });


    //Kleiner Kreis in der Mitte
    // (blau wenn selektion)
    let innerCircleColor="#ffffff";
    if (containsSelection) {
        innerCircleColor="rgb(67, 149, 254)";
    }
    pie.appendChild(createElement('circle', {
        cx:r,
        cy:r,
        r:8,
        "stroke-width":0,
        "opacity": "0.5",
        fill: innerCircleColor
    }));

    background.appendChild(pie);

    background.appendChild(createElement('circle', {
        cx:20,
        cy:20,
        r:r,
        "stroke-width":2,
        stroke: "#000000",
        opacity: "0.5",
        fill: "none"
        
    }));

    
    if (inCart) {
        background.appendChild(createElement('text', {
            x:"50%",
            y:"50%",
            "text-anchor":"middle",
            "font-family":"FontAwesome",
            "fill":"#fff",
            "font-size":"26",
            "dy":".4em",
            opacity: "0.5",
        })).appendChild(document.createTextNode("\uf005"));
    }

    background.appendChild(createElement('text', {
        x:"50%",
        y:"50%",
        "text-anchor":"middle",
        "dy":".3em",
    })).appendChild(document.createTextNode(childCount));
    
    pie.setAttribute("x",4);
    pie.setAttribute("y",4);




    var divIcon = L.divIcon({
            className: "leaflet-data-marker",
            html: background.outerHTML || new XMLSerializer().serializeToString(background), //IE11 Compatibility
            iconAnchor: [
                20 ,
                20
            ],
            iconSize: [40, 40]
        });
        //console.log(background.outerHtml)
        return divIcon;
};

export const getColorForProperties = (feature) => {
    let colorHash = new ColorHash({saturation: 0.3});
    let {mainlocationtype}=feature.properties;
    let ll=mainlocationtype.lebenslagen;
    //console.log(colorHash.hex("" + JSON.stringify({ll})));
    //return colorHash.hex("" + JSON.stringify({ll}));
    return "#A83F6A";
};

//
// export const featureLabeler = (feature) => {   let base = {
// "color":getColorForProperties(feature),     };   return (     <Icon
// style={base} name="circle" />   ); };

export const featureHoverer = (feature) => {
    return "<div>" + feature.text + "</div>";
};


export const getCartStringForAdding = (cart,newId) => {
    let cartIds=cart.map(x=>x.id);
    cartIds.push(newId);
    cartIds.sort((a,b)=>parseInt(a,10)-parseInt(b,10));
    return cartIds.join();
}

export const getCartStringForRemoving = (cart,removedId) => {
    let cartIds=new Set(cart.map(x=>x.id));
    cartIds.delete(removedId);
    let arr=Array.from(cartIds).sort((a,b)=>parseInt(a,10)-parseInt(b,10));
    return arr.join();
}


const getSignatur = (feature) => {
    if (feature.properties.signatur){
        return feature.properties.signatur;
    }
    else if (feature.properties.mainlocationtype.signatur){
        return feature.properties.mainlocationtype.signatur;
    }
    else {
        for (let type of feature.properties.locationtypes){
            if (type.signatur) {
                return type.signatur;
            }
        }
    }
    return "burg.svg"; //TODO sinnvoller default
}