import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import "./App.css";

function AdminReports() {

  const [potholes, setPotholes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");


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

      console.error("Reports error:", err);

      if (err.response?.status === 401) {

        localStorage.removeItem("adminToken");

        navigate("/admin/login");

      } else {

        alert(
          err.response?.data?.error ||
          "Unable to load reports."
        );

      }

    } finally {

      setLoading(false);

    }

  }, [navigate, token]);


  useEffect(() => {

    fetchData();

  }, [fetchData]);


  // ========================================
  // UPDATE STATUS
  // ========================================

  const updateStatus = async (id, status) => {

    try {

      await axios.put(
        `http://localhost:5000/api/potholes/${id}`,
        {
          status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      await fetchData();

    } catch (err) {

      console.error(
        "Status update error:",
        err
      );

      if (err.response?.status === 401) {

        localStorage.removeItem("adminToken");

        navigate("/admin/login");

        return;
      }

      alert(
        err.response?.data?.error ||
        "Unable to update status."
      );

    }

  };


  // ========================================
  // LOGOUT
  // ========================================

  const logout = () => {

    localStorage.removeItem("adminToken");

    navigate("/admin/login");

  };


  // ========================================
  // IMAGE URL
  // ========================================

  const getImageUrl = (image) => {

    if (!image) {
      return "";
    }

    const cleanPath =
      image.replace(/\\/g, "/");

    return `http://localhost:5000/${cleanPath}`;

  };


  // ========================================
  // STATUS CLASS
  // ========================================

  const getStatusClass = (status) => {

    if (status === "Fixed") {
      return "fixed";
    }

    if (status === "In Progress") {
      return "in-progress";
    }

    return "reported";

  };


  return (

    <div className="admin-page">

      {/* ==================================
          NAVBAR
      ================================== */}

      <nav className="admin-navbar">

        <div className="admin-navbar-inner">

          <div className="admin-brand">

            <span>🚧</span>

            <div>

              <strong>Smart City</strong>

              <small>Admin Panel</small>

            </div>

          </div>


          <div className="admin-nav-links">

            <Link
              to="/admin/dashboard"
              className="admin-nav-link"
            >
              Dashboard
            </Link>

            <Link
              to="/admin/reports"
              className="admin-nav-link active"
            >
              Pothole Reports
            </Link>

          </div>


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

        <div className="admin-header">

          <div>

            <h1>Pothole Reports</h1>

            <p>
              View and manage all reported potholes.
            </p>

          </div>


          <button
            className="refresh-btn"
            onClick={fetchData}
          >
            ↻ Refresh
          </button>

        </div>


        {/* ==================================
            TOTAL
        ================================== */}

        <div className="reports-summary-card">

          <div className="stat-icon blue-stat">
            📋
          </div>

          <div>

            <span>Total Potholes</span>

            <strong>
              {potholes.length}
            </strong>

          </div>

        </div>


        {/* ==================================
            REPORTS
        ================================== */}

        <div className="reports-section">

          <div className="reports-title">

            <h2>
              Pothole Images
            </h2>

            <span>
              {potholes.length}{" "}
              {potholes.length === 1
                ? "report"
                : "reports"}
            </span>

          </div>


          {loading ? (

            <div className="empty-dashboard">

              <div>⏳</div>

              <h3>
                Loading reports...
              </h3>

              <p>
                Please wait while reports are loaded.
              </p>

            </div>

          ) : potholes.length === 0 ? (

            <div className="empty-dashboard">

              <div>📭</div>

              <h3>
                No reports yet
              </h3>

              <p>
                New pothole reports will appear here.
              </p>

            </div>

          ) : (

            <div className="reports-grid">

              {potholes.map((pothole) => (

                <div
                  className="report-card-admin"
                  key={pothole._id}
                >

                  {/* IMAGE */}

                  <div className="report-image">

                    {pothole.image ? (

                      <img
                        src={getImageUrl(
                          pothole.image
                        )}
                        alt="Reported pothole"
                      />

                    ) : (

                      <div className="no-image">
                        No Image
                      </div>

                    )}


                    <span
                      className={`status-badge ${getStatusClass(
                        pothole.status
                      )}`}
                    >
                      {pothole.status}
                    </span>

                  </div>


                  {/* DETAILS */}

                  <div className="report-details">

                    <div className="report-id">

                      <span>
                        Report ID
                      </span>

                      <strong
                        title={
                          pothole.reportId ||
                          pothole._id
                        }
                      >
                        {pothole.reportId ||
                          pothole._id}
                      </strong>

                    </div>


                    <div className="report-info">

                      <div>

                        <small>
                          Severity
                        </small>

                        <strong>
                          {pothole.severity}
                        </strong>

                      </div>


                      <div>

                        <small>
                          Location
                        </small>

                        <strong>

                          {Number(
                            pothole.location?.lat
                          ).toFixed(4)}

                          {" , "}

                          {Number(
                            pothole.location?.lng
                          ).toFixed(4)}

                        </strong>

                      </div>

                    </div>


                    <div className="report-date">

                      Reported:{" "}

                      {pothole.createdAt
                        ? new Date(
                            pothole.createdAt
                          ).toLocaleString()
                        : "Unknown"}

                    </div>


                    {/* ACTIONS */}

                    <div className="status-actions">

                      <button
                        className="progress-btn"
                        disabled={
                          pothole.status ===
                          "In Progress"
                        }
                        onClick={() =>
                          updateStatus(
                            pothole._id,
                            "In Progress"
                          )
                        }
                      >
                        🔧 In Progress
                      </button>


                      <button
                        className="fixed-btn"
                        disabled={
                          pothole.status ===
                          "Fixed"
                        }
                        onClick={() =>
                          updateStatus(
                            pothole._id,
                            "Fixed"
                          )
                        }
                      >
                        ✓ Mark Fixed
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </main>

    </div>

  );

}

export default AdminReports;