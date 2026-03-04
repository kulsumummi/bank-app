# BankUs - MongoDB Banking Simulation (Local)

A complete, production-ready full-stack banking application built with React, Node.js, and your existing local MongoDB installation.

## 🌟 Key Features
- **Local MongoDB Integration**: Connected directly to your local `mongod` binary for full control.
- **Secure Authentication**: JWT-based auth with HTTP-only cookies and Mongoose-backed token persistence.
- **Atomic Money Transfers**: Uses MongoDB transactions (`session.withTransaction`) to ensure zero-loss transfers.
- **Financial Dashboard**: Real-time balance updates and instant money transfers.
- **Clean Standard UI**: Fully responsive design with Tailwind CSS.
- **Support ChatBot**: Expandable help widget for customer assistance.

---

## 🚀 Setup Instructions

### 1. Database Setup (Local)
1. I have provided a `start-mongo.bat` file in the project root.
2. Simply double-click **`start-mongo.bat`** to launch your local MongoDB server using your existing binary.
3. This script stores all data in the project's **`data/db/`** folder.

### 2. Backend Configuration
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. A `.env` file has been pre-configured for your local MongoDB (`mongodb://localhost:27017/banking_db`).
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Configuration
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure
```text
├── backend/
│   ├── config/      # Mongoose connection
│   ├── controllers/ # Auth and Banking logic (Mongoose)
│   ├── middleware/  # JWT & Session guards
│   ├── models/      # User and Token schemas
│   ├── routes/      # API endpoints
│   └── server.js    # Entry point
├── frontend/        # React Application
├── data/db/         # Local MongoDB storage
├── start-mongo.bat  # Quick-launch script for local DB
└── README.md
```
