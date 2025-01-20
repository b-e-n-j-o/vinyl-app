// components/Map.jsx
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../styles/Map.module.css';

function ChangeView({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
}

const Map = ({ stores, selectedStore, onStoreSelect, centerCoordinates }) => {
  const markerRefs = useRef({});
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && centerCoordinates) {
      mapRef.current.setView(
        [centerCoordinates.latitude, centerCoordinates.longitude],
        centerCoordinates.zoom || 13
      );
    }
  }, [centerCoordinates]);

  // Effet pour ouvrir le popup quand selectedStore change
  useEffect(() => {
    if (selectedStore) {
      markerRefs.current[selectedStore.id]?.openPopup();
    }
  }, [selectedStore]);

  const icon = new L.Icon({
    iconUrl: '/images/clipart2156723.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    className: 'default-icon',
  });

  return (
    <div className={styles.mapContainer}>
      <MapContainer 
        center={[50.8503, 4.3517]} 
        zoom={centerCoordinates?.zoom || 13}
        className={styles.map}
        ref={mapRef}
      >
        <ChangeView 
          center={selectedStore ? [selectedStore.latitude, selectedStore.longitude] : 
            [centerCoordinates?.latitude || 50.8503, centerCoordinates?.longitude || 4.3517]} 
          zoom={selectedStore?.noZoom ? (centerCoordinates?.zoom || 13) : (selectedStore ? 19 : centerCoordinates?.zoom || 13)} 
        />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {stores.map((store) => (
          <Marker
            key={store.id}
            position={[store.latitude, store.longitude]}
            icon={icon}
            ref={(ref) => {
              if (ref) {
                markerRefs.current[store.id] = ref;
              }
            }}
            eventHandlers={{
              click: () => onStoreSelect(store)
            }}
          >
            <Popup>
              <div className={styles.popupContent}>
                <h3 className={styles.storeName}>
                  {store.name}
                </h3>
                <p className={styles.storeAddress}>{store.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

Map.propTypes = {
  stores: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      address: PropTypes.string,
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      phone: PropTypes.string,
      website: PropTypes.string,
      rating: PropTypes.number,
      reviewCount: PropTypes.number,
      status: PropTypes.string,
      openingHours: PropTypes.arrayOf(PropTypes.string)
    })
  ).isRequired,
  selectedStore: PropTypes.object,
  onStoreSelect: PropTypes.func.isRequired,
  centerCoordinates: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    zoom: PropTypes.number
  })
};

export default Map;