import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";

function MapView() {
  const [potholes, setPotholes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/potholes")
      .then(res => setPotholes(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <MapContainer center={[27.1, 78.4]} zoom={13} style={{ height: "400px", width: "100%" }}>
      
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {potholes.map((p, index) => (
        <Marker key={index} position={[p.location.lat, p.location.lng]}>
          <Popup>
            🚧 Pothole <br />
            Status: {p.status} <br />
            Severity: {p.severity}
          </Popup>
        </Marker>
      ))}

    </MapContainer>
  );
}

export default MapView;