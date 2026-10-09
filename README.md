# 🔬 LabTrack — College Laboratory Equipment Management System

> A modern, full-stack laboratory inventory and operational equipment management platform designed for university and college engineering & science labs.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-68a063?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-61dafb?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-v5-646cff?logo=vite)](https://vitejs.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📌 Features

- 📊 **Executive Dashboard**: Real-time KPI counters, lab utilization charts, allocation breakdown, and recent maintenance feeds.
- 📦 **Equipment Inventory**: Full CRUD operations, asset tagging, multi-parameter filtering (by status, category, laboratory, condition), pagination, and search.
- 🏢 **Laboratory Overview**: Lab-by-lab equipment breakdown, occupancy, and in-charge management.
- 🔄 **Allocation Tracking**: Issue and return workflow with status guards to prevent accidental deletion of assigned assets.
- 🛠️ **Maintenance & Damage Reporting**: Track calibration schedules, repair costs, technician findings, and automated equipment status updates.
- 🔐 **Role-Based Authentication**: JWT-based session security with pre-configured Admin, Staff, and Student roles.
- 💾 **Dual-Mode Database**: Seamlessly runs with MySQL or automatically falls back to an in-memory database if MySQL is offline.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Framer Motion, Lucide React, Axios, Vanilla CSS (Design Tokens) |
| **Backend** | Node.js, Express.js, `mysql2` (Connection Pool), `jsonwebtoken`, `bcryptjs`, `express-validator`, `cors`, `dotenv` |
| **Database** | MySQL (with full relational integrity, foreign keys, and indexes) + In-Memory Fallback Engine |

---

## 🚀 Quick Setup & Installation

### 📋 Prerequisites
Ensure you have the following installed:
1. **[Node.js](https://nodejs.org/)** (v18.x or higher)
2. **[Git](https://git-scm.com/)**
3. **[MySQL Server](https://dev.mysql.com/downloads/mysql/)** (or XAMPP / MySQL Workbench) *(Optional — in-memory mode active if MySQL is not running)*

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/likith2615/labtrack.git
cd labtrack
```

---

### 2️⃣ Database Setup (MySQL)

1. Open your MySQL command line or Workbench.
2. Run the database creation and schema script:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
3. Seed the initial mock data (categories, laboratories, equipment, sample users):
   ```bash
   mysql -u root -p labtrack_db < database/seed.sql
   ```

*(If you don't have MySQL installed, you can skip this step! The backend will automatically run in in-memory mode with sample data).*

---

### 3️⃣ Backend Server Setup

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create the `.env` environment file:
   - On Windows (PowerShell):
     ```powershell
     cp .env.example .env
     ```
   - On Linux/macOS:
     ```bash
     cp .env.example .env
     ```

4. Open `.env` and verify/update your MySQL credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=labtrack_db
   JWT_SECRET=labtrack_super_secret_jwt_key_2024
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   > 🚀 **Backend runs at:** `http://localhost:5000`

---

### 4️⃣ Frontend Client Setup

1. Open a **new / second terminal window** and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   > 🌐 **Frontend runs at:** `http://localhost:5173`

---

## 🔑 Demo Login Credentials

The seed data provides pre-configured accounts for testing different role permissions:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@labtrack.edu` | `admin123` | Full access (Equipment CRUD, Allocations, Maintenance, Reports, Labs) |
| **Lab Staff / In-Charge** | `elena.ramos@labtrack.edu` | `staff123` | Equipment management, Allocations, Logging maintenance |
| **Student** | `liam.cooper@student.labtrack.edu` | `student123` | View-only catalog, Check equipment availability |

*(Alternative universal password for demo accounts: `password123`)*

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/login` | Authenticate user & get JWT token | Public |
| **GET** | `/api/auth/me` | Fetch active user profile | Authenticated |
| **GET** | `/api/auth/users` | List all users | Authenticated |
| **GET** | `/api/equipment` | List equipment with filtering & pagination | Authenticated |
| **POST** | `/api/equipment` | Register new equipment | Admin / Staff |
| **GET** | `/api/equipment/:id` | Get single equipment details | Authenticated |
| **PUT** | `/api/equipment/:id` | Update equipment details | Admin / Staff |
| **DELETE** | `/api/equipment/:id` | Remove equipment (with allocation checks) | Admin |
| **GET** | `/api/labs` | List all laboratories & statistics | Authenticated |
| **GET** | `/api/allocations` | View active and historical allocations | Authenticated |
| **POST** | `/api/allocations` | Issue equipment to user/lab | Admin / Staff |
| **PUT** | `/api/allocations/:id/return` | Process return of allocated asset | Admin / Staff |
| **GET** | `/api/maintenance` | View maintenance records | Authenticated |
| **POST** | `/api/maintenance` | Log new maintenance / damage service | Admin / Staff |
| **GET** | `/api/reports/summary` | Get aggregated KPI summary metrics | Authenticated |

---

## 📂 Project Directory Structure

```text
labtrack/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── api/                # Axios API client & interceptors
│   │   ├── assets/             # SVG banners, media, and lab visuals
│   │   ├── components/         # Reusable UI components, layout, auth & dashboard widgets
│   │   ├── context/            # Auth & global state providers
│   │   ├── hooks/              # Custom React hooks (useAuth, useLabs, etc.)
│   │   ├── pages/              # Routed view pages (Dashboard, Equipment, Maintenance, etc.)
│   │   ├── index.css           # Global design tokens and aesthetic stylesheets
│   │   └── App.jsx             # Router and application shell
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                     # Node.js + Express REST API
│   ├── config/                 # DB connection pool & in-memory fallback
│   ├── controllers/            # Controller logic (auth, equipment, labs, maintenance, etc.)
│   ├── middleware/             # JWT auth validation, error handler, async wrapper
│   ├── routes/                 # Express route definitions
│   ├── .env.example            # Sample environment configuration
│   ├── app.js                  # Express application setup & middleware
│   ├── server.js               # HTTP listener entrypoint
│   └── package.json
├── database/                   # Database scripts
│   ├── schema.sql              # MySQL DDL table schema
│   ├── seed.sql                # Initial realistic seed datasets
│   └── migrations/             # Schema migration scripts
├── .gitignore                  # Git ignore rules (node_modules, .env, dist)
└── README.md                   # Project documentation & setup instructions
```

---

## ❓ Troubleshooting & FAQs

1. **MySQL connection error (`ECONNREFUSED` / `ER_ACCESS_DENIED_ERROR`):**
   - Check if your MySQL server is running in services or XAMPP.
   - Verify `DB_USER` and `DB_PASSWORD` in `server/.env`.
   - *Note: Even without MySQL, the server automatically starts in in-memory fallback mode.*

2. **CORS issues when calling the API:**
   - Make sure backend is running on `http://localhost:5000` and frontend on `http://localhost:5173`. CORS is pre-configured for these origins.

3. **Port 5000 is already in use:**
   - Change `PORT=5001` in `server/.env` and update the proxy or `client/src/api/client.js` baseUrl accordingly.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
