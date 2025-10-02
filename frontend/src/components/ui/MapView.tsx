import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapViewProps {
  address?: string;
  coordinates?: [number, number];
}

function MapUpdater({ coordinates }: { coordinates: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    if (coordinates) {
      map.setView(coordinates, 13);
    }
  }, [coordinates, map]);

  return null;
}

const MapView: React.FC<MapViewProps> = ({ address, coordinates }) => {
  const defaultCenter: [number, number] = [43.6532, -79.3832];
  const center = coordinates || defaultCenter;

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden border-2 border-gray-200">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' , zIndex: 1}}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coordinates && (
          <Marker position={coordinates}>
            <Popup>{address || 'Selected Location'}</Popup>
          </Marker>
        )}
        <MapUpdater coordinates={center} />
      </MapContainer>
    </div>
  );
};

export default MapView;
