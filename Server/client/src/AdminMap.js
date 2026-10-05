import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

const createIcon = (color) => {
  return L.divIcon({
    className: "admin-map-marker",
    html: `
      <div style="
          width: 22px;
          height: 22px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        "
      ></div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

function AdminMap() {
  const [potholes, setPotholes] = useState([]);

  const fetchPotholes = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get( "https://smart-city-solution-for-pothole-detection.onrender.com/api/potholes", { headers: { Authorization: `Bearer ${token}`
          }
        }
      );
      const now = new Date();
      const activePotholes = response.data.filter((pothole) => {
        if (pothole.status !== "Fixed") {
          return true;
        }

        if (!pothole.fixedAt) {
          return true;
        }

        const fixedTime = new Date(pothole.fixedAt);
        const difference = now - fixedTime;
        const oneDay = 24 * 60 * 60 * 1000;

        return difference < oneDay;
      });

      setPotholes(activePotholes);
    } catch (error) {
      console.error("Admin map error:", error);
    }
  };

  useEffect(() => {
    fetchPotholes();

    const interval = setInterval(fetchPotholes, 5000);

    return () => clearInterval(interval);
  }, []);

  const getMarkerColor = (status) => {
    if (status === "Reported") {
      return "#e53935";
    }

    if (status === "In Progress") {
      return "#fb8c00";
    }

    if (status === "Fixed") {
      return "#2e7d32";
    }

    return "#1976d2";
  };

  return (
    <div className="admin-map-container">
      <MapContainer
        center={[27.5, 77.7]}
        zoom={10}
        style={{
          height: "500px",
          width: "100%"
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {potholes.map((pothole) => (
          <Marker
            key={pothole._id}
            position={[Number(pothole.location.lat),Number(pothole.location.lng) ]}
            icon={createIcon(getMarkerColor(pothole.status))}
          >
            <Popup> <strong>🚧 Pothole Report</strong><br /> 
            Report ID: {pothole.reportId || pothole._id} 
            <br />
              Status: {pothole.status}
              <br />
              Severity: {pothole.severity}
              <br />
              Latitude: {pothole.location.lat}
              <br />
              Longitude: {pothole.location.lng}
              {pothole.fixedAt && (
           <>
                  <br />
                  Fixed: {new Date(pothole.fixedAt).toLocaleString()}
                </>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="map-legend">
        <div>
          <span className="legend-dot reported"></span> Reported
        </div>
        <div>
      <span className="legend-dot progress"></span> In Progress </div>
        <div>
         <span className="legend-dot fixed"></span> Fixed </div>
      </div>
    </div>
  );
}

export default AdminMap;