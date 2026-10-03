import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function AdminLogin() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();


  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");

    try {

      const response = await axios.post(
        "http://localhost:5000/api/admin/login",
        {
          username,
          password
        }
      );

      localStorage.setItem(
        "adminToken",
        response.data.token
      );

      navigate("/admin/dashboard");

    } catch (err) {

      setError(
        err.response?.data?.error ||
        "Invalid username or password."
      );

    }

  };


  return (

    <div className="login-page">

      <div className="login-card">


        {/* BRAND */}

        <Link to="/" className="login-brand">

          <span className="login-brand-icon">
            🚧
          </span>

          <span>
            Smart City
          </span>

        </Link>


        {/* HEADING */}

        <div className="login-heading">

          <div className="login-icon">
            🔐
          </div>

          <h1>
            Admin Login
          </h1>

          <p>
            Sign in to manage pothole reports.
          </p>

        </div>


        {/* FORM */}

        <form onSubmit={handleLogin}>


          {/* USERNAME */}

          <div className="login-field">

            <label>
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="Enter admin username"
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="login-field">

            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter admin password"
              required
            />

          </div>


          {/* ERROR */}

          {error && (

            <div className="login-error">
              {error}
            </div>

          )}


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="login-submit"
          >
            Login to Dashboard
          </button>


        </form>


        {/* BACK */}

        <Link
          to="/"
          className="back-home"
        >
          ← Back to user page
        </Link>


      </div>

    </div>

  );

}

export default AdminLogin;