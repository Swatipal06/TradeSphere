const Parser = require("rss-parser");
const { NewsModel } = require("../model/NewsModel");
const { identifyStock } = require("../utils/stockIdentifier");

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "TradeSphere/1.0 (Financial News Reader)",
    Accept: "application/rss+xml, application/xml, text/xml; q=0.9, */*; q=0.8",
  },
});

// Configurable default RSS feeds (Indian financial markets)
const DEFAULT_FEEDS = [
  {
    name: "Economic Times Markets",
    url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
  },
  {
    name: "Economic Times Stocks",
    url: "https://economictimes.indiatimes.com/markets/stocks/rssfeeds/2146842.cms",
  },
  {
    name: "LiveMint Markets",
    url: "https://www.livemint.com/rss/markets",
  },
];

// Fallback seed articles if network is completely unreachable or offline
const FALLBACK_SEED_NEWS = [
  {
    title: "Reliance Industries announces major ₹75,000 crore renewable energy investment and gigafactory rollout",
    description: "Reliance Industries has unveiled plans to accelerate its green energy transition with new investments in solar photovoltaic giga-factories and hydrogen fuel cells, strengthening its long-term growth outlook.",
    source: "Economic Times",
    url: "https://economictimes.indiatimes.com/markets/stocks/news/reliance-renewable-investment-rollout/articleshow/99881122.cms",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hrs ago
    symbol: "RELIANCE",
    companyName: "Reliance Industries",
    category: "Energy & Conglomerate",
  },
  {
    title: "TCS bags $1.2 billion multi-year digital transformation and cloud deal from European banking titan",
    description: "Tata Consultancy Services (TCS) reported a landmark client engagement involving enterprise cloud migration and AI-led operational efficiency over a 7-year term.",
    source: "LiveMint",
    url: "https://www.livemint.com/market/stock-market-news/tcs-bags-european-banking-deal-2024/articleshow/88992211.cms",
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hrs ago
    symbol: "TCS",
    companyName: "Tata Consultancy Services",
    category: "Information Technology",
  },
  {
    title: "Infosys raises full-year constant currency revenue guidance following strong large deal ramp-ups",
    description: "Infosys delivered stellar Q3 operating metrics with operating margin resilience and a robust $3.2 billion total contract value, prompting an upward revision in annual revenue growth estimates.",
    source: "Economic Times",
    url: "https://economictimes.indiatimes.com/markets/stocks/news/infosys-raises-fy-revenue-guidance-q3/articleshow/77884433.cms",
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    symbol: "INFY",
    companyName: "Infosys",
    category: "Information Technology",
  },
  {
    title: "HDFC Bank net interest income rises 16% YoY as loan book expands across retail and commercial segments",
    description: "HDFC Bank sustained healthy asset quality and steady NIMs in the latest quarter, reporting strong deposit accretion and credit off-take despite tight liquidity conditions.",
    source: "Business Standard",
    url: "https://www.business-standard.com/markets/news/hdfc-bank-nii-rises-strong-credit-growth/124010100122.html",
    publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000),
    symbol: "HDFCBANK",
    companyName: "HDFC Bank",
    category: "Banking & Financial Services",
  },
  {
    title: "State Bank of India reports multi-decade low gross NPA of 2.1% with robust credit growth momentum",
    description: "State Bank of India (SBI) reported strong quarterly earnings driven by low credit costs, disciplined underwriting, and steady corporate loan demand.",
    source: "Moneycontrol",
    url: "https://www.moneycontrol.com/news/business/markets/sbin-q3-results-low-npa-record-profit-112233.html",
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    symbol: "SBIN",
    companyName: "State Bank of India",
    category: "Banking & Financial Services",
  },
  {
    title: "Bharti Airtel expands 5G footprint to 500+ cities; ARPU improves to industry-leading ₹211",
    description: "Bharti Airtel witnessed strong postpaid subscriber additions and robust data consumption growth across enterprise and consumer portfolios.",
    source: "Economic Times",
    url: "https://economictimes.indiatimes.com/industry/telecom/airtel-expands-5g-arpu-grows-strongly/articleshow/99887766.cms",
    publishedAt: new Date(Date.now() - 15 * 60 * 60 * 1000),
    symbol: "BHARTIARTL",
    companyName: "Bharti Airtel",
    category: "Telecommunications",
  },
  {
    title: "RBI keeps repo rate unchanged at 6.5%, maintains focused stance on disinflation while growth remains robust",
    description: "The Monetary Policy Committee voted to hold policy rates steady, citing solid GDP growth indicators while closely monitoring domestic food price dynamics.",
    source: "LiveMint",
    url: "https://www.livemint.com/economy/rbi-monetary-policy-repo-rate-unchanged-mpc-decision/12334455.html",
    publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
    symbol: "NIFTY",
    companyName: "Nifty 50 Index",
    category: "Benchmark Index",
  },
  {
    title: "Tata Power signs pact to deploy 10,000 EV charging points and 2.5 GW solar capacity",
    description: "Tata Power continues aggressive execution of clean energy transition with nationwide charging corridors and dedicated utility-scale solar installations.",
    source: "Business Standard",
    url: "https://www.business-standard.com/companies/news/tata-power-ev-chargers-expansion-solar/124020200233.html",
    publishedAt: new Date(Date.now() - 22 * 60 * 60 * 1000),
    symbol: "TATAPOWER",
    companyName: "Tata Power",
    category: "Power & Energy",
  },
];

/**
 * Clean HTML tags from RSS descriptions/titles
 */
function cleanText(raw = "") {
  if (!raw || typeof raw !== "string") return "";
  return raw
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Get configured feed URLs from environment or fallback to defaults
 */
function getConfiguredFeeds() {
  const envFeeds = process.env.RSS_FEEDS;
  if (envFeeds && typeof envFeeds === "string" && envFeeds.trim() !== "") {
    return envFeeds.split(",").map((url, idx) => ({
      name: `Feed #${idx + 1}`,
      url: url.trim(),
    }));
  }
  return DEFAULT_FEEDS;
}

/**
 * Fetch and parse news from RSS feeds and store unique articles in MongoDB.
 */
async function fetchAndStoreNews() {
  const feeds = getConfiguredFeeds();
  let totalProcessed = 0;
  let insertedCount = 0;
  let hasFeedSuccess = false;

  for (const feed of feeds) {
    try {
      const parsedFeed = await parser.parseURL(feed.url);
      hasFeedSuccess = true;
      const feedSource = parsedFeed.title ? cleanText(parsedFeed.title) : feed.name;

      for (const item of parsedFeed.items || []) {
        totalProcessed++;
        const title = cleanText(item.title);
        const description = cleanText(item.contentSnippet || item.content || item.summary || "");
        const url = (item.link || item.guid || "").trim();
        const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date();

        if (!title || !url) continue;

        // Associate stock symbol and company
        const stockIdentification = identifyStock(title, description);

        // Attempt upsert with unique URL
        const existing = await NewsModel.findOne({ url });
        if (!existing) {
          await NewsModel.create({
            title,
            description,
            source: feedSource,
            url,
            publishedAt,
            symbol: stockIdentification.symbol,
            companyName: stockIdentification.companyName,
            category: stockIdentification.category,
            hasAnalysis: false,
          });
          insertedCount++;
        }
      }
    } catch (feedErr) {
      console.warn(`[RSS Service] Feed "${feed.name}" (${feed.url}) unavailable:`, feedErr.message);
      // Non-blocking: continue to next feed
    }
  }

  // If database has 0 news articles and live feeds couldn't be loaded or were empty, seed fallback news
  const totalCount = await NewsModel.countDocuments();
  if (totalCount === 0) {
    console.log("[RSS Service] Seeding initial financial news repository...");
    for (const seed of FALLBACK_SEED_NEWS) {
      const exists = await NewsModel.findOne({ url: seed.url });
      if (!exists) {
        await NewsModel.create(seed);
        insertedCount++;
      }
    }
  }

  return {
    success: true,
    hasFeedSuccess,
    totalProcessed,
    insertedCount,
  };
}

module.exports = {
  fetchAndStoreNews,
  getConfiguredFeeds,
  DEFAULT_FEEDS,
};
