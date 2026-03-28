import React, { useState } from "react";
import axios from "axios";
import MapView from "./MapView";

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
  <div style={{ textAlign: "center", marginTop: "50px" }}>
    <h1>Pothole Reporter 🚧</h1>

    <form onSubmit={handleSubmit}>
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <br /><br />

      <button type="button" onClick={getLocation}>
        Get Location 📍
      </button>

      <p>Lat: {location.lat}</p>
      <p>Lng: {location.lng}</p>

      <button type="submit">Submit</button>
    </form>

    {/* ✅ ADD THIS PART */}
    <h2 style={{ marginTop: "40px" }}>Live Pothole Map 🗺</h2>
    <MapView />
  </div>
);
}

export default App;