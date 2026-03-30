import React, { useState } from "react";
import axios from "axios";
import MapView from "./MapView";
import AdminDashboard from "./AdminDashboard";

function App() {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState({ lat: "", lng: "" });

  // Get location
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      });
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image);
    formData.append("lat", location.lat);
    formData.append("lng", location.lng);

    try {
      await axios.post("http://localhost:5000/api/potholes", formData);
      alert("Pothole Reported ✅");
    } catch (err) {
      console.log(err);
    }
  };

return (
  <div className="container mt-5">

    <h1 className="text-center mb-4">🚧 Smart Pothole Reporter</h1>

    <div className="row">
      
      {/* LEFT: FORM */}
      <div className="col-md-5">
        <div className="card p-4 shadow">
          <h4 className="mb-3">Report Pothole</h4>

          <form onSubmit={handleSubmit}>
            <input
              type="file"
              className="form-control mb-3"
              onChange={(e) => setImage(e.target.files[0])}
            />

            <button
              type="button"
              className="btn btn-secondary w-100 mb-3"
              onClick={getLocation}
            >
              Get Location 📍
            </button>

            <p><b>Lat:</b> {location.lat}</p>
            <p><b>Lng:</b> {location.lng}</p>

            <button className="btn btn-primary w-100">
              Submit Report
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT: MAP */}
      <div className="col-md-7">
        <div className="card p-3 shadow">
          <h5 className="text-center">Live Map 🗺</h5>
          <MapView />
        </div>
      </div>

    </div>

    {/* ADMIN SECTION */}
    <div className="mt-5">
      <div className="card p-4 shadow">
        <h4 className="mb-3 text-center">Admin Dashboard 👨‍💻</h4>
        <AdminDashboard />
      </div>
    </div>

  </div>
);
}

export default App;