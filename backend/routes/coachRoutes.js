const express = require("express");
const router = express.Router();
const { OrdersModel } = require("../model/OrdersModel");
const { HoldingsModel } = require("../model/HoldingsModel");
const { UserModel } = require("../model/UserModel");
const { NewsModel } = require("../model/NewsModel");
const { NewsAnalysisModel } = require("../model/NewsAnalysisModel");
const { TradeAnalysisModel } = require("../model/TradeAnalysisModel");
const { authMiddleware } = require("../middleware/authMiddleware");
const { analyzeTrade } = require("../services/aiService");

// Reference prices for active watchlist instruments in TradeSphere
const WATCHLIST_PRICES = {
  INFY: 1555.45,
  ONGC: 116.80,
  TCS: 3194.80,
  KPITTECH: 266.45,
  QUICKHEAL: 308.55,
  WIPRO: 577.75,
  "M&M": 779.80,
  RELIANCE: 2112.40,
  HUL: 512.40,
  HINDUNILVR: 2417.40,
  BHARTIARTL: 541.15,
  HDFCBANK: 1522.35,
  ITC: 207.90,
  SBIN: 430.20,
  TATAPOWER: 124.15,
  EVEREADY: 312.35,
  JUBLFOOD: 3082.65,
  TATAMOTORS: 940.50,
  ICICIBANK: 1180.20,
  NIFTY: 24350.00,
  SENSEX: 80100.00,
};

/**
 * GET /api/coach/trades
 * Returns all executed orders for the authenticated user with attached AI analysis and performance stats
 */
router.get("/trades", authMiddleware, async (req, res) => {
  try {
    const orders = await OrdersModel.find({ userId: req.userId }).sort({ createdAt: -1 }).lean();

    if (orders.length === 0) {
      return res.json([]);
    }

    const orderIds = orders.map((o) => o._id);
    const [analyses, holdings] = await Promise.all([
      TradeAnalysisModel.find({ orderId: { $in: orderIds }, userId: req.userId }).lean(),
      HoldingsModel.find({ userId: req.userId }).lean(),
    ]);

    const analysisMap = new Map();
    for (const a of analyses) {
      analysisMap.set(a.orderId.toString(), a);
    }

    const holdingsMap = new Map();
    for (const h of holdings) {
      holdingsMap.set(h.name.toUpperCase(), h);
    }

    const enrichedOrders = orders.map((order) => {
      const symbol = (order.name || "").toUpperCase();
      const currentHolding = holdingsMap.get(symbol);
      const executionPrice = Number(order.price) || 0;
      const ltp = currentHolding ? Number(currentHolding.price) : (WATCHLIST_PRICES[symbol] || executionPrice);
      const isBuy = (order.mode || "BUY").toUpperCase() === "BUY";
      const pnl = isBuy ? (ltp - executionPrice) * order.qty : (executionPrice - ltp) * order.qty;
      const returnPct = executionPrice > 0 ? ((pnl / (executionPrice * order.qty)) * 100).toFixed(2) : "0.00";

      return {
        ...order,
        currentPrice: ltp,
        pnl: Number(pnl.toFixed(2)),
        returnPct: Number(returnPct),
        analysis: analysisMap.get(order._id.toString()) || null,
      };
    });

    res.json(enrichedOrders);
  } catch (err) {
    console.error("[Coach API] Error fetching trades:", err.message);
    res.status(500).json({ error: "Failed to retrieve trades for AI Trade Coach." });
  }
});

/**
 * GET /api/coach/analysis/:orderId
 * Retrieve existing trade analysis for a specific order
 */
router.get("/analysis/:orderId", authMiddleware, async (req, res) => {
  try {
    const analysis = await TradeAnalysisModel.findOne({
      orderId: req.params.orderId,
      userId: req.userId,
    }).lean();

    if (!analysis) {
      return res.status(404).json({ error: "No AI analysis found for this trade." });
    }

    res.json(analysis);
  } catch (err) {
    console.error("[Coach API] Error fetching trade analysis:", err.message);
    res.status(500).json({ error: "Failed to retrieve trade analysis." });
  }
});

/**
 * POST /api/coach/analyze/:orderId
 * Generate structured post-trade review using order data + news context
 */
router.post("/analyze/:orderId", authMiddleware, async (req, res) => {
  try {
    // 1. Verify order ownership
    const order = await OrdersModel.findOne({
      _id: req.params.orderId,
      userId: req.userId,
    });

    if (!order) {
      return res.status(404).json({ error: "Trade not found or access unauthorized." });
    }

    // 2. Cache check: return existing analysis if already performed
    const cachedAnalysis = await TradeAnalysisModel.findOne({
      orderId: order._id,
      userId: req.userId,
    });

    if (cachedAnalysis) {
      return res.json({
        cached: true,
        analysis: cachedAnalysis,
      });
    }

    // 3. Gather trade context (from existing DB records only)
    const symbol = (order.name || "").toUpperCase();
    const user = await UserModel.findById(req.userId).select("funds").lean();
    const holding = await HoldingsModel.findOne({ userId: req.userId, name: symbol }).lean();

    const executionPrice = Number(order.price) || 0;
    const ltp = holding ? Number(holding.price) : (WATCHLIST_PRICES[symbol] || executionPrice);
    const isBuy = (order.mode || "BUY").toUpperCase() === "BUY";
    const pnl = isBuy ? (ltp - executionPrice) * order.qty : (executionPrice - ltp) * order.qty;

    // 4. Connect RSS + Trade Coach: Retrieve relevant news analysis around this symbol
    let newsContext = null;
    const recentNewsAnalysis = await NewsAnalysisModel.findOne({ symbol })
      .sort({ createdAt: -1 })
      .populate("newsId")
      .lean();

    if (recentNewsAnalysis) {
      const headline = recentNewsAnalysis.newsId ? recentNewsAnalysis.newsId.title : null;
      newsContext = {
        headline,
        sentiment: recentNewsAnalysis.sentiment,
        direction: recentNewsAnalysis.direction,
        confidence: recentNewsAnalysis.confidence,
        impact: recentNewsAnalysis.impact,
        publishedAt: recentNewsAnalysis.createdAt,
      };
    } else {
      // Fallback: Check if there's raw news for this symbol that can provide headline context
      const rawNews = await NewsModel.findOne({ symbol }).sort({ publishedAt: -1 }).lean();
      if (rawNews) {
        newsContext = {
          headline: rawNews.title,
          sentiment: "Neutral",
          direction: "Neutral",
          confidence: 60,
          impact: "Low",
          publishedAt: rawNews.publishedAt,
        };
      }
    }

    // 5. Call AI Service abstraction
    const tradeDataForAI = {
      symbol,
      mode: order.mode || "BUY",
      qty: order.qty,
      price: executionPrice,
      currentPrice: ltp,
      pnl,
      funds: user ? user.funds : null,
      newsContext,
    };

    const review = await analyzeTrade(tradeDataForAI);

    // 6. Save in database
    const savedAnalysis = await TradeAnalysisModel.create({
      userId: req.userId,
      orderId: order._id,
      symbol,
      overallAssessment: review.overallAssessment,
      riskLevel: review.riskLevel,
      whatWentWell: review.whatWentWell,
      risks: review.risks,
      whatCouldImprove: review.whatCouldImprove,
      lesson: review.lesson,
      summary: review.summary,
      newsContext: review.newsContext,
      model: review.model,
      createdAt: new Date(),
    });

    res.status(201).json({
      cached: false,
      analysis: savedAnalysis,
    });
  } catch (err) {
    console.error("[Coach API] Error analyzing trade:", err.message);
    res.status(500).json({ error: "Failed to generate AI Trade Coach analysis." });
  }
});

module.exports = router;
