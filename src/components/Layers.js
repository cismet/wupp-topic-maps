import React from 'react';
import { TileLayer, WMSTileLayer } from 'react-leaflet';
import StyledWMSTileLayer from './StyledWMSTileLayer'
import PropTypes from 'prop-types';

export const Layers = new Map();

let defaultOptions={"opacity":1.0};

Layers.set("nrwDOP20", (options=defaultOptions) => {
  return (
    <StyledWMSTileLayer
      key="nrwDOP20"
      url="https://wunda-geoportal-cache.cismet.de/nrwDOP20"
      layers="nw_dop20"
      format="image/png"
      tiled="true"
      //crs={L.CRS.EPSG3857}
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}

    />
  );
});


Layers.set("osm", (options=defaultOptions) => {
  return (
    <StyledWMSTileLayer
      key="Terrestris OSM"
      url="http://ows.terrestris.de/osm/service"
      layers="OSM-WMS"
      format="image/png"
      tiled="true"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}

    />
  );
});


Layers.set("abkf", (options=defaultOptions) => {
  return (
    <StyledWMSTileLayer
      key="abkf"
      url="https://wunda-geoportal-cache.cismet.de/geoportal"
      layers="abkf"
      format="image/png"
      tiled="true"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}

    />
  );
});

Layers.set("nrs", (options=defaultOptions) => {
  return (
    <StyledWMSTileLayer
      key="nrs"
      url="https://wunda-geoportal-cache.cismet.de/geoportal"
      layers="R102%3Astadtgrundkarte_hausnr"
      format="image/png"
      transparent="true"
      tiled="true"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}

    />
  );
});

Layers.set("abkg", (options=defaultOptions) => {
  return (
    <StyledWMSTileLayer
      key="abkf"
      url="https://wunda-geoportal-cache.cismet.de/geoportal"
      layers="abkg"
      format="image/png"
      tiled="true"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}

    />
  );
});
Layers.set("bplan_abkg", (options=defaultOptions) => {
  return (
    <StyledWMSTileLayer
      key="bplan_abkg"
      url="https://wunda-geoportal-cache.cismet.de/geoportal"
      layers="bplanreihe"
      format="image/png"
      tiled="true"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}

    />
  );
});


Layers.set("bplan_abkg", (options=defaultOptions) => {
  return (
    <StyledWMSTileLayer
      key="bplan_abkg"
      url="https://wunda-geoportal-cache.cismet.de/geoportal"
      layers="bplanreihe"
      format="image/png"
      tiled="true"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}

    />
  );
});

Layers.set("bplan_abkg_uncached", (options=defaultOptions) => {
  return (
    <StyledWMSTileLayer
      key="bplan_abkg_uncached"
      url="https://geoportal.wuppertal.de/deegree/wms"
      layers="bplanreihe"
      format="image/png"
      tiled="true"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}

    />
  );
});

Layers.set("bplan_ovl", (options=defaultOptions) => {
  return (
    <StyledWMSTileLayer
      key="bplan_ovl"
      url="https://geoportal.wuppertal.de/deegree/wms"
      layers="bplanhintergrund"
      format="image/png"
      tiled="true"
      transparent="true"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}

    />
  );
});

Layers.set("bplan_ovl_cached", (options=defaultOptions) => {
  return (
    <StyledWMSTileLayer
      key="bplan_ovl_cached"
      url="https://wunda-geoportal-cache.cismet.de/geoportal"
      layers="bplanhintergrund"
      format="image/png"
      tiled="true"
      transparent="true"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}

    />
  );
});



Layers.set("abkIntra", (options=defaultOptions) => {
  return (
    <StyledWMSTileLayer
      key="StadtgrundKarteABK"
      url="http://s10221:7098/alkis/services"
      layers="alkomf"
      format="image/png"
      tiled="true"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}

    />
  );
});

Layers.set("uwBPlan", (options=defaultOptions) => {
  return (
    <StyledWMSTileLayer
      key="BPlanreihe auf Umwis"
      url="https://geoportal.wuppertal.de/deegree/wms"
      layers="bplanreihe,bplanhintergrund"
      format="image/png"
      tiled="true"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}

    />
  );
});

Layers.set("uwBPlanCached", (options=defaultOptions) => {
  return (
    <StyledWMSTileLayer
      key="BPlanreihe auf Umwis"
      url="https://wunda-geoportal-cache.cismet.de/geoportal"
      layers="bplanreihe,bplanhintergrund"
      format="image/png"
      tiled="true"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}

    />
  );
});


Layers.set("rvrWMS", (options=defaultOptions) => {
  return (
    <StyledWMSTileLayer
      key="stadtplan_rvr"
      url="https://rvr.demo.omniscale.net/mapproxy/service"
      layers="stadtplan_rvr"
      format="image/png"
      tiled="false"
      version="1.3.0"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}
    />
  );
});

Layers.set("XrvrWMS", (options=defaultOptions) => {
    return (
      <StyledWMSTileLayer
        key="Xstadtplan_rvr"
        url="https://rvr.demo.omniscale.net/mapproxy/service"
        layers="stadtplan_rvr"
        format="image/png"
        tiled="false"
        version="1.3.0"
        maxZoom={19}
        opacity={options.opacity}
        cssFilter={options["css-filter"]}
      />
    );
  });

Layers.set("ruhrWMS", (options=defaultOptions) => {
    return (
      <StyledWMSTileLayer
        key="ruhr_stadtplan_rvr"
        url="https://geodaten.metropoleruhr.de/spw2/service"
        layers="stadtplan_rvr"
        format="image/png"
        tiled="false"
        version="1.3.0"
        maxZoom={19}
        opacity={options.opacity}
        cssFilter={options["css-filter"]}

      />
    );
  });


Layers.set("orthoIntra", (options=defaultOptions) => {
    return (
      <StyledWMSTileLayer
        key="Ortho2014"
        url="http://s10221:7098/orthofotos/services"
        layers="WO2014"
        format="image/png"
        tiled="true"
        maxZoom={19}
        opacity={options.opacity}
        cssFilter={options["css-filter"]}

      />
    );
  });



Layers.set("ESRILayer", (options=defaultOptions) => {
  return (
    <TileLayer
      key="ESRILayer"
      urlX="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
      url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      urlNRW="http://localhost:8080/geowebcache/service/tms/1.0.0/nrw:ortho/{z}/{y}/{x}.jpg"
      urlC="http://localhost:8080/geowebcache/service/tms/1.0.0/OSM-WMS/{x}/{y}/{z}.png"
      attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
      maxZoom={22}
      maxNativeZoom={18}
      opacity={options.opacity}
    />
  );
});

Layers.set("CartoLayer", (options=defaultOptions) => {
  return (
    <TileLayer
      key="CartoLayer"
      urlBW="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
      urlE="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      urlH="http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png"
      url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
      maxNativeZoom={19}
      maxZoom={22}
      opacity={options.opacity}
    />
  );
});


Layers.set("CartoLayer", (options=defaultOptions) => {
    return (
      <TileLayer
        key="CartoLayer"
        urlBW="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        urlE="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        urlH="http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png"
        url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
        maxNativeZoom={19}
        maxZoom={22}
        opacity={options.opacity}
      />
    );
  });
  