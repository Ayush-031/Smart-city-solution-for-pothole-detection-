import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

// Custom location icon
const locationIcon = L.divIcon({
  className: "custom-location-pin",
  html: `
    <div class="map-pin">
      <div class="map-pin-dot"></div>
    </div>
  `,
  iconSize: [40, 50],
  iconAnchor: [20, 50],
  popupAnchor: [0, -50]
});

const potholeIcon = L.divIcon({
  className: "custom-marker",
  html: `
    <div class="pothole-marker">
      🚧
    </div>
  `,
  iconSize: [52, 52],
  iconAnchor: [26, 52],
  popupAnchor: [0, -52]
});

function MapController({ userLocation }) {
  const map = useMap();

  useEffect(() => {
    if (userLocation?.lat && userLocation?.lng) {
      map.flyTo(
        [
          Number(userLocation.lat),
          Number(userLocation.lng)
        ],
        17,
        {
          duration: 1.5
        }
      );
    }
  }, [userLocation, map]);

  return null;
}

function MapView({ userLocation }) {
  const [potholes, setPotholes] = useState([]);

  useEffect(() => {
    const fetchPotholes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/potholes"
        );

        setPotholes(response.data);
      } catch (error) {
        console.log("Map error:", error);
      }
    };

    fetchPotholes();

    const interval = setInterval(
      fetchPotholes,
      3000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer
      center={[27.5, 77.7]}
      zoom={10}
      style={{
        height: "400px",
        width: "100%"
      }}
    >

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController
        userLocation={userLocation}
      />

      {/* USER LOCATION */}
      {userLocation?.lat && userLocation?.lng && (
        <Marker
          position={[
            Number(userLocation.lat),
            Number(userLocation.lng)
          ]}
          icon={locationIcon}
        >
          <Popup>
            📍 <b>Pothole Location</b>
            <br />
            Latitude: {userLocation.lat}
            <br />
            Longitude: {userLocation.lng}
          </Popup>
        </Marker>
      )}

      {/* SAVED POTHOLES */}
      {potholes.map((pothole) => (
        <Marker
          key={pothole._id}
          position={[
            Number(pothole.location.lat),
            Number(pothole.location.lng)
          ]}
          icon={potholeIcon}
        >
          <Popup>
            🚧 <b>Pothole Report</b>
            <br />
            Report ID:{" "}
            {pothole.reportId || pothole._id}
            <br />
            Status: {pothole.status}
            <br />
            Severity: {pothole.severity}
          </Popup>
        </Marker>
      ))}

    </MapContainer>
  );
}

export default MapView;