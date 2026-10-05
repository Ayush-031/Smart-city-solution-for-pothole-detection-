import React, { useState } from "react";
import axios from "axios";
import AdminReports from "./AdminReports";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import MapView from "./MapView";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";
import StatusTracker from "./StatusTracker";
import "./App.css";

function UserHome() {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState({lat: "", lng: ""});
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude,lng: pos.coords.longitude });
      },
      (error) => {
        console.log(error);
        alert("Unable to get your location. Please allow location access.");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select a pothole image.");
      return;
    }

    if (!location.lat || !location.lng) {
      alert("Please get your location first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("lat", location.lat);
    formData.append("lng", location.lng);

    try {
      const response = await axios.post(
        "https://smart-city-solution-for-pothole-detection.onrender.com/api/potholes",
        formData
      );

      alert("Pothole Reported Successfully! ✅\n\n" +"Report ID: " + response.data.reportId + "\n\nSave this ID to track your report." );

      setImage(null);
      setLocation({ lat: "", lng: "" });

      e.target.reset();
    } catch (err) {
      console.error("Submit error:", err);
      alert(
        "Failed to submit: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="app">
    <nav className="top-navbar">
    <div className="navbar-inner">
    <Link to="/" className="brand">
    <span className="brand-icon">🚧</span>
    <span>Smart City</span>
    </Link>
     <Link to="/admin/login" className="admin-login-btn"> Admin Login</Link>
     </div>
    </nav>

      <main className="main-container">
        <section className="hero">
          <h1> Smart <span>Pothole</span> Reporter</h1>
          <p> Report potholes in your city and help make roads safer for everyone.</p>
        </section>

        <section className="main-grid">
          <div className="card report-card">
           <div className="card-heading">
           <div className="heading-icon blue-icon">📷</div>
            <div>
            <h2>Report a Pothole</h2>
           <p>Upload an image and share the location of the pothole.</p>
            </div>
            </div>

            <form onSubmit={handleSubmit}>
            <div className="form-group">
            <label>Pothole Image</label>
            <div className="file-input-wrapper">
           <span className="file-icon">🖼️</span>
           <input type="file" accept="image/*"onChange={(e) => setImage(e.target.files[0])} />
           </div>
          </div>

  <button type="button" className="location-btn" onClick={getLocation}>  📍 Get My Location</button>

              <div className="coordinates">
                <div className="coordinate-box">
                <span className="coordinate-icon blue">📍</span>
                  <div>
                   <small>Latitude</small>
                    <strong>{location.lat || "Not selected"}</strong>
                  </div>
                </div>

                <div className="coordinate-box">
                  <span className="coordinate-icon green">📍</span>
                  <div>
                  <small>Longitude</small>
                  <strong>{location.lng || "Not selected"}</strong>
                  </div>
                </div>
              </div>

              <button type="submit" className="submit-btn"> ➤ Submit Report</button>
            </form>
          </div>

          <div className="card map-card">
            <div className="card-heading">
            <div className="heading-icon green-icon">🗺️</div>
             <div>
             <h2>Live Pothole Map</h2>
              <p>View reported potholes across the city.</p>
              </div>
            </div>

            <div className="map-wrapper">
            <MapView userLocation={location} />
            </div>
          </div>
        </section>

        <StatusTracker />

        <section className="card how-card">
          <div className="how-title">
            <div className="heading-icon yellow-icon">📋</div>
            <h2>How it works</h2>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-number blue">1</div>
              <p> Upload a pothole <br /> image</p>
            </div>

            <div className="arrow">→</div>

            <div className="step">
              <div className="step-number green">2</div>
              <p>Allow location<br />access</p>
            </div>

            <div className="arrow">→</div>
            <div className="step">
              <div className="step-number purple">3</div> <p>Submit your<br /> report</p>
            </div>
            <div className="arrow">→</div>
            <div className="step">
              <div className="step-number orange">4</div>
              <p>Save the Report ID<br />shown after submission</p>
            </div>

            <div className="arrow">→</div>
            <div className="step">
            <div className="step-number red">5</div>
              <p> Use the Report ID <br />to track its status</p>
         </div>
         </div>
        </section>
      </main>
    </div>
  );
}

function ProtectedAdmin() {
const token = localStorage.getItem("adminToken");
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminDashboard />;
}

function ProtectedReports() {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminReports />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserHome />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<ProtectedAdmin />} />
      <Route path="/admin/reports" element={<ProtectedReports />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;