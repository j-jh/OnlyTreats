"use client"
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

export default function Map({ streets, neighborhood }) {
  const mapContainerStyle = {
    width: '100%',
    height: '500px'
  };

  // SF center coordinates
  const center = {
    lat: 37.7749,
    lng: -122.4194
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={14}
      >
        {streets.map((street, idx) => (
          <Marker
            key={idx}
            position={center} 
            label={`${idx + 1}`}
            title={`${street.street} - Score: ${street.score}`}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}