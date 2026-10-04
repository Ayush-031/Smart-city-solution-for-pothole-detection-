import React, {
  useCallback,
  useEffect,
  useState
} from "react";

import axios from "axios";

import {
  Link,
  useNavigate
} from "react-router-dom";

import AdminMap from "./AdminMap";

import "./App.css";


function AdminDashboard() {

  const [potholes, setPotholes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const token =
    localStorage.getItem("adminToken");


  // ========================================
  // FETCH REPORTS
  // ========================================

  const fetchData = useCallback(async () => {

    try {

      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/potholes",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setPotholes(response.data);

    } catch (err) {

      console.error(
        "Dashboard error:",
        err
      );

      if (err.response?.status === 401) {

        localStorage.removeItem(
          "adminToken"
        );

        navigate("/admin/login");

      } else {

        alert(
          err.response?.data?.error ||
          "Unable to load dashboard data."
        );

      }

    } finally {

      setLoading(false);

    }

  }, [navigate, token]);


  // ========================================
  // LOAD DATA
  // ========================================

  useEffect(() => {

    fetchData();

    // Refresh dashboard every 5 seconds
    const interval = setInterval(
      fetchData,
      5000
    );

    return () =>
      clearInterval(interval);

  }, [fetchData]);


  // ========================================
  // LOGOUT
  // ========================================

  const logout = () => {

    localStorage.removeItem(
      "adminToken"
    );

    navigate("/admin/login");

  };


  // ========================================
  // STATISTICS
  // ========================================

  const total =
    potholes.length;

  const reported =
    potholes.filter(
      (p) =>
        p.status === "Reported"
    ).length;

  const inProgress =
    potholes.filter(
      (p) =>
        p.status === "In Progress"
    ).length;

  const fixed =
    potholes.filter(
      (p) =>
        p.status === "Fixed"
    ).length;


  // ========================================
  // UI
  // ========================================

  return (

    <div className="admin-page">


      {/* ==================================
          NAVBAR
      ================================== */}

      <nav className="admin-navbar">

        <div className="admin-navbar-inner">


          {/* BRAND */}

          <div className="admin-brand">

            <span>🚧</span>

            <div>

              <strong>
                Smart City
              </strong>

              <small>
                Admin Panel
              </small>

            </div>

          </div>


          {/* NAVIGATION */}

          <div className="admin-nav-links">

            <Link
              to="/admin/dashboard"
              className="admin-nav-link active"
            >
              Dashboard
            </Link>

            <Link
              to="/admin/reports"
              className="admin-nav-link"
            >
              Pothole Reports
            </Link>

          </div>


          {/* LOGOUT */}

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* ==================================
          MAIN CONTENT
      ================================== */}

      <main className="admin-container">


        {/* ==================================
            HEADER
        ================================== */}

        <div className="admin-header">

          <div>

            <h1>
              Admin Dashboard
            </h1>

            <p>
              Monitor pothole reports
              across the city.
            </p>

          </div>


          <button
            className="refresh-btn"
            onClick={fetchData}
            disabled={loading}
          >

            {loading
              ? "↻ Loading..."
              : "↻ Refresh"}

          </button>

        </div>


        {/* ==================================
            STATISTICS
        ================================== */}

        <div className="stats-grid">


          {/* TOTAL */}

          <div className="stat-card">

            <div className="stat-icon blue-stat">
              📋
            </div>

            <div>

              <span>
                Total Reports
              </span>

              <strong>
                {total}
              </strong>

            </div>

          </div>


          {/* REPORTED */}

          <div className="stat-card">

            <div className="stat-icon red-stat">
              ⚠️
            </div>

            <div>

              <span>
                Reported
              </span>

              <strong>
                {reported}
              </strong>

            </div>

          </div>


          {/* IN PROGRESS */}

          <div className="stat-card">

            <div className="stat-icon orange-stat">
              🔧
            </div>

            <div>

              <span>
                In Progress
              </span>

              <strong>
                {inProgress}
              </strong>

            </div>

          </div>


          {/* FIXED */}

          <div className="stat-card">

            <div className="stat-icon green-stat">
              ✓
            </div>

            <div>

              <span>
                Fixed
              </span>

              <strong>
                {fixed}
              </strong>

            </div>

          </div>


        </div>


        {/* ==================================
            LIVE POTHOLE MAP
        ================================== */}

        <section className="card admin-map-card">


          <div className="card-heading">

            <div className="heading-icon green-icon">
              🗺️
            </div>

            <div>

              <h2>
                Live Pothole Map
              </h2>

              <p>
                Monitor all reported potholes
                across the city.
              </p>

            </div>

          </div>


          <AdminMap />


          {/* MAP LEGEND */}

          <div className="dashboard-map-legend">

            <div>

              <span className="legend-dot reported"></span>

              Reported

            </div>


            <div>

              <span className="legend-dot progress"></span>

              In Progress

            </div>


            <div>

              <span className="legend-dot fixed"></span>

              Fixed

            </div>

          </div>


        </section>


        {/* ==================================
            QUICK INFORMATION
        ================================== */}

        <section className="dashboard-info-grid">


          <div className="dashboard-info-card">

            <div className="info-icon">
              📊
            </div>

            <div>

              <h3>
                {total}
              </h3>

              <p>
                Total pothole reports
              </p>

            </div>

          </div>


          <div className="dashboard-info-card">

            <div className="info-icon">
              🚧
            </div>

            <div>

              <h3>
                {reported + inProgress}
              </h3>

              <p>
                Active potholes
              </p>

            </div>

          </div>


          <div className="dashboard-info-card">

            <div className="info-icon">
              ✅
            </div>

            <div>

              <h3>
                {fixed}
              </h3>

              <p>
                Successfully fixed
              </p>

            </div>

          </div>


        </section>


      </main>

    </div>

  );

}

export default AdminDashboard;