# TradeSphere 📈

**A Zerodha-inspired virtual trading and investment platform, built on the MERN stack.**

TradeSphere lets users manage a simulated stock portfolio — placing buy/sell orders, tracking performance, and visualizing returns through an interactive analytics dashboard — without any real money at risk.

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-brightgreen)](#-tech-stack)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#-license)
[![Status](https://img.shields.io/badge/Status-In%20Development-yellow)](#-future-improvements)

🔗 **[Live Demo](#)** &nbsp;•&nbsp; 🐛 **[Report a Bug](https://github.com/Swatipal06/tradesphere/issues)** &nbsp;•&nbsp; ⭐ **[Star this repo](https://github.com/Swatipal06/tradesphere)**

---

## 💡 Why I Built This

I wanted to go beyond tutorial-style CRUD apps and build something that mirrors a real fintech product end-to-end — authentication, live-feeling trade simulation, and data visualization working together in one dashboard. TradeSphere was my way of practicing full-stack architecture decisions (schema design, protected routes, chart-driven UI) on a domain that's genuinely complex.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Analytics Included](#-analytics-included)
- [Installation](#️-installation)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [Learning Outcomes](#-learning-outcomes)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Features

### 🔐 Authentication & Security
- User registration and login
- JWT-based authentication
- Protected routes
- Password hashing with bcrypt

### 👤 User Profile
- Profile photo and personal details
- Risk profile (Low / Medium / High)
- Simulated KYC status
- Account settings

### 💹 Virtual Trading
- Buy and sell stocks (simulation)
- Order history
- Holdings management
- Watchlist and favorite stocks

### 📊 Analytics Dashboard
- Portfolio growth over time
- Asset allocation chart
- Daily profit/loss analysis
- Investment performance metrics
- Win rate and return analytics

### 📱 UI/UX
- Responsive design
- Modern fintech dashboard
- Dark mode support
- Interactive charts

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js, Tailwind CSS, Recharts, Axios, React Router DOM |
| **Backend** | Node.js, Express.js, JWT Authentication, bcrypt.js |
| **Database** | MongoDB, Mongoose |

---

## 📂 Project Structure

```
TradeSphere/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── charts/
│   │   ├── context/
│   │   └── utils/
│   └── public/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── config/
│
└── README.md
```

---

## 📈 Analytics Included

**Portfolio Growth**
- Track portfolio value over time
- Monthly performance analysis

**Asset Allocation**
- Stocks
- ETFs
- Mutual Funds
- Cash

**Profit & Loss**
- Daily P&L chart
- Overall return percentage
- Best and worst performing days

---

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/Swatipal06/tradesphere.git
cd tradesphere
```

### 2. Install backend dependencies
```bash
cd backend
npm install
```

### 3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### 4. Configure environment variables
Create a `.env` file inside the **backend** folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 5. Run the backend
```bash
cd backend
npm run dev
```

### 6. Run the frontend
```bash
cd frontend
npm start
```

The app should now be running at `http://localhost:3000` (frontend) with the API on `http://localhost:5000`.

---

## 📸 Screenshots

> Add screenshots to a `/screenshots` folder in the repo root, then reference them below. Remove this note once images are in place.

| Dashboard | Portfolio Analytics | User Profile |
|---|---|---|
| ![Dashboard](./screenshots/dashboard.png) | ![Analytics](./screenshots/analytics.png) | ![Profile](./screenshots/profile.png) |

---

## 🔮 Future Improvements

- [ ] Real stock market API integration
- [ ] Candlestick charts
- [ ] Price alerts
- [ ] AI-based investment insights
- [ ] Portfolio comparison
- [ ] Export reports (PDF/CSV)
- [ ] Mobile app version

---

## 🎯 Learning Outcomes

Through this project I practiced:
- Full-stack MERN development
- REST API design
- Authentication & authorization
- MongoDB data modeling
- Data visualization with Recharts
- State management in React
- Responsive UI design

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

## 👩‍💻 Author

**Swati Pal**
- GitHub: [@Swatipal06](https://github.com/Swatipal06)
- LinkedIn: [swati-pal06](https://linkedin.com/in/swati-pal06/)

---

⭐ If you found this project helpful, please consider giving it a star on GitHub!
