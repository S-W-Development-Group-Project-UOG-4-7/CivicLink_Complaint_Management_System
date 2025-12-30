import React, { useEffect, useRef } from 'react';

// Simple Google Maps picker using the JS API. Requires an API key.
// Props:
// - apiKey: string (required unless the Google Maps script is already loaded)
// - value: { lat: string|number, lng: string|number }
// - onChange: ({ lat, lng }) => void
// - height: CSS height (e.g., '260px')
// - center: { lat, lng } default: Sri Lanka center
export default function MapPicker({ apiKey, value, onChange, height = '260px', center = { lat: 7.8731, lng: 80.7718 } }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Load script if not present
  useEffect(() => {
    const hasGoogle = typeof window !== 'undefined' && window.google && window.google.maps;
    if (hasGoogle) return;

    const key = apiKey || (typeof window !== 'undefined' && window.GOOGLE_MAPS_API_KEY) || (process.env && process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
    if (!key) return; // cannot load without key

    const existing = document.querySelector('script[data-google-maps-loader]');
    if (existing) return; // another component is loading it

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}`;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-google-maps-loader', 'true');
    document.body.appendChild(script);

    return () => {
      // we don't remove script to allow reuse across pages
    };
  }, [apiKey]);

  // Initialize map when api is available
  useEffect(() => {
    if (mapInstanceRef.current) return; // already initialized
    if (!(window && window.google && window.google.maps)) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 7,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });
    mapInstanceRef.current = map;

    // Initial marker if value present
    const latNum = value && value.lat ? parseFloat(value.lat) : null;
    const lngNum = value && value.lng ? parseFloat(value.lng) : null;
    if (!isNaN(latNum) && !isNaN(lngNum)) {
      markerRef.current = new window.google.maps.Marker({ position: { lat: latNum, lng: lngNum }, map });
      map.setCenter({ lat: latNum, lng: lngNum });
      map.setZoom(14);
    }

    map.addListener('click', (e) => {
      const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      if (!markerRef.current) {
        markerRef.current = new window.google.maps.Marker({ position: pos, map });
      } else {
        markerRef.current.setPosition(pos);
      }
      if (onChange) onChange(pos);
    });
  }, [center, onChange, value]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height, borderRadius: 8, border: '1px solid #e5e7eb' }}
      role="application"
      aria-label="Interactive map to pick location"
    />
  );
}
