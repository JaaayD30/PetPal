import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Maps = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [coords, setCoords] = useState({ lat: 14.5995, lng: 120.9842 }); // Default to Manila

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map').setView([coords.lat, coords.lng], 13);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const pawIcon = L.divIcon({
        html: '🐾',
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = L.marker([coords.lat, coords.lng], { draggable: true, icon: pawIcon }).addTo(map);
      markerRef.current = marker;

      marker.on('dragend', (e) => {
        const latlng = e.target.getLatLng();
        setCoords({ lat: latlng.lat, lng: latlng.lng });
        alert(`Location set to: Lat ${latlng.lat.toFixed(5)}, Lng ${latlng.lng.toFixed(5)}`);
      });
    }
  }, []);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const newCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCoords(newCoords);
        const map = mapRef.current;
        if (map && markerRef.current) {
          map.setView([newCoords.lat, newCoords.lng], 13);
          markerRef.current.setLatLng(newCoords);
        }
      }, () => {
        alert('Unable to retrieve your location');
      });
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Set Your Location</h2>
      <button onClick={handleLocateMe} style={{ marginBottom: '10px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        📍 Show My Location
      </button>
      <div id="map" style={{ height: '500px', width: '100%', borderRadius: '8px' }}></div>
    </div>
  );
};

export default Maps;