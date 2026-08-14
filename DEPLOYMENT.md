# TradeSphere Deployment Guide 🚀

This guide walks you through deploying the TradeSphere full-stack application (Backend, Frontend Landing Page, and Trading Dashboard).

---

## 1. MongoDB Atlas Setup (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in.
2. Under **Database Access**:
   - Create a database user (e.g., `tradesphere_user`) with a strong password.
   - Grant `Read and write to any database` privileges.
3. Under **Network Access**:
   - Click **Add IP Address**.
   - Select **Allow Access from Anywhere** (`0.0.0.0/0`) so cloud servers (Render, Railway, Vercel) can connect.
4. Under **Database > Connect > Drivers (Node.js)**:
   - Copy your connection string:
     ```
     mongodb+srv://<username>:<password>@<cluster>.mongodb.net/TradeSphere?retryWrites=true&w=majority
     ```

---

## 2. Backend Deployment (Render or Railway)

### Option A: Deploy on [Render](https://render.com)
1. Create a **New Web Service** linked to your Git repository.
2. Configure settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Environment Variables**:
     - `MONGO_URL` = `<Your MongoDB Atlas Connection String>`
     - `JWT_SECRET` = `<Generate a long random secure string, e.g. using openssl rand -hex 32>`
     - `PORT` = `10000` (or leave default, Render sets this automatically)
     - `CORS_ORIGINS` = `*` (or your frontend & dashboard domains comma-separated)
3. Deploy the service and copy the live URL (e.g. `https://tradesphere-api.onrender.com`).

---

## 3. Frontend Landing Page Deployment (Vercel or Netlify)

### Option A: Deploy on [Vercel](https://vercel.com)
1. Add New Project from your repository.
2. Configure settings:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Environment Variables**:
     - `REACT_APP_API_URL` = `https://tradesphere-api.onrender.com`
     - `REACT_APP_DASHBOARD_URL` = `https://tradesphere-dashboard.vercel.app`
3. Click **Deploy**.

---

## 4. Dashboard Deployment (Vercel or Netlify)

### Option A: Deploy on [Vercel](https://vercel.com)
1. Add New Project from your repository.
2. Configure settings:
   - **Framework Preset**: Create React App
   - **Root Directory**: `dashboard`
   - **Environment Variables**:
     - `REACT_APP_API_URL` = `https://tradesphere-api.onrender.com`
3. Click **Deploy**.

---

## 5. Local Development Quickstart

To run all 3 services locally:

### Terminal 1 — Backend:
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:3002
```

### Terminal 2 — Frontend:
```bash
cd frontend
npm install
npm start
# Running on http://localhost:3000
```

### Terminal 3 — Dashboard:
```bash
cd dashboard
npm install
npm start
# Running on http://localhost:3001
```
