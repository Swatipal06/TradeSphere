require("dotenv").config();

const dns = require("dns");
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) { }

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");
const { authMiddleware } = require("./middleware/authMiddleware");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("FATAL: JWT_SECRET is not set in .env. Server cannot start securely.");
  process.exit(1);
}

const app = express();

// ─── CORS Configuration ──────────────────────────────────────────────────────
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://127.0.0.1:3000", "http://127.0.0.1:3001"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or matching allowed origins
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for easy cloud deployment; adjust in high-security envs
      }
    },
    credentials: true,
  })
);

app.use(bodyParser.json());

// ─── Helper ──────────────────────────────────────────────────────────────────

const signToken = (userId) =>
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });

// ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────

// Health check
app.get("/", (req, res) => {
  res.json({
    app: "TradeSphere Virtual Trading API",
    status: "Active",
    dbStatus: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString(),
  });
});

// POST /signup — hash password, create user with default ₹1,00,000 funds, return JWT
app.post("/signup", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: "Database is not connected. Please verify your MongoDB Atlas username/password in backend/.env.",
      });
    }

    const { fullName, email, mobile, password } = req.body;

    if (!fullName || typeof fullName !== "string" || fullName.trim() === "") {
      return res.status(400).json({ error: "Full name is required." });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "A valid email address is required." });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await UserModel.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await UserModel.create({
      name: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      funds: {
        availableMargin: 100000,
        usedMargin: 0,
        availableCash: 100000,
        payin: 100000,
        span: 0,
        deliveryMargin: 0,
        exposure: 0,
        optionsPremium: 0,
        collateralLiquid: 0,
        collateralEquity: 0,
        totalCollateral: 0,
      },
    });

    const token = signToken(user._id);

    res.status(201).json({
      message: "Account created successfully!",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: "Server error during signup. Please try again." });
  }
});

// POST /login — verify password, issue JWT
app.post("/login", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: "Database is not connected. Please verify your MongoDB Atlas username/password in backend/.env.",
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await UserModel.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = signToken(user._id);

    res.status(200).json({
      message: "Login successful!",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Server error during login. Please try again." });
  }
});

// ─── PROTECTED ROUTES (require valid JWT) ─────────────────────────────────────

// GET /allHoldings — scoped to user
app.get("/allHoldings", authMiddleware, async (req, res) => {
  try {
    const holdings = await HoldingsModel.find({ userId: req.userId });
    res.json(holdings);
  } catch (err) {
    console.error("Holdings fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch holdings." });
  }
});

// GET /allPositions — scoped to user
app.get("/allPositions", authMiddleware, async (req, res) => {
  try {
    const positions = await PositionsModel.find({ userId: req.userId });
    res.json(positions);
  } catch (err) {
    console.error("Positions fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch positions." });
  }
});

// GET /allOrders — scoped to user
app.get("/allOrders", authMiddleware, async (req, res) => {
  try {
    const orders = await OrdersModel.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Orders fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

// POST /newOrder — full validation + per-user scoping
app.post("/newOrder", authMiddleware, async (req, res) => {
  try {
    const { name, qty, price, mode = "BUY", product = "CNC" } = req.body;

    // ── Input Validation ──
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ error: "Stock name/symbol is required." });
    }

    const numQty = Number(qty);
    if (!Number.isFinite(numQty) || numQty <= 0 || !Number.isInteger(numQty)) {
      return res.status(400).json({ error: "Quantity must be a positive whole integer." });
    }

    const numPrice = Number(price);
    if (!Number.isFinite(numPrice) || numPrice <= 0) {
      return res.status(400).json({ error: "Price must be a positive number." });
    }

    const orderMode = String(mode).toUpperCase();
    if (!["BUY", "SELL"].includes(orderMode)) {
      return res.status(400).json({ error: "Mode must be BUY or SELL." });
    }

    const orderProduct = String(product).toUpperCase();
    if (!["CNC", "MIS"].includes(orderProduct)) {
      return res.status(400).json({ error: "Product must be CNC or MIS." });
    }

    // ── Load user ──
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User account not found." });
    }

    const stockSymbol = name.trim().toUpperCase();
    const orderCost = Number((numQty * numPrice).toFixed(2));

    if (orderMode === "BUY") {
      // ── Funds check ──
      if (user.funds.availableMargin < orderCost) {
        return res.status(402).json({
          error: `Insufficient funds. Required ₹${orderCost.toLocaleString("en-IN", { minimumFractionDigits: 2 })}, available ₹${user.funds.availableMargin.toLocaleString("en-IN", { minimumFractionDigits: 2 })}.`,
        });
      }

      // ── Update holdings ──
      const existing = await HoldingsModel.findOne({ userId: req.userId, name: stockSymbol });
      if (existing) {
        const totalQty = existing.qty + numQty;
        const newAvg = (existing.avg * existing.qty + numPrice * numQty) / totalQty;
        existing.qty = totalQty;
        existing.avg = Number(newAvg.toFixed(2));
        existing.price = numPrice;
        await existing.save();
      } else {
        await HoldingsModel.create({
          userId: req.userId,
          name: stockSymbol,
          qty: numQty,
          avg: numPrice,
          price: numPrice,
          net: "+0.00%",
          day: "+0.00%",
          isLoss: false,
        });
      }

      // ── Deduct funds ──
      user.funds.availableMargin = Number((user.funds.availableMargin - orderCost).toFixed(2));
      user.funds.usedMargin = Number((user.funds.usedMargin + orderCost).toFixed(2));
      user.funds.availableCash = user.funds.availableMargin;
    } else {
      // ── SELL: check holding exists and qty is sufficient ──
      const holding = await HoldingsModel.findOne({ userId: req.userId, name: stockSymbol });
      if (!holding) {
        return res.status(409).json({ error: `You do not hold any shares of ${stockSymbol} to sell.` });
      }
      if (holding.qty < numQty) {
        return res.status(409).json({
          error: `Insufficient quantity. You hold ${holding.qty} shares of ${stockSymbol}, requested to sell ${numQty}.`,
        });
      }

      // ── Update or remove holding ──
      if (holding.qty === numQty) {
        await HoldingsModel.deleteOne({ _id: holding._id });
      } else {
        holding.qty -= numQty;
        await holding.save();
      }

      // ── Credit funds ──
      user.funds.availableMargin = Number((user.funds.availableMargin + orderCost).toFixed(2));
      user.funds.usedMargin = Math.max(0, Number((user.funds.usedMargin - orderCost).toFixed(2)));
      user.funds.availableCash = user.funds.availableMargin;
    }

    // ── Save user & create order record ──
    await user.save();

    const order = await OrdersModel.create({
      userId: req.userId,
      name: stockSymbol,
      qty: numQty,
      price: numPrice,
      mode: orderMode,
      product: orderProduct,
      status: "COMPLETE",
      createdAt: new Date(),
    });

    res.status(201).json({
      message: `${orderMode} order for ${numQty} shares of ${stockSymbol} executed successfully!`,
      order,
      funds: user.funds,
    });
  } catch (err) {
    console.error("Order error:", err.message);
    res.status(500).json({ error: "Server error while processing order." });
  }
});

// GET /funds — read directly from user document
app.get("/funds", authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("funds");
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json(user.funds);
  } catch (err) {
    console.error("Funds fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch funds." });
  }
});

// POST /funds/update — deposit or withdraw funds
app.post("/funds/update", authMiddleware, async (req, res) => {
  try {
    const { amount, type } = req.body;
    const numAmount = Number(amount);

    if (!numAmount || !Number.isFinite(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: "Amount must be a positive number." });
    }
    if (!["ADD", "WITHDRAW"].includes(type)) {
      return res.status(400).json({ error: "Transaction type must be ADD or WITHDRAW." });
    }

    const user = await UserModel.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    if (type === "ADD") {
      user.funds.availableMargin = Number((user.funds.availableMargin + numAmount).toFixed(2));
      user.funds.availableCash = user.funds.availableMargin;
      user.funds.payin = Number((user.funds.payin + numAmount).toFixed(2));
    } else {
      if (user.funds.availableMargin < numAmount) {
        return res.status(400).json({
          error: `Withdrawal amount (₹${numAmount}) exceeds available margin (₹${user.funds.availableMargin}).`,
        });
      }
      user.funds.availableMargin = Number((user.funds.availableMargin - numAmount).toFixed(2));
      user.funds.availableCash = user.funds.availableMargin;
    }

    await user.save();
    res.json({ message: "Funds updated successfully.", funds: user.funds });
  } catch (err) {
    console.error("Funds update error:", err.message);
    res.status(500).json({ error: "Server error while updating funds." });
  }
});

// ─── DEV / SEED ROUTES ────────────────────────────────────────────────────────

const seedHoldings = [
  { name: "BHARTIARTL", qty: 2, avg: 538.05, price: 541.15, net: "+0.58%", day: "+2.99%" },
  { name: "HDFCBANK", qty: 2, avg: 1383.4, price: 1522.35, net: "+10.04%", day: "+0.11%" },
  { name: "HINDUNILVR", qty: 1, avg: 2335.85, price: 2417.4, net: "+3.49%", day: "+0.21%" },
  { name: "INFY", qty: 1, avg: 1350.5, price: 1555.45, net: "+15.18%", day: "-1.60%", isLoss: true },
  { name: "ITC", qty: 5, avg: 202.0, price: 207.9, net: "+2.92%", day: "+0.80%" },
  { name: "KPITTECH", qty: 5, avg: 250.3, price: 266.45, net: "+6.45%", day: "+3.54%" },
  { name: "M&M", qty: 2, avg: 809.9, price: 779.8, net: "-3.72%", day: "-0.01%", isLoss: true },
  { name: "RELIANCE", qty: 1, avg: 2193.7, price: 2112.4, net: "-3.71%", day: "+1.44%" },
  { name: "SBIN", qty: 4, avg: 324.35, price: 430.2, net: "+32.63%", day: "-0.34%", isLoss: true },
  { name: "TCS", qty: 1, avg: 3041.7, price: 3194.8, net: "+5.03%", day: "-0.25%", isLoss: true },
  { name: "WIPRO", qty: 4, avg: 489.3, price: 577.75, net: "+18.08%", day: "+0.32%" },
];

const seedPositions = [
  { product: "CNC", name: "EVEREADY", qty: 2, avg: 316.27, price: 312.35, net: "+0.58%", day: "-1.24%", isLoss: true },
  { product: "CNC", name: "JUBLFOOD", qty: 1, avg: 3124.75, price: 3082.65, net: "+10.04%", day: "-1.35%", isLoss: true },
];

app.get("/addHoldings", authMiddleware, async (req, res) => {
  try {
    await HoldingsModel.deleteMany({ userId: req.userId });
    await HoldingsModel.insertMany(seedHoldings.map((h) => ({ ...h, userId: req.userId })));
    res.send("Holdings seeded successfully!");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/addPositions", authMiddleware, async (req, res) => {
  try {
    await PositionsModel.deleteMany({ userId: req.userId });
    await PositionsModel.insertMany(seedPositions.map((p) => ({ ...p, userId: req.userId })));
    res.send("Positions seeded successfully!");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/resetHoldings", authMiddleware, async (req, res) => {
  try {
    await HoldingsModel.deleteMany({ userId: req.userId });
    await HoldingsModel.insertMany(seedHoldings.map((h) => ({ ...h, userId: req.userId })));
    res.send("Holdings reset and re-seeded successfully!");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── SERVER START ─────────────────────────────────────────────────────────────

async function startServer() {
  if (!uri) {
    console.error("FATAL: MONGO_URL is not set in .env. Server cannot start.");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    console.error("Please verify your MONGO_URL credentials and network IP access in MongoDB Atlas.");
    // In production or dev, keep process running or log cleanly
  }

  app.listen(PORT, () => {
    console.log(`TradeSphere API server running on port ${PORT}`);
  });
}

startServer();