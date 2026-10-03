import React, {
  useCallback,
  useEffect,
  useState
} from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

  const [potholes, setPotholes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");


  // ========================================
  // FETCH ALL REPORTS
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

      console.error("Dashboard error:", err);

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


  // ========================================
  // LOAD REPORTS WHEN DASHBOARD OPENS
  // ========================================

  useEffect(() => {

    fetchData();

  }, [fetchData]);


  // ========================================
  // UPDATE REPORT STATUS
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

      // Reload reports after updating
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
  // STATISTICS
  // ========================================

  const total = potholes.length;

  const reported = potholes.filter(
    (p) => p.status === "Reported"
  ).length;

  const inProgress = potholes.filter(
    (p) => p.status === "In Progress"
  ).length;

  const fixed = potholes.filter(
    (p) => p.status === "Fixed"
  ).length;


  // ========================================
  // IMAGE URL
  // ========================================

  const getImageUrl = (image) => {

    if (!image) {
      return "";
    }

    // Windows paths may contain "\"
    const cleanPath = image.replace(/\\/g, "/");

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


  // ========================================
  // DASHBOARD UI
  // ========================================

  return (

    <div className="admin-page">


      {/* ====================================
          ADMIN NAVBAR
      ==================================== */}

      <nav className="admin-navbar">

        <div className="admin-navbar-inner">


          {/* BRAND */}

          <div className="admin-brand">

            <span>
              🚧
            </span>

            <div>

              <strong>
                Smart City
              </strong>

              <small>
                Admin Panel
              </small>

            </div>

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


      {/* ====================================
          MAIN CONTENT
      ==================================== */}

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
              Monitor and manage pothole reports.
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
            REPORTS SECTION
        ================================== */}

        <div className="reports-section">


          {/* REPORT HEADER */}

          <div className="reports-title">

            <h2>
              Pothole Reports
            </h2>

            <span>
              {total} {total === 1 ? "report" : "reports"}
            </span>

          </div>


          {/* ==================================
              LOADING
          ================================== */}

          {loading ? (

            <div className="empty-dashboard">

              <div>
                ⏳
              </div>

              <h3>
                Loading reports...
              </h3>

              <p>
                Please wait while reports are loaded.
              </p>

            </div>

          ) : potholes.length === 0 ? (


            /* ==================================
               NO REPORTS
            ================================== */

            <div className="empty-dashboard">

              <div>
                📭
              </div>

              <h3>
                No reports yet
              </h3>

              <p>
                New pothole reports will appear here.
              </p>

            </div>

          ) : (


            /* ==================================
               REPORT CARDS
            ================================== */

            <div className="reports-grid">

              {potholes.map((pothole) => (

                <div
                  className="report-card-admin"
                  key={pothole._id}
                >


                  {/* ============================
                      IMAGE
                  ============================ */}

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


                    {/* STATUS BADGE */}

                    <span
                      className={`status-badge ${getStatusClass(
                        pothole.status
                      )}`}
                    >
                      {pothole.status}
                    </span>

                  </div>


                  {/* ============================
                      DETAILS
                  ============================ */}

                  <div className="report-details">


                    {/* REPORT ID */}

                    <div className="report-id">

                      <span>
                        Report ID
                      </span>

                      <strong
                        title={pothole._id}
                      >
                        {pothole._id}
                      </strong>

                    </div>


                    {/* SEVERITY + LOCATION */}

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


                    {/* DATE */}

                    <div className="report-date">

                      Reported:{" "}

                      {pothole.createdAt
                        ? new Date(
                            pothole.createdAt
                          ).toLocaleString()
                        : "Unknown"}

                    </div>


                    {/* ============================
                        ACTION BUTTONS
                    ============================ */}

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

export default AdminDashboard;