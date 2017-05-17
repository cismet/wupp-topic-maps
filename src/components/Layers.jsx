import React from 'react';
import { TileLayer, WMSTileLayer } from 'react-leaflet';


export const Layers = new Map();


Layers.set("nrwDOP20", (opacity) => {
  return (
    <WMSTileLayer
      key="nrwDOP20"
      url="https://www.wms.nrw.de/geobasis/wms_nw_dop20"
      layers="nw_dop20"
      format="image/png"
      tiled="true"
      //crs={L.CRS.EPSG3857}
      maxZoom={19}
      opacity={opacity}
    />
  );
});


Layers.set("osm", (opacity) => {
  return (
    <WMSTileLayer
      key="Terrestris OSM"
      url="http://ows.terrestris.de/osm/service"
      layers="OSM-WMS"
      format="image/png"
      tiled="true"
      maxZoom={19}
      opacity={opacity}
    />
  );
});


Layers.set("abkf", (opacity) => {
  return (
    <WMSTileLayer
      key="ABK"
      url="http://geoportal.wuppertal.de:80/deegree/wms"
      layers="abkf"
      format="image/png"
      tiled="true"
      maxZoom={19}
      opacity={opacity}
    />
  );
});
Layers.set("abkg", (opacity) => {
  return (
    <WMSTileLayer
      key="ABK"
      url="http://geoportal.wuppertal.de:80/deegree/wms"
      layers="abkg"
      format="image/png"
      tiled="true"
      maxZoom={19}
      opacity={opacity}
    />
  );
});



Layers.set("abkIntra", (opacity) => {
  return (
    <WMSTileLayer
      key="StadtgrundKarteABK"
      url="http://localhost/alkis/services"
      layers="alkomf"
      format="image/png"
      tiled="true"
      maxZoom={19}
      opacity={opacity}
    />
  );
});

Layers.set("abkIntraNC", (opacity) => {
  return (
    <WMSTileLayer
      key="StadtgrundKarteABK"
      url="http://s10221:7098/alkis/services"
      layers="alkomf"
      format="image/png"
      tiled="true"
      maxZoom={19}
      opacity={opacity}
    />
  );
});

Layers.set("orthoIntra", (opacity) => {
  return (
    <WMSTileLayer
      key="Ortho2014"
      url="http://localhost/orthofotos/services"
      layers="WO2014"
      format="image/png"
      tiled="true"
      maxZoom={19}
      opacity={opacity}
    />
  );
});

Layers.set("orthoIntraNC", (opacity) => {
  return (
    <WMSTileLayer
      key="Ortho2014"
      url="http://s10221:7098/orthofotos/services"
      layers="WO2014"
      format="image/png"
      tiled="true"
      maxZoom={19}
      opacity={opacity}
    />
  );
});





Layers.set("ESRILayer", (opacity) => {
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
      opacity={opacity}
    />
  );
});


Layers.set("CartoLayer", (opacity) => {
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
      opacity={opacity}
    />
  );
});


