'use client'

import { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Circle, Fill } from 'ol/style';
import 'ol/ol.css';

const OpenLayersMap = ({
  stores,
  selectedStore,
  centerCoordinates,
  zoomLevel,
  transitionDuration
}) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const initialZoom = useRef(zoomLevel);
  const maxZoomIncrease = 2; // Maximum 2 niveaux de zoom supplémentaires

  useEffect(() => {
    if (!mapInstance.current) {
      // Style minimaliste pour la carte
      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            }),
          }),
        ],
        view: new View({
          center: fromLonLat([centerCoordinates.longitude, centerCoordinates.latitude]),
          zoom: zoomLevel,
        }),
      });

      mapInstance.current = map;
    }
  }, []);

  // Gestion des marqueurs
  useEffect(() => {
    if (!mapInstance.current) return;

    const features = stores.map(store => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([store.longitude, store.latitude])),
        name: store.name,
        store: store,
      });

      feature.setStyle(new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({
            color: selectedStore?.id === store.id ? '#6F4E37' : '#000000',
          }),
        }),
      }));

      return feature;
    });

    const vectorSource = new VectorSource({
      features: features,
    });

    // Supprimer l'ancienne couche de marqueurs si elle existe
    mapInstance.current.getLayers().getArray()
      .filter(layer => layer instanceof VectorLayer)
      .forEach(layer => mapInstance.current.removeLayer(layer));

    // Ajouter la nouvelle couche de marqueurs
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    mapInstance.current.addLayer(vectorLayer);
  }, [stores, selectedStore]);

  // Animation de la vue
  useEffect(() => {
    if (!mapInstance.current || !centerCoordinates) return;

    const view = mapInstance.current.getView();
    const currentZoom = view.getZoom();
    const maxAllowedZoom = initialZoom.current + maxZoomIncrease;
    const targetZoom = Math.min(currentZoom + 0.5, maxAllowedZoom);
    
    view.animate({
      center: fromLonLat([centerCoordinates.longitude, centerCoordinates.latitude]),
      zoom: targetZoom,
      duration: 1000,
      easing: t => {
        return t < 0.5
          ? 4 * t * t * t
          : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      }
    });
  }, [centerCoordinates]);

  return <div ref={mapRef} className="w-full h-full" />;
};

export default OpenLayersMap;