/**
 * Stock & Company Identification Utility
 * Maps news text to TradeSphere tradeable stock symbols and companies.
 * Modular design allows expanding tickers and synonyms anytime.
 */

const KNOWN_STOCKS = [
  {
    symbol: "RELIANCE",
    companyName: "Reliance Industries",
    keywords: ["reliance", "ril", "mukesh ambani", "jio", "reliance retail", "reliance industries"],
    sector: "Energy & Conglomerate",
  },
  {
    symbol: "TCS",
    companyName: "Tata Consultancy Services",
    keywords: ["tcs", "tata consultancy", "tata consultancy services", "k krithivasan"],
    sector: "Information Technology",
  },
  {
    symbol: "INFY",
    companyName: "Infosys",
    keywords: ["infosys", "infy", "salil parekh", "narayana murthy"],
    sector: "Information Technology",
  },
  {
    symbol: "HDFCBANK",
    companyName: "HDFC Bank",
    keywords: ["hdfc bank", "hdfc", "sashidhar jagdishan"],
    sector: "Banking & Financial Services",
  },
  {
    symbol: "SBIN",
    companyName: "State Bank of India",
    keywords: ["sbin", "state bank of india", "sbi bank", "sbi"],
    sector: "Banking & Financial Services",
  },
  {
    symbol: "BHARTIARTL",
    companyName: "Bharti Airtel",
    keywords: ["bharti airtel", "airtel", "sunil mittal", "bharti group"],
    sector: "Telecommunications",
  },
  {
    symbol: "WIPRO",
    companyName: "Wipro Limited",
    keywords: ["wipro", "rishad premji", "azim premji"],
    sector: "Information Technology",
  },
  {
    symbol: "ITC",
    companyName: "ITC Limited",
    keywords: ["itc ltd", "itc limited", "\\bitc\\b", "sanjiv puri"],
    sector: "FMCG & Diversified",
  },
  {
    symbol: "M&M",
    companyName: "Mahindra & Mahindra",
    keywords: ["mahindra & mahindra", "mahindra and mahindra", "m&m", "anand mahindra"],
    sector: "Automobile",
  },
  {
    symbol: "TATAPOWER",
    companyName: "Tata Power",
    keywords: ["tata power", "tata power renewable"],
    sector: "Power & Energy",
  },
  {
    symbol: "HINDUNILVR",
    companyName: "Hindustan Unilever",
    keywords: ["hindustan unilever", "unilever", "hul", "rohit jawa"],
    sector: "FMCG",
  },
  {
    symbol: "KPITTECH",
    companyName: "KPIT Technologies",
    keywords: ["kpit", "kpit technologies", "kpit tech"],
    sector: "IT & Auto Software",
  },
  {
    symbol: "ONGC",
    companyName: "Oil and Natural Gas Corporation",
    keywords: ["ongc", "oil and natural gas corporation", "oil and natural gas"],
    sector: "Oil & Gas Exploration",
  },
  {
    symbol: "EVEREADY",
    companyName: "Eveready Industries",
    keywords: ["eveready", "eveready industries"],
    sector: "Consumer Goods",
  },
  {
    symbol: "JUBLFOOD",
    companyName: "Jubilant FoodWorks",
    keywords: ["jubilant foodworks", "jubilant food", "domino's india", "jublfood"],
    sector: "Quick Service Restaurants",
  },
  {
    symbol: "QUICKHEAL",
    companyName: "Quick Heal Technologies",
    keywords: ["quick heal", "quickheal"],
    sector: "Cybersecurity & IT",
  },
  {
    symbol: "TATAMOTORS",
    companyName: "Tata Motors",
    keywords: ["tata motors", "jaguar land rover", "jlr"],
    sector: "Automobile",
  },
  {
    symbol: "ICICIBANK",
    companyName: "ICICI Bank",
    keywords: ["icici bank", "icici", "sandeep bakhshi"],
    sector: "Banking & Financial Services",
  },
  {
    symbol: "NIFTY",
    companyName: "Nifty 50 Index",
    keywords: ["nifty 50", "nifty", "nse nifty"],
    sector: "Benchmark Index",
  },
  {
    symbol: "SENSEX",
    companyName: "BSE Sensex",
    keywords: ["bse sensex", "sensex"],
    sector: "Benchmark Index",
  },
];

/**
 * Identify stock and company name from title and description.
 * Returns { symbol, companyName, category, sector } or null/general.
 */
function identifyStock(title = "", description = "") {
  const combined = `${title} ${description}`.toLowerCase();
  const titleLower = title.toLowerCase();

  let bestMatch = null;
  let highestScore = 0;

  for (const stock of KNOWN_STOCKS) {
    let score = 0;

    for (const kw of stock.keywords) {
      const isRegex = kw.includes("\\b");
      let matchedInTitle = false;
      let matchedInDesc = false;

      if (isRegex) {
        const re = new RegExp(kw, "i");
        matchedInTitle = re.test(title);
        matchedInDesc = re.test(description);
      } else {
        matchedInTitle = titleLower.includes(kw);
        matchedInDesc = combined.includes(kw);
      }

      if (matchedInTitle) {
        // Direct title match has heavy weight
        score += 10;
      } else if (matchedInDesc) {
        score += 3;
      }
    }

    if (score > highestScore && score >= 3) {
      highestScore = score;
      bestMatch = stock;
    }
  }

  if (bestMatch) {
    return {
      symbol: bestMatch.symbol,
      companyName: bestMatch.companyName,
      category: bestMatch.sector || "Equity",
    };
  }

  // General macro/financial news
  return {
    symbol: null,
    companyName: null,
    category: "Macro / Financial Market",
  };
}

module.exports = {
  identifyStock,
  KNOWN_STOCKS,
};
