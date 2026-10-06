const express = require("express");
const router = express.Router();
const { NewsModel } = require("../model/NewsModel");
const { NewsAnalysisModel } = require("../model/NewsAnalysisModel");
const { fetchAndStoreNews } = require("../services/rssService");
const { analyzeFinancialNews } = require("../services/aiService");

/**
 * GET /api/news
 * Fetch paginated news articles with optional filters: ?symbol=RELIANCE&limit=20&page=1
 * Includes linked AI analysis when available
 */
router.get("/", async (req, res) => {
  try {
    const { symbol, category, limit = 20, page = 1 } = req.query;
    const query = {};

    if (symbol && symbol.trim() !== "" && symbol.toUpperCase() !== "ALL") {
      query.symbol = symbol.trim().toUpperCase();
    }
    if (category && category.trim() !== "" && category.toLowerCase() !== "all") {
      query.category = new RegExp(category.trim(), "i");
    }

    const numLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const numPage = Math.max(1, parseInt(page, 10) || 1);
    const skip = (numPage - 1) * numLimit;

    // If database has zero news, trigger initial RSS fetch / seed
    const countTotal = await NewsModel.countDocuments();
    if (countTotal === 0) {
      await fetchAndStoreNews();
    }

    const [articles, total] = await Promise.all([
      NewsModel.find(query)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(numLimit)
        .lean(),
      NewsModel.countDocuments(query),
    ]);

    // Attach analysis if exists
    const newsIds = articles.map((a) => a._id);
    const analyses = await NewsAnalysisModel.find({ newsId: { $in: newsIds } }).lean();
    const analysisMap = new Map();
    for (const item of analyses) {
      analysisMap.set(item.newsId.toString(), item);
    }

    const enriched = articles.map((art) => ({
      ...art,
      analysis: analysisMap.get(art._id.toString()) || null,
    }));

    res.json({
      success: true,
      articles: enriched,
      total,
      page: numPage,
      totalPages: Math.ceil(total / numLimit),
    });
  } catch (err) {
    console.error("[News API] Error fetching news:", err.message);
    res.status(500).json({ error: "Failed to retrieve financial news." });
  }
});

/**
 * POST /api/news/fetch
 * Trigger RSS feeds update
 */
router.post("/fetch", async (req, res) => {
  try {
    const result = await fetchAndStoreNews();
    res.json({
      message: `RSS feeds fetched successfully. ${result.insertedCount} new articles added.`,
      result,
    });
  } catch (err) {
    console.error("[News API] Error fetching RSS feeds:", err.message);
    res.status(500).json({ error: "Failed to update RSS news feeds." });
  }
});

/**
 * GET /api/news/article/:id
 * Retrieve a single news article with its analysis
 */
router.get("/article/:id", async (req, res) => {
  try {
    const article = await NewsModel.findById(req.params.id).lean();
    if (!article) {
      return res.status(404).json({ error: "News article not found." });
    }

    const analysis = await NewsAnalysisModel.findOne({ newsId: article._id }).lean();
    res.json({
      ...article,
      analysis: analysis || null,
    });
  } catch (err) {
    console.error("[News API] Error fetching single article:", err.message);
    res.status(500).json({ error: "Failed to retrieve news article." });
  }
});

/**
 * GET /api/news/:symbol
 * Fetch latest news for a specific stock symbol
 */
router.get("/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.trim().toUpperCase();
    const articles = await NewsModel.find({ symbol })
      .sort({ publishedAt: -1 })
      .limit(10)
      .lean();

    const newsIds = articles.map((a) => a._id);
    const analyses = await NewsAnalysisModel.find({ newsId: { $in: newsIds } }).lean();
    const analysisMap = new Map();
    for (const item of analyses) {
      analysisMap.set(item.newsId.toString(), item);
    }

    const enriched = articles.map((art) => ({
      ...art,
      analysis: analysisMap.get(art._id.toString()) || null,
    }));

    res.json(enriched);
  } catch (err) {
    console.error("[News API] Error fetching stock news:", err.message);
    res.status(500).json({ error: `Failed to retrieve news for ${req.params.symbol}.` });
  }
});

/**
 * POST /api/news/:id/analyze
 * Generate or retrieve AI analysis for a news article
 * Non-blocking: returns cached analysis if already exists
 */
router.post("/:id/analyze", async (req, res) => {
  try {
    const newsId = req.params.id;
    const article = await NewsModel.findById(newsId);
    if (!article) {
      return res.status(404).json({ error: "News article not found." });
    }

    // Performance & Caching rule: check if valid analysis already exists
    const existingAnalysis = await NewsAnalysisModel.findOne({ newsId: article._id });
    if (existingAnalysis) {
      return res.json({
        cached: true,
        analysis: existingAnalysis,
      });
    }

    // Call AI Service abstraction
    const aiInsight = await analyzeFinancialNews({
      title: article.title,
      description: article.description,
      source: article.source,
      symbol: article.symbol,
      companyName: article.companyName,
    });

    const newAnalysis = await NewsAnalysisModel.create({
      newsId: article._id,
      symbol: article.symbol || null,
      sentiment: aiInsight.sentiment,
      impact: aiInsight.impact,
      direction: aiInsight.direction,
      confidence: aiInsight.confidence,
      timeHorizon: aiInsight.timeHorizon,
      summary: aiInsight.summary,
      reasoning: aiInsight.reasoning,
      keyFactors: aiInsight.keyFactors,
      model: aiInsight.model,
      createdAt: new Date(),
    });

    article.hasAnalysis = true;
    await article.save();

    res.status(201).json({
      cached: false,
      analysis: newAnalysis,
    });
  } catch (err) {
    console.error("[News API] Error analyzing news:", err.message);
    res.status(500).json({ error: "Failed to generate AI analysis for this news." });
  }
});

module.exports = router;
