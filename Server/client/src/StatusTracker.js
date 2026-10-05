import React, { useState } from "react";
import axios from "axios";

function StatusTracker() {
  const [reportId, setReportId] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const checkStatus = async (e) => {
    e.preventDefault();
    setError("");
    setReport(null);

    const id = reportId.trim();

    if (!id) {
      setError("Please enter your Report ID.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/potholes/status/${id}`
      );
      setReport(response.data);
    } catch (err) {
      console.error("Status check error:", err);
      setError(
        err.response?.data?.error || "Unable to find this report."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Fixed") return "status-fixed";
    if (status === "In Progress") return "status-progress";
    return "status-reported";
  };

  return (
    <section className="status-tracker card">
      <div className="tracker-heading">
      <div className="heading-icon purple-icon">🔎</div>
        <div>
      <h2>Track Your Report</h2>
        <p>Enter your Report ID to check the current status.</p>
        </div>
      </div>

      <form className="tracker-form" onSubmit={checkStatus}>
        <input
          type="text"
          value={reportId}
          onChange={(e) => setReportId(e.target.value)}
          placeholder="Enter your Report ID"
        />
        <button type="submit" disabled={loading}>
        {loading ? "Checking..." : "Check Status"}
        </button>
      </form>

      {error && <div className="tracker-error">{error}</div>}

      {report && (
        <div className="status-result">
          <div className="result-header">
          <div>
          <small>Report ID</small>
          <strong>{report.reportId}</strong>
          </div>

            <span className={`report-status ${getStatusClass(report.status)}`}>
              {report.status}
            </span>
          </div>

          <div className="status-progress">
            <div className={ report.status ? "progress-step active" : "progress-step"}>
              <span>1</span>
              <p>Reported</p>
            </div>

            <div className={ report.status === "In Progress"
               ||report.status === "Fixed" ? "progress-line active" : "progress-line"} />
            <div
              className={
                report.status === "In Progress" || 
                report.status === "Fixed" ? "progress-step active": "progress-step"
              }
            >
              <span>2</span>
              <p>In Progress</p>
            </div>

            <div className={ report.status === "Fixed" ? "progress-line active"
                  : "progress-line" }/>
            <div className={report.status === "Fixed" ? "progress-step active"
                  : "progress-step"}>
              <span>3</span>
              <p>Fixed</p>
            </div>
          </div>

          <div className="result-details">
            <div>
              <small>Severity</small>
              <strong>{report.severity}</strong>
            </div>

            <div>
              <small>Reported On</small>
              <strong>
                {new Date(report.createdAt).toLocaleString()}
              </strong>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default StatusTracker;