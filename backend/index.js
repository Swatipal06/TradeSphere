require("dotenv").config();

const dns = require("dns");
// Set reliable DNS servers to resolve MongoDB Atlas SRV records on local network/ISP setup
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // DNS server override fallback
}

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

app.use(cors());
app.use(bodyParser.json());

// In-memory fallback stores for high resilience and instant testing
let memoryHoldings = [
  { name: "BHARTIARTL", qty: 2, avg: 538.05, price: 541.15, net: "+0.58%", day: "+2.99%" },
  { name: "HDFCBANK", qty: 2, avg: 1383.4, price: 1522.35, net: "+10.04%", day: "+0.11%" },
  { name: "HINDUNILVR", qty: 1, avg: 2335.85, price: 2417.4, net: "+3.49%", day: "+0.21%" },
  { name: "INFY", qty: 1, avg: 1350.5, price: 1555.45, net: "+15.18%", day: "-1.60%", isLoss: true },
  { name: "ITC", qty: 5, avg: 202.0, price: 207.9, net: "+2.92%", day: "+0.80%" },
  { name: "KPITTECH", qty: 5, avg: 250.3, price: 266.45, net: "+6.45%", day: "+3.54%" },
  { name: "M&M", qty: 2, avg: 809.9, price: 779.8, net: "-3.72%", day: "-0.01%", isLoss: true },
  { name: "RELIANCE", qty: 1, avg: 2193.7, price: 2112.4, net: "-3.71%", day: "+1.44%" },
  { name: "SBIN", qty: 4, avg: 324.35, price: 430.2, net: "+32.63%", day: "-0.34%", isLoss: true },
  { name: "SGBMAY29", qty: 2, avg: 4727.0, price: 4719.0, net: "-0.17%", day: "+0.15%" },
  { name: "TATAPOWER", qty: 5, avg: 104.2, price: 124.15, net: "+19.15%", day: "-0.24%", isLoss: true },
  { name: "TCS", qty: 1, avg: 3041.7, price: 3194.8, net: "+5.03%", day: "-0.25%", isLoss: true },
  { name: "WIPRO", qty: 4, avg: 489.3, price: 577.75, net: "+18.08%", day: "+0.32%" },
];

let memoryPositions = [
  {
    product: "CNC",
    name: "EVEREADY",
    qty: 2,
    avg: 316.27,
    price: 312.35,
    net: "+0.58%",
    day: "-1.24%",
    isLoss: true,
  },
  {
    product: "CNC",
    name: "JUBLFOOD",
    qty: 1,
    avg: 3124.75,
    price: 3082.65,
    net: "+10.04%",
    day: "-1.35%",
    isLoss: true,
  },
];

let memoryOrders = [
  {
    _id: "demo-ord-1",
    name: "INFY",
    qty: 1,
    price: 1555.45,
    mode: "BUY",
    product: "CNC",
    status: "COMPLETE",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: "demo-ord-2",
    name: "TCS",
    qty: 1,
    price: 3194.8,
    mode: "BUY",
    product: "CNC",
    status: "COMPLETE",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

let memoryFunds = {
  availableMargin: 104043.1,
  usedMargin: 3757.3,
  availableCash: 104043.1,
  openingBalance: 104043.1,
  payin: 100000.0,
  span: 0.0,
  deliveryMargin: 0.0,
  exposure: 0.0,
  optionsPremium: 0.0,
  collateralLiquid: 0.0,
  collateralEquity: 0.0,
  totalCollateral: 0.0,
};

let isMongoConnected = false;

// ---------------- API ROUTES ----------------

// Seed initial Holdings
app.get("/addHoldings", async (req, res) => {
  if (isMongoConnected) {
    await HoldingsModel.deleteMany({});
    await HoldingsModel.insertMany(memoryHoldings);
    return res.send("Holdings seeded successfully!");
  }
  res.send("In-memory Holdings ready!");
});

// Seed initial Positions
app.get("/addPositions", async (req, res) => {
  if (isMongoConnected) {
    await PositionsModel.deleteMany({});
    await PositionsModel.insertMany(memoryPositions);
    return res.send("Positions seeded successfully!");
  }
  res.send("In-memory Positions ready!");
});

// GET All Holdings
app.get("/allHoldings", async (req, res) => {
  try {
    if (isMongoConnected) {
      let allHoldings = await HoldingsModel.find({});
      if (allHoldings.length > 0) {
        return res.json(allHoldings);
      }
      // Auto seed if empty
      await HoldingsModel.insertMany(memoryHoldings);
      return res.json(memoryHoldings);
    }
  } catch (err) {
    console.error("DB Fetch Error:", err.message);
  }
  res.json(memoryHoldings);
});

// Reset Holdings
app.get("/resetHoldings", async (req, res) => {
  try {
    if (isMongoConnected) {
      await HoldingsModel.deleteMany({});
      await HoldingsModel.insertMany(memoryHoldings);
    }
  } catch (err) {
    console.error("DB Reset Error:", err.message);
  }
  res.send("Holdings reset and re-seeded successfully!");
});

// GET All Positions
app.get("/allPositions", async (req, res) => {
  try {
    if (isMongoConnected) {
      let allPositions = await PositionsModel.find({});
      if (allPositions.length > 0) {
        return res.json(allPositions);
      }
      await PositionsModel.insertMany(memoryPositions);
      return res.json(memoryPositions);
    }
  } catch (err) {
    console.error("DB Positions Error:", err.message);
  }
  res.json(memoryPositions);
});

// GET All Orders
app.get("/allOrders", async (req, res) => {
  try {
    if (isMongoConnected) {
      let allOrders = await OrdersModel.find({}).sort({ createdAt: -1 });
      if (allOrders.length > 0) {
        return res.json(allOrders);
      }
    }
  } catch (err) {
    console.error("DB Orders Error:", err.message);
  }
  res.json(memoryOrders);
});

// POST New Order (Supports BUY & SELL simulation)
app.post("/newOrder", async (req, res) => {
  const { name, qty, price, mode = "BUY", product = "CNC" } = req.body;
  const numQty = Number(qty) || 1;
  const numPrice = Number(price) || 0;

  const orderData = {
    name,
    qty: numQty,
    price: numPrice,
    mode: mode.toUpperCase(),
    product: product.toUpperCase(),
    status: "COMPLETE",
    createdAt: new Date(),
  };

  try {
    if (isMongoConnected) {
      const newOrder = new OrdersModel(orderData);
      await newOrder.save();

      // Update holdings if BUY or SELL
      if (mode.toUpperCase() === "BUY") {
        const existing = await HoldingsModel.findOne({ name });
        if (existing) {
          const totalQty = existing.qty + numQty;
          const newAvg = ((existing.avg * existing.qty) + (numPrice * numQty)) / totalQty;
          existing.qty = totalQty;
          existing.avg = Number(newAvg.toFixed(2));
          existing.price = numPrice > 0 ? numPrice : existing.price;
          await existing.save();
        } else {
          await HoldingsModel.create({
            name,
            qty: numQty,
            avg: numPrice,
            price: numPrice,
            net: "0.00%",
            day: "0.00%",
          });
        }
      }
    }
  } catch (err) {
    console.error("Order Save Error:", err.message);
  }

  // Also update in-memory cache
  memoryOrders.unshift({ ...orderData, _id: "ord-" + Date.now() });

  // Update in-memory holdings for instant UI sync
  if (mode.toUpperCase() === "BUY") {
    const existingIndex = memoryHoldings.findIndex((h) => h.name === name);
    if (existingIndex !== -1) {
      const curr = memoryHoldings[existingIndex];
      const totalQty = curr.qty + numQty;
      const newAvg = ((curr.avg * curr.qty) + (numPrice * numQty)) / totalQty;
      memoryHoldings[existingIndex] = {
        ...curr,
        qty: totalQty,
        avg: Number(newAvg.toFixed(2)),
        price: numPrice > 0 ? numPrice : curr.price,
      };
    } else {
      memoryHoldings.push({
        name,
        qty: numQty,
        avg: numPrice,
        price: numPrice,
        net: "0.00%",
        day: "0.00%",
      });
    }

    // Deduct margin used
    memoryFunds.availableMargin = Math.max(0, memoryFunds.availableMargin - (numQty * numPrice));
    memoryFunds.usedMargin += (numQty * numPrice);
  }

  res.status(201).json({ message: "Order placed successfully!", order: orderData });
});

// GET Funds status
app.get("/funds", (req, res) => {
  res.json(memoryFunds);
});

// POST Update Funds (Deposit / Withdraw)
app.post("/funds/update", (req, res) => {
  const { amount, type } = req.body;
  const numAmount = Number(amount) || 0;

  if (type === "ADD") {
    memoryFunds.availableMargin += numAmount;
    memoryFunds.availableCash += numAmount;
    memoryFunds.payin += numAmount;
  } else if (type === "WITHDRAW") {
    if (memoryFunds.availableMargin >= numAmount) {
      memoryFunds.availableMargin -= numAmount;
      memoryFunds.availableCash -= numAmount;
    } else {
      return res.status(400).json({ error: "Insufficient margin to withdraw" });
    }
  }

  res.json({ message: "Funds updated successfully", funds: memoryFunds });
});

// User Authentication Endpoints (Simulated MERN Auth)
app.post("/signup", (req, res) => {
  const { fullName, email, mobile } = req.body;
  res.status(201).json({
    message: "User registered successfully",
    user: { fullName: fullName || "Trader", email, mobile },
    token: "tradesphere-simulated-jwt-token",
  });
});

app.post("/login", (req, res) => {
  const { email } = req.body;
  res.status(200).json({
    message: "Login successful",
    user: { fullName: email ? email.split("@")[0] : "Trader", email },
    token: "tradesphere-simulated-jwt-token",
  });
});

// Server Health Check
app.get("/", (req, res) => {
  res.json({
    app: "TradeSphere Virtual Trading API",
    status: "Active",
    dbStatus: isMongoConnected ? "Connected" : "In-Memory Simulation Mode",
  });
});

async function startServer() {
  if (uri) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      isMongoConnected = true;
      console.log("MongoDB connected successfully");
    } catch (err) {
      console.warn("MongoDB connection failed or timed out. Operating in high-performance memory mode.");
      console.warn(err.message);
    }
  } else {
    console.log("No MONGO_URL configured. Running with in-memory persistence.");
  }

  app.listen(PORT, () => {
    console.log(`TradeSphere API server running on port ${PORT}`);
  });
}

startServer();