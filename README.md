# 🚧 Smart City Pothole Detection & Reporting System

A full-stack web application that allows citizens to report potholes using images and GPS location, while administrators can monitor, manage, and track pothole repairs through an interactive dashboard.

---

## 📌 Project Overview

The **Smart City Pothole Detection & Reporting System** is designed to improve road safety by providing a digital platform for reporting and managing potholes.

Citizens can:

- Upload a pothole image
- Share their current GPS location
- Submit a pothole report
- Receive a unique Report ID
- Track the status of their report

Administrators can:

- View all pothole reports
- Monitor potholes on an interactive map
- View uploaded pothole images
- Update pothole status
- Track reported, in-progress, and fixed potholes
- Manage reports through a secure admin dashboard

---

## ✨ Features

### 👤 User Features

- 📷 Upload pothole images
- 📍 Capture GPS coordinates using browser geolocation
- 📝 Submit pothole reports
- 🆔 Generate unique Report IDs
- 🔎 Track report status
- 🗺️ View pothole locations on an interactive map

### 👨‍💼 Admin Features

- 🔐 Secure JWT-based admin authentication
- 📊 Dashboard with pothole statistics
- 🗺️ Live pothole map
- 🔴 Reported potholes
- 🟠 In-progress potholes
- 🟢 Fixed potholes
- 📸 View uploaded pothole images
- 🔄 Update pothole status
- 📍 View pothole coordinates
- 🔄 Automatic dashboard data refresh
- 📋 Manage all pothole reports

### 🗺️ Map Features

Potholes are displayed using color-coded markers:

| Status | Marker |
|--------|--------|
| Reported | 🔴 Red |
| In Progress | 🟠 Orange |
| Fixed | 🟢 Green |

Fixed potholes are removed from the active map after 24 hours while their data remains stored in MongoDB.

---

## 🛠️ Tech Stack

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- React Router
- Axios
- React Leaflet
- Leaflet

### Backend

- Node.js
- Express.js
- REST APIs
- Multer
- JWT Authentication

### Database

- MongoDB
- MongoDB Atlas
- Mongoose

### Development Tools

- VS Code
- Git
- GitHub
- npm
- Postman

---

## 🏗️ Project Structure

```text
SmartCity Solution/
│
├── Server/
│   │
│   ├── client/
│   │   ├── public/
│   │   └── src/
│   │       ├── App.js
│   │       ├── App.css
│   │       ├── AdminDashboard.js
│   │       ├── AdminReports.js
│   │       ├── AdminLogin.js
│   │       ├── AdminMap.js
│   │       ├── MapView.js
│   │       └── StatusTracker.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── models/
│   │   └── Pothole.js
│   │
│   ├── routes/
│   │   ├── potholeRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── uploads/
│   ├── .env
│   ├── index.js
│   └── package.json
│
└── README.md
