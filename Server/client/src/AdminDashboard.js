import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {

  const [potholes, setPotholes] = useState([]);

  const fetchData = () => {
    axios.get("http://localhost:5000/api/potholes")
      .then(res => setPotholes(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/potholes/${id}`, { status });
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  return (
  <div>

    {/* 🔥 STATISTICS SECTION */}
    <div className="d-flex justify-content-around mb-4">
      <h5>Total: {potholes.length}</h5>
      <h5 className="text-success">
        Fixed: {potholes.filter(p => p.status === "Fixed").length}
      </h5>
      <h5 className="text-danger">
        Pending: {potholes.filter(p => p.status !== "Fixed").length}
      </h5>
    </div>

    {/* 🧾 CARDS SECTION */}
    <div className="row">
      {potholes.map((p) => (
        <div key={p._id} className="col-md-4 mb-3">
          <div className="card p-3 shadow-sm">

            {/* 📸 IMAGE */}
            <img
              src={`http://localhost:5000/${p.image}`}
              alt="pothole"
              className="img-fluid mb-2"
              style={{ height: "150px", objectFit: "cover" }}
            />

            {/* 📊 DETAILS */}
            <p>
              <b>Status:</b>{" "}
              <span className={
                p.status === "Fixed"
                  ? "text-success"
                  : p.status === "In Progress"
                  ? "text-warning"
                  : "text-danger"
              }>
                {p.status}
              </span>
            </p>

            <p><b>Severity:</b> {p.severity}</p>
            <p><b>Location:</b> {p.location.lat}, {p.location.lng}</p>

            {/* 🔘 BUTTONS */}
            <button
              className="btn btn-warning w-100 mb-2"
              onClick={() => updateStatus(p._id, "In Progress")}
            >
              Mark In Progress
            </button>

            <button
              className="btn btn-success w-100"
              onClick={() => updateStatus(p._id, "Fixed")}
            >
              Mark Fixed
            </button>

          </div>
        </div>
      ))}
    </div>

  </div>
);
}

export default AdminDashboard;