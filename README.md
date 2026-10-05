# LabTrack — College Laboratory Equipment Management System

## 📌 Project Description
LabTrack is a centralized web platform designed for university and college engineering/science laboratories to manage instrument inventory, track real-time operational status (Available, In Use, Damaged, Retired), monitor lab room utilization, and maintain traceable calibration and service records.

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- **Framework:** React (Vite)
- **Routing:** React Router v6
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Styling:** Vanilla CSS with custom design tokens

### Backend (`/server`)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database Driver:** `mysql2` (Connection Pool & Parameterized Queries)
- **Validation:** `express-validator`
- **Development Tooling:** `nodemon`, `dotenv`, `cors`

### Database (`/database`)
- **RDBMS:** MySQL
- **Schema:** `database/schema.sql`
- **Seed Data:** `database/seed.sql`

---

## 🚀 Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) (v8.0+ optional for live DB; fallback in-memory mode available)
- [Git](https://git-scm.com/)

---

### 1. Database Setup
1. Open your MySQL client or CLI.
2. Execute the schema:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
3. (Optional) Seed sample data:
   ```bash
   mysql -u root -p labtrack_db < database/seed.sql
   ```

---

### 2. Backend Server Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
4. Configure database credentials in `.env`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=labtrack_db
   JWT_SECRET=your_jwt_secret_key_here
   ```
5. Start the server:
   ```bash
   npm run dev
   ```
   *The server will run on `http://localhost:5000`.*

---

### 3. Frontend Client Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client will run on `http://localhost:5173`.*

---

## 📂 Monorepo Structure

```
labtrack/
├── client/          # Vite + React Frontend
├── server/          # Express REST API Backend
├── database/        # MySQL Schema & Seed Scripts
│   ├── schema.sql
│   └── seed.sql
├── .gitignore       # Root Git Ignore rules
└── README.md        # Project Documentation & Setup Guide
```
