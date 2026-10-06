/**
 * AI Service Abstraction for TradeSphere
 * 
 * Modular architecture:
 * 1. Configurable provider via env (Ollama, OpenAI-compatible / OpenRouter / Groq, or Local Financial NLP)
 * 2. Strict JSON validation and schema enforcement
 * 3. Zero-cost guarantee with seamless local heuristic fallback
 * 4. Non-blocking & graceful error handling
 */

// ─── Enums & Validators ──────────────────────────────────────────────────────

const ALLOWED_SENTIMENT = ["Positive", "Neutral", "Negative"];
const ALLOWED_IMPACT = ["Low", "Medium", "High"];
const ALLOWED_DIRECTION = ["Bullish", "Neutral", "Bearish"];
const ALLOWED_TIME_HORIZON = ["Short Term", "Medium Term", "Long Term"];
const ALLOWED_ASSESSMENT = ["Good", "Average", "Needs Improvement"];
const ALLOWED_RISK_LEVEL = ["Low", "Medium", "High"];

function clampConfidence(val, fallback = 75) {
  const num = Number(val);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(100, Math.max(0, Math.round(num)));
}

function matchEnum(val, allowed, fallback) {
  if (!val || typeof val !== "string") return fallback;
  const match = allowed.find((item) => item.toLowerCase() === val.trim().toLowerCase());
  return match || fallback;
}

// ─── Local Financial NLP Heuristic Engine ─────────────────────────────────────

const BULLISH_KEYWORDS = [
  "surge", "surges", "jump", "jumps", "beat", "beats", "record", "profit", "expansion",
  "growth", "deal", "bags", "rollout", "investment", "dividend", "acquisition", "rally",
  "upgrade", "raises", "stellar", "outperform", "milestone", "high", "positive", "breakout",
  "contract", "partnership", "soar", "gain", "gains", "green energy", "order win"
];

const BEARISH_KEYWORDS = [
  "plunge", "slump", "loss", "losses", "miss", "misses", "probe", "investigation",
  "fraud", "penalty", "fine", "debt", "default", "downgrade", "cut", "decline",
  "inflation", "recession", "weak", "selloff", "drops", "crash", "contraction",
  "warning", "tumble", "cautions", "deficit", "litigation"
];

function analyzeNewsHeuristically(news) {
  const title = (news.title || "").toLowerCase();
  const desc = (news.description || "").toLowerCase();
  const text = `${title} ${title} ${desc}`; // Weight title twice

  let bullScore = 0;
  let bearScore = 0;
  const detectedFactors = [];

  for (const kw of BULLISH_KEYWORDS) {
    if (text.includes(kw)) {
      bullScore += kw === "record" || kw === "profit" || kw === "deal" || kw === "expansion" ? 2 : 1;
      if (detectedFactors.length < 4 && !detectedFactors.includes(kw)) {
        detectedFactors.push(capitalizeWords(kw) + " catalyst");
      }
    }
  }

  for (const kw of BEARISH_KEYWORDS) {
    if (text.includes(kw)) {
      bearScore += kw === "fraud" || kw === "default" || kw === "downgrade" || kw === "loss" ? 2 : 1;
      if (detectedFactors.length < 4 && !detectedFactors.includes(kw)) {
        detectedFactors.push(capitalizeWords(kw) + " headwind");
      }
    }
  }

  let direction = "Neutral";
  let sentiment = "Neutral";
  let confidence = 65;
  let impact = "Medium";
  let timeHorizon = "Short Term";

  const diff = bullScore - bearScore;

  if (diff >= 2) {
    direction = "Bullish";
    sentiment = "Positive";
    confidence = Math.min(95, 70 + diff * 5);
    impact = diff >= 4 ? "High" : "Medium";
    timeHorizon = diff >= 4 ? "Medium Term" : "Short Term";
  } else if (diff <= -2) {
    direction = "Bearish";
    sentiment = "Negative";
    confidence = Math.min(95, 70 + Math.abs(diff) * 5);
    impact = Math.abs(diff) >= 4 ? "High" : "Medium";
    timeHorizon = Math.abs(diff) >= 4 ? "Medium Term" : "Short Term";
  } else {
    direction = "Neutral";
    sentiment = "Neutral";
    confidence = 60;
    impact = "Low";
    timeHorizon = "Short Term";
  }

  const subject = news.symbol
    ? `${news.companyName || news.symbol} (${news.symbol})`
    : "The broader market";

  let summary = "";
  let reasoning = "";

  if (direction === "Bullish") {
    summary = `Recent developments point to positive operating momentum and favorable market positioning for ${subject}.`;
    reasoning = `Key catalysts including business expansion or earnings stability are likely to support investor sentiment over the ${timeHorizon.toLowerCase()}.`;
  } else if (direction === "Bearish") {
    summary = `Reported headwinds or adverse headlines may create near-term volatility and margin scrutiny for ${subject}.`;
    reasoning = `Underlying concerns highlighted in available reports indicate elevated downside risk or conservative market expectations.`;
  } else {
    summary = `The announcement reflects balanced fundamental developments for ${subject} with steady baseline metrics.`;
    reasoning = `Current information suggests measured market reactions with limited immediate disruption to prevailing trends.`;
  }

  if (detectedFactors.length === 0) {
    detectedFactors.push("Market liquidity", "Macro sector trend", "Investor sentiment");
  }

  return {
    sentiment,
    impact,
    direction,
    confidence,
    timeHorizon,
    summary,
    reasoning,
    keyFactors: detectedFactors.slice(0, 4),
    model: "tradesphere-financial-nlp",
  };
}

function analyzeTradeHeuristically(tradeData) {
  const {
    symbol = "Stock",
    mode = "BUY",
    qty = 1,
    price = 100,
    currentPrice = null,
    pnl = null,
    funds = null,
    newsContext = null,
  } = tradeData;

  const isBuy = mode.toUpperCase() === "BUY";
  const executionPrice = Number(price);
  const ltp = currentPrice ? Number(currentPrice) : executionPrice;
  const computedPnl = pnl !== null ? Number(pnl) : (isBuy ? (ltp - executionPrice) * qty : (executionPrice - ltp) * qty);
  const tradeCost = executionPrice * qty;
  const returnPct = executionPrice > 0 ? ((computedPnl / tradeCost) * 100).toFixed(2) : "0.00";
  const isProfitable = computedPnl >= 0;

  // Portfolio concentration check
  let portfolioExposurePct = 0;
  if (funds && funds.availableMargin !== undefined && funds.usedMargin !== undefined) {
    const totalCapital = Number(funds.availableMargin) + Number(funds.usedMargin);
    if (totalCapital > 0) {
      portfolioExposurePct = Math.round((tradeCost / totalCapital) * 100);
    }
  }

  // News alignment check
  const hasNews = newsContext && newsContext.sentiment;
  const isNewsBullish = hasNews && (newsContext.direction === "Bullish" || newsContext.sentiment === "Positive");
  const isNewsBearish = hasNews && (newsContext.direction === "Bearish" || newsContext.sentiment === "Negative");

  let overallAssessment = "Average";
  let riskLevel = "Medium";
  const whatWentWell = [];
  const risks = [];
  const whatCouldImprove = [];

  // 1. Evaluate News Alignment
  if (isBuy && isNewsBullish) {
    whatWentWell.push(`Entry was well-timed with bullish news sentiment (${newsContext.headline ? `"${newsContext.headline.substring(0, 50)}..."` : "favorable announcements"}).`);
  } else if (!isBuy && isNewsBearish) {
    whatWentWell.push("Sell exit was disciplined, avoiding potential headline drawdowns.");
  } else if (isBuy && isNewsBearish) {
    risks.push("Buy entry was executed against prevailing negative news sentiment and headline risks.");
    whatCouldImprove.push("Wait for market digestion of adverse news catalysts before opening long positions.");
  }

  // 2. Evaluate Profitability & Risk-Reward
  if (isProfitable) {
    whatWentWell.push(`Generated positive virtual return of ${returnPct >= 0 ? "+" : ""}${returnPct}% (₹${computedPnl.toFixed(2)}).`);
    if (overallAssessment === "Average") overallAssessment = "Good";
  } else {
    whatCouldImprove.push("Consider maintaining a predefined stop-loss order to protect capital against trend reversal.");
    if (Math.abs(Number(returnPct)) > 5) {
      risks.push(`Position experienced a ${returnPct}% retracement from initial execution level.`);
      overallAssessment = "Needs Improvement";
    }
  }

  // 3. Evaluate Portfolio Exposure & Sizing
  if (portfolioExposurePct > 25) {
    risks.push(`Trade represented ~${portfolioExposurePct}% of your total virtual capital, indicating high single-instrument concentration risk.`);
    whatCouldImprove.push("Diversify position sizing so that no individual holding exceeds 10-15% of your portfolio margin.");
    riskLevel = "High";
  } else {
    whatWentWell.push("Controlled order sizing kept portfolio allocation within balanced risk parameters.");
    if (riskLevel !== "High") riskLevel = "Low";
  }

  // Ensure default feedback if arrays are empty
  if (whatWentWell.length === 0) {
    whatWentWell.push("Order was executed cleanly at the planned price level with standard margin rules.");
  }
  if (risks.length === 0) {
    risks.push("Market volatility and intraday fluctuations can impact short-term returns.");
  }
  if (whatCouldImprove.length === 0) {
    whatCouldImprove.push("Monitor key technical support levels and subsequent earnings announcements.");
  }

  // Formulate Key Lesson & Summary
  let lesson = "";
  let summary = "";

  if (hasNews && isBuy && isNewsBullish) {
    lesson = `Positive news flow can provide strong momentum tailwinds, but prudent position sizing remains essential to withstand volatility.`;
    summary = `The trade demonstrated strong alignment with market catalysts, resulting in a ${overallAssessment.toLowerCase()} execution with ${riskLevel.toLowerCase()} risk profile.`;
  } else if (hasNews && isBuy && isNewsBearish) {
    lesson = `Trading against market sentiment requires higher confirmation thresholds and strictly enforced stop-loss discipline.`;
    summary = `The trade faced headwinds from prevailing negative news, requiring closer risk monitoring and diversified capital allocation.`;
  } else if (isProfitable) {
    lesson = `Taking timely profits and maintaining systematic trade management preserves long-term portfolio growth.`;
    summary = `Effective trade timing delivered positive outcomes (${returnPct >= 0 ? "+" : ""}${returnPct}%), supported by appropriate position sizing.`;
  } else {
    lesson = `Treat loss-making trades as learning data: analyze whether entry timing, news context, or sizing caused the divergence.`;
    summary = `The trade presented moderate risk exposure and highlights opportunities for tighter stop-loss management and news-aligned entry.`;
  }

  return {
    overallAssessment,
    riskLevel,
    whatWentWell,
    risks,
    whatCouldImprove,
    lesson,
    summary,
    newsContext: hasNews
      ? {
          headline: newsContext.headline || null,
          sentiment: newsContext.sentiment || "Neutral",
          direction: newsContext.direction || "Neutral",
          confidence: newsContext.confidence || 75,
          impact: newsContext.impact || "Medium",
          publishedAt: newsContext.publishedAt || new Date(),
        }
      : null,
    model: "tradesphere-coach-nlp",
  };
}

// ─── External LLM Calling (Ollama / OpenAI-compatible) ────────────────────────

async function callExternalLLM(prompt, systemInstruction = "You are a professional financial AI analyst. Always return strictly valid JSON.") {
  const provider = (process.env.AI_PROVIDER || "auto").toLowerCase();
  const baseURL = process.env.LLM_BASE_URL || "http://localhost:11434";
  const model = process.env.LLM_MODEL || "llama3";
  const apiKey = process.env.AI_API_KEY || "";

  // If provider is explicitly heuristic or none, skip remote call
  if (provider === "heuristic" || provider === "local_nlp") {
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

  try {
    // 1. Try Ollama Native Endpoint
    if (baseURL.includes(":11434") || provider === "ollama") {
      const ollamaRes = await fetch(`${baseURL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          prompt: `${systemInstruction}\n\n${prompt}`,
          format: "json",
          stream: false,
        }),
      });

      clearTimeout(timeoutId);
      if (ollamaRes.ok) {
        const json = await ollamaRes.json();
        if (json.response) {
          return JSON.parse(json.response);
        }
      }
    }

    // 2. Try Standard OpenAI / OpenRouter / Groq / vLLM /v1/chat/completions
    const headers = { "Content-Type": "application/json" };
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

    const chatRes = await fetch(`${baseURL}/v1/chat/completions`, {
      method: "POST",
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      }),
    });

    clearTimeout(timeoutId);
    if (chatRes.ok) {
      const data = await chatRes.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        return JSON.parse(content);
      }
    }
  } catch (err) {
    clearTimeout(timeoutId);
    // Silent fail over to heuristic engine
  }

  return null;
}

// ─── Sanitizers & Validators ──────────────────────────────────────────────────

function sanitizeNewsAnalysis(raw, fallbackNews) {
  if (!raw || typeof raw !== "object") {
    return analyzeNewsHeuristically(fallbackNews);
  }

  const sentiment = matchEnum(raw.sentiment, ALLOWED_SENTIMENT, "Neutral");
  const impact = matchEnum(raw.impact, ALLOWED_IMPACT, "Medium");
  const direction = matchEnum(raw.direction, ALLOWED_DIRECTION, "Neutral");
  const confidence = clampConfidence(raw.confidence, 78);
  const timeHorizon = matchEnum(raw.timeHorizon, ALLOWED_TIME_HORIZON, "Short Term");

  const summary =
    typeof raw.summary === "string" && raw.summary.trim().length > 10
      ? raw.summary.trim()
      : `AI-generated market insight based on available news for ${fallbackNews.symbol || "the market"}.`;

  const reasoning =
    typeof raw.reasoning === "string" && raw.reasoning.trim().length > 10
      ? raw.reasoning.trim()
      : "Underlying financial metrics and market context indicate balanced risk-adjusted impact.";

  const keyFactors =
    Array.isArray(raw.keyFactors) && raw.keyFactors.length > 0
      ? raw.keyFactors.map((k) => String(k).trim()).filter(Boolean).slice(0, 5)
      : ["Fundamental announcement", "Market sentiment", "Sector trends"];

  return {
    sentiment,
    impact,
    direction,
    confidence,
    timeHorizon,
    summary,
    reasoning,
    keyFactors,
    model: raw.model || process.env.LLM_MODEL || "ollama",
  };
}

function sanitizeTradeAnalysis(raw, fallbackTrade) {
  if (!raw || typeof raw !== "object") {
    return analyzeTradeHeuristically(fallbackTrade);
  }

  const overallAssessment = matchEnum(raw.overallAssessment, ALLOWED_ASSESSMENT, "Good");
  const riskLevel = matchEnum(raw.riskLevel, ALLOWED_RISK_LEVEL, "Medium");

  const whatWentWell =
    Array.isArray(raw.whatWentWell) && raw.whatWentWell.length > 0
      ? raw.whatWentWell.map((i) => String(i).trim()).filter(Boolean)
      : ["Order execution was completed as planned."];

  const risks =
    Array.isArray(raw.risks) && raw.risks.length > 0
      ? raw.risks.map((i) => String(i).trim()).filter(Boolean)
      : ["General market risk and instrument volatility."];

  const whatCouldImprove =
    Array.isArray(raw.whatCouldImprove) && raw.whatCouldImprove.length > 0
      ? raw.whatCouldImprove.map((i) => String(i).trim()).filter(Boolean)
      : ["Continue monitoring key support/resistance levels."];

  const lesson =
    typeof raw.lesson === "string" && raw.lesson.trim().length > 10
      ? raw.lesson.trim()
      : "Aligning trade timing with market catalysts improves probabilistic outcomes.";

  const summary =
    typeof raw.summary === "string" && raw.summary.trim().length > 10
      ? raw.summary.trim()
      : "Trade completed with standard parameters.";

  return {
    overallAssessment,
    riskLevel,
    whatWentWell,
    risks,
    whatCouldImprove,
    lesson,
    summary,
    newsContext: fallbackTrade.newsContext || null,
    model: raw.model || process.env.LLM_MODEL || "ollama",
  };
}

// ─── Public API Exports ───────────────────────────────────────────────────────

/**
 * Analyze financial news article and produce structured insight.
 * @param {Object} news - { title, description, source, symbol, companyName }
 * @returns {Promise<Object>} Structured news analysis
 */
async function analyzeFinancialNews(news) {
  const prompt = `Analyze this financial news article for stock investors and return ONLY a JSON object:

Title: "${news.title}"
Description: "${news.description || ""}"
Source: "${news.source || "News"}"
Associated Stock: ${news.symbol ? `${news.companyName || news.symbol} (${news.symbol})` : "General Financial Market"}

Return JSON format:
{
  "sentiment": "Positive" | "Neutral" | "Negative",
  "impact": "Low" | "Medium" | "High",
  "direction": "Bullish" | "Neutral" | "Bearish",
  "confidence": 0-100,
  "timeHorizon": "Short Term" | "Medium Term" | "Long Term",
  "summary": "1-2 sentence objective explanation of market impact (not financial advice)",
  "reasoning": "1-2 sentence rationale for the direction and confidence",
  "keyFactors": ["factor 1", "factor 2", "factor 3"]
}`;

  const rawLLMResult = await callExternalLLM(prompt);
  if (rawLLMResult) {
    return sanitizeNewsAnalysis(rawLLMResult, news);
  }

  // Graceful fallback to local heuristic engine
  return analyzeNewsHeuristically(news);
}

/**
 * Analyze an executed trade and produce structured post-trade educational review.
 * @param {Object} tradeData - { symbol, mode, qty, price, currentPrice, pnl, funds, newsContext }
 * @returns {Promise<Object>} Structured trade review
 */
async function analyzeTrade(tradeData) {
  const newsContextText = tradeData.newsContext
    ? `Recent News Sentiment: ${tradeData.newsContext.sentiment} / ${tradeData.newsContext.direction} (${tradeData.newsContext.confidence}% confidence)\nNews Headline: "${tradeData.newsContext.headline || "N/A"}"`
    : "No recent news analysis recorded around entry.";

  const prompt = `You are an AI Trade Coach analyzing a virtual stock trade.
Provide constructive, educational post-trade feedback to help the trader learn.
Do NOT give guaranteed investment advice.

Trade Information:
- Stock: ${tradeData.symbol}
- Action: ${tradeData.mode} ${tradeData.qty} shares @ ₹${Number(tradeData.price).toFixed(2)}
- Current / Exit Price: ₹${Number(tradeData.currentPrice || tradeData.price).toFixed(2)}
- P&L: ₹${Number(tradeData.pnl || 0).toFixed(2)}
- News Context at Trade Time:
  ${newsContextText}

Return strictly this JSON object:
{
  "overallAssessment": "Good" | "Average" | "Needs Improvement",
  "riskLevel": "Low" | "Medium" | "High",
  "whatWentWell": ["Positive aspect 1", "Positive aspect 2"],
  "risks": ["Identified risk or concentration factor"],
  "whatCouldImprove": ["Constructive tip for next time"],
  "lesson": "Single key takeaway lesson from this trade setup",
  "summary": "2 sentence summary of trade performance and decision quality"
}`;

  const rawLLMResult = await callExternalLLM(prompt);
  if (rawLLMResult) {
    return sanitizeTradeAnalysis(rawLLMResult, tradeData);
  }

  // Graceful fallback to local heuristic engine
  return analyzeTradeHeuristically(tradeData);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function capitalizeWords(str) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

module.exports = {
  analyzeFinancialNews,
  analyzeTrade,
  analyzeNewsHeuristically,
  analyzeTradeHeuristically,
};
