import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import axios from "axios";

// Automatically move the map to the potholes
function MapUpdater({ potholes }) {
  const map = useMap();

  useEffect(() => {
    if (potholes.length > 0) {
      const bounds = potholes.map((p) => [
        p.location.lat,
        p.location.lng
      ]);

      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15
      });
    }
  }, [potholes, map]);

  return null;
}

function MapView() {
  const [potholes, setPotholes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/potholes")
      .then((res) => setPotholes(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <MapContainer
      center={[27.5, 77.7]}
      zoom={10}
      style={{ height: "400px", width: "100%" }}
    >

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapUpdater potholes={potholes} />

      {potholes.map((p) => (
        <Marker
          key={p._id}
          position={[
            p.location.lat,
            p.location.lng
          ]}
        >
          <Popup>
            🚧 <b>Pothole</b>
            <br />
            Status: {p.status}
            <br />
            Severity: {p.severity}
          </Popup>
        </Marker>
      ))}

    </MapContainer>
  );
}

export default MapView;