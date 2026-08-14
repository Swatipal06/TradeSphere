# TradeSphere 📈

**A Zerodha-inspired full-stack virtual trading terminal and investment platform, built on the MERN stack.**

TradeSphere provides an end-to-end simulated stock trading experience — allowing users to execute Buy & Sell orders with real-time pre-trade fund validation, manage holdings and positions with dynamic P&L calculations, and track portfolio analytics without risking real capital.

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-brightgreen)](#-tech-stack)
[![Authentication](https://img.shields.io/badge/Auth-JWT%20%2B%20bcrypt-blue)](#-key-features)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#-license)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)](#-future-roadmap)

🔗 **[Live Demo](https://github.com/Swatipal06/TradeSphere)** &nbsp;•&nbsp; 🐛 **[Report a Bug](https://github.com/Swatipal06/TradeSphere/issues)** &nbsp;•&nbsp; ⭐ **[Star this repo](https://github.com/Swatipal06/TradeSphere)**

---

## 💡 Why I Built This

I wanted to go beyond basic CRUD tutorials and engineer a multi-application fintech platform mirroring real-world trading platforms like Zerodha Kite. TradeSphere implements strict **per-user data scoping**, **JWT authentication with middleware protection**, **real-time pre-trade margin and stock ownership validations**, and **multi-service orchestration** (Landing Page, Trading Terminal Dashboard, and Express API).

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Project Structure](#-project-structure)
- [Trade Execution & Validation Engine](#-trade-execution--validation-engine)
- [Installation & Local Setup](#-installation--local-setup)
- [Environment Configuration](#-environment-configuration)
- [Deployment Guide](#-deployment-guide)
- [Future Roadmap](#-future-roadmap)
- [Contributing](#-contributing)
- [License & Author](#-license--author)

---

## 🚀 Key Features

### 🔐 1. Real Authentication & Session Security
- **Salted Password Hashing**: Passwords encrypted with `bcrypt` (12 salt rounds) before persistence.
- **JWT Authorization**: Cryptographically signed 7-day tokens verified by backend `authMiddleware`.
- **Axios Request Interceptor**: Automatic `Bearer <token>` injection for all secure requests.
- **Global Auth Guard**: 401 Unauthorized interceptor that automatically wipes expired tokens and redirects to login.

### 👤 2. Per-User Scoped Data Architecture
- **Isolated User State**: All portfolio entities (`Holdings`, `Positions`, `Orders`) are strictly linked to the authenticated user's `userId`.
- **Integrated Virtual Capital**: User document manages personal margin metrics (`availableMargin`, `usedMargin`, `availableCash`, `payin`).
- **Initial Capital**: Every new account starts with a virtual balance of **₹1,00,000**.

### 💹 3. Robust Order Execution Engine
- **Pre-Trade Balance Verification (BUY)**: Ensures `availableMargin >= quantity * price`. Rejects insufficient funds with HTTP `402 Payment Required`.
- **Holding & Quantity Verification (SELL)**: Confirms the user holds the target stock with sufficient quantity. Rejects invalid sales with HTTP `409 Conflict`.
- **Weighted Average Price Computation**: Automatically calculates and updates the weighted average buy price when acquiring additional shares of existing holdings.
- **Atomic Margin Updates**: Automatically adjusts used/available margin on trade completion.
- **Input Sanitization**: Rejects invalid stock names, zero or negative quantities, and negative prices with HTTP `400 Bad Request`.

### 📊 4. Interactive Trading Dashboard (Kite UI)
- **Live Market Watchlist**: Interactive stock list with live hover actions (**B** for Buy, **S** for Sell).
- **Simulated Market Fluctuations**: Dynamic live indices for **NIFTY 50** and **SENSEX**.
- **Portfolio Analytics**: Visual distribution graphs, daily P&L, net percentage gains, and investment summaries.
- **Funds Management**: Seamless virtual deposits and withdrawals with real-time margin adjustments.
- **Orderbook**: Chronological order history with execution status badges.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies | Description |
|---|---|---|
| **Frontend (Landing Page)** | React 19, Bootstrap 5, FontAwesome | Marketing pages, pricing, products, and signup portal |
| **Dashboard (Trading Terminal)** | React 19, Chart.js, Axios, React Router 6 | Zerodha Kite-inspired trading terminal |
| **Backend API** | Node.js, Express 5, JWT, bcrypt | RESTful microservice API with auth middleware |
| **Database** | MongoDB Atlas, Mongoose 9 | Document store with indexed user references |

---

## 📂 Project Structure

```
TradeSphere/
│
├── frontend/                     # Landing page & public portal (Port 3000)
│   ├── public/
│   └── src/
│       ├── landing_page/         # Home, About, Pricing, Products, Signup
│       └── index.js
│
├── dashboard/                    # Trading terminal dashboard (Port 3001)
│   ├── public/
│   └── src/
│       ├── components/           # WatchList, Holdings, Orders, Funds, BuyActionWindow, Login
│       ├── utils/                # api.js (Axios client with JWT interceptor)
│       └── index.js
│
├── backend/                      # Express REST API (Port 3002)
│   ├── middleware/               # authMiddleware.js (JWT verification)
│   ├── model/                    # UserModel, HoldingsModel, PositionsModel, OrdersModel
│   ├── schemas/                  # UserSchema, HoldingsSchemas, PositionsSchema, OrdersSchemas
│   ├── index.js                  # Express server, route handlers & order logic
│   └── package.json
│
├── DEPLOYMENT.md                 # Complete Cloud Deployment Guide (Render + Vercel)
├── package.json                  # Root orchestrator with concurrently scripts
└── README.md
```

---

## ⚙️ Trade Execution & Validation Engine

```
[ User Action: Buy / Sell ]
            │
            ▼
[ Dashboard Axios Interceptor ] ── Adds Bearer JWT Header
            │
            ▼
[ Backend authMiddleware ] ── Validates JWT & Attaches req.userId
            │
            ▼
[ /newOrder Route Validator ]
 ├── Validate Qty > 0 & Price > 0
 ├── BUY  ──> Check: availableMargin >= (qty * price)
 │             ├─► Insufficient? ──> Return HTTP 402
 │             └─► Sufficient?   ──> Deduct Margin & Update/Create Holding
 └── SELL ──> Check: user holds stock & holding.qty >= qty
               ├─► Insufficient? ──> Return HTTP 409
               └─► Sufficient?   ──> Credit Margin & Reduce/Delete Holding
            │
            ▼
[ OrdersModel.create() ] ── Logs complete order to user's orderbook
            │
            ▼
[ Return HTTP 201 Created ] ── Updates UI & Refreshes Portfolio State
```

---

## 💻 Installation & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/Swatipal06/TradeSphere.git
cd TradeSphere
```

### 2. Install dependencies
```bash
# Install root orchestrator dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install

# Install dashboard dependencies
cd ../dashboard && npm install

cd ..
```

### 3. Configure Environment Variables

Create `.env` in `backend/`:
```env
MONGO_URL=mongodb+srv://<username>:<password>@tradespherecluster.4smkiwp.mongodb.net/TradeSphere?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
PORT=3002
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

*(Optional)* Create `.env` in `frontend/` & `dashboard/`:
```env
# In frontend/.env
REACT_APP_API_URL=http://localhost:3002
REACT_APP_DASHBOARD_URL=http://localhost:3001

# In dashboard/.env
REACT_APP_API_URL=http://localhost:3002
```

### 4. Run the entire application

From the **root directory**, start all 3 services concurrently:
```bash
npm start
```

| Service | Local URL |
|---|---|
| 🌐 **Frontend (Landing Page)** | [http://localhost:3000](http://localhost:3000) |
| 📊 **Trading Dashboard** | [http://localhost:3001](http://localhost:3001) |
| 🔌 **Backend API** | [http://localhost:3002](http://localhost:3002) |

---

## 🚀 Deployment Guide

TradeSphere is architected for seamless cloud deployment:
- **Backend API**: Deploy to [Render](https://render.com) or [Railway](https://railway.app)
- **Frontend & Dashboard**: Deploy as separate static/React apps on [Vercel](https://vercel.com) or [Netlify](https://netlify.com)

👉 Refer to **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the complete step-by-step production deployment walkthrough.

---

## 🔮 Future Roadmap

- [ ] Real-time WebSocket / Socket.io streaming for live stock price tickers
- [ ] Integration with Alpha Vantage / Yahoo Finance market data APIs
- [ ] Technical analysis candlestick charts (TradingView / Lightweight Charts)
- [ ] Advanced order types (Stop-Loss, Target/Limit orders, Trailing SL)
- [ ] Dark / Light mode theme toggling across the dashboard

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more information.

---

## 👩‍💻 Author

**Swati Pal**
- GitHub: [@Swatipal06](https://github.com/Swatipal06)
- LinkedIn: [swati-pal06](https://linkedin.com/in/swati-pal06/)

⭐ **If you found this project helpful, please consider giving it a star on GitHub!**
