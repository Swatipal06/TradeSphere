import React, { useState, useEffect } from "react";
import api from "../utils/api";
import "./AiFeatures.css";

const TradeCoach = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [filterMode, setFilterMode] = useState("ALL"); // ALL, PROFIT, LOSS, BUY, SELL
  const [error, setError] = useState(null);

  const fetchTrades = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/coach/trades");
      setTrades(res.data || []);
    } catch (err) {
      console.error("Failed to fetch coach trades:", err);
      setError("Unable to load trade history for AI Coach. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const handleAnalyzeTrade = async (orderId) => {
    setAnalyzingId(orderId);
    try {
      const res = await api.post(`/api/coach/analyze/${orderId}`);
      if (res.data?.analysis) {
        setTrades((prev) =>
          prev.map((t) => (t._id === orderId ? { ...t, analysis: res.data.analysis } : t))
        );
      }
    } catch (err) {
      console.error("Failed to analyze trade:", err);
      alert("Unable to analyze trade right now. Please try again later.");
    } finally {
      setAnalyzingId(null);
    }
  };

  // Filter trades
  const filteredTrades = trades.filter((trade) => {
    const isBuy = (trade.mode || "BUY").toUpperCase() === "BUY";
    const pnl = Number(trade.pnl) || 0;

    if (filterMode === "PROFIT") return pnl > 0;
    if (filterMode === "LOSS") return pnl < 0;
    if (filterMode === "BUY") return isBuy;
    if (filterMode === "SELL") return !isBuy;
    return true;
  });

  const getAssessmentBadge = (assessment) => {
    const val = (assessment || "").toUpperCase();
    if (val === "GOOD") {
      return (
        <span className="badge-bullish" style={{ fontSize: "0.82rem", padding: "4px 10px" }}>
          🟢 Good Trade
        </span>
      );
    }
    if (val === "AVERAGE") {
      return (
        <span className="badge-neutral" style={{ fontSize: "0.82rem", padding: "4px 10px" }}>
          🟡 Average Trade
        </span>
      );
    }
    return (
      <span className="badge-bearish" style={{ fontSize: "0.82rem", padding: "4px 10px" }}>
        🔴 Needs Improvement
      </span>
    );
  };

  return (
    <div style={{ padding: "24px 30px" }}>
      {/* Header */}
      <div className="ai-header-container">
        <div>
          <h3 className="ai-page-title">
            <span>🧠 AI Trade Coach</span>
          </h3>
          <p className="ai-page-subtitle">
            Understand why your trades worked or failed — learn discipline, risk exposure, and news catalyst alignment.
          </p>
        </div>

        <button className="ai-btn-secondary" onClick={fetchTrades}>
          🔄 Refresh Trades
        </button>
      </div>

      {/* Safety Disclaimer */}
      <div className="ai-disclaimer-banner">
        <span>🎓</span>
        <div>
          <strong>Educational Coach Notice:</strong> AI Trade Coach reviews executed trades to highlight risk management and sizing lessons. It is designed for post-trade educational self-reflection.
        </div>
      </div>

      {/* Filter Row */}
      <div className="filter-pills-row">
        <button
          className={`filter-pill ${filterMode === "ALL" ? "active" : ""}`}
          onClick={() => setFilterMode("ALL")}
        >
          All Trades ({trades.length})
        </button>
        <button
          className={`filter-pill ${filterMode === "PROFIT" ? "active" : ""}`}
          onClick={() => setFilterMode("PROFIT")}
        >
          Profitable
        </button>
        <button
          className={`filter-pill ${filterMode === "LOSS" ? "active" : ""}`}
          onClick={() => setFilterMode("LOSS")}
        >
          Loss-Making
        </button>
        <button
          className={`filter-pill ${filterMode === "BUY" ? "active" : ""}`}
          onClick={() => setFilterMode("BUY")}
        >
          BUY Orders
        </button>
        <button
          className={`filter-pill ${filterMode === "SELL" ? "active" : ""}`}
          onClick={() => setFilterMode("SELL")}
        >
          SELL Orders
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="state-container">
          <div className="state-icon">🤖</div>
          <div className="state-title">Loading Trade History...</div>
          <p className="state-desc">Retrieving your executed virtual trades and coaching reviews.</p>
        </div>
      ) : error ? (
        <div className="state-container">
          <div className="state-icon">⚠️</div>
          <div className="state-title">Error Loading Trades</div>
          <p className="state-desc">{error}</p>
          <button className="ai-btn-primary" onClick={fetchTrades}>
            Try Again
          </button>
        </div>
      ) : filteredTrades.length > 0 ? (
        <div>
          {filteredTrades.map((trade) => {
            const isBuy = (trade.mode || "BUY").toUpperCase() === "BUY";
            const pnl = Number(trade.pnl) || 0;
            const isProfit = pnl >= 0;
            const returnPct = Number(trade.returnPct) || 0;
            const formattedTime = trade.createdAt
              ? new Date(trade.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "Recent";

            const analysis = trade.analysis;

            return (
              <div key={trade._id} className="coach-trade-card">
                {/* Header */}
                <div className="coach-trade-header">
                  <div className="coach-stock-info">
                    <span className="badge-symbol" style={{ fontSize: "0.85rem", padding: "4px 8px" }}>
                      {trade.name}
                    </span>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        backgroundColor: isBuy ? "#dbeafe" : "#ffedd5",
                        color: isBuy ? "#1d4ed8" : "#c2410c",
                      }}
                    >
                      {trade.mode || "BUY"} • {trade.qty} shares
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                      Executed: {formattedTime}
                    </span>
                  </div>

                  <div className="coach-trade-stats">
                    <div className="coach-trade-stat-item">
                      <span className="coach-stat-label">Entry Price</span>
                      <span className="coach-stat-value">₹{Number(trade.price).toFixed(2)}</span>
                    </div>

                    <div className="coach-trade-stat-item">
                      <span className="coach-stat-label">LTP / Current</span>
                      <span className="coach-stat-value">₹{Number(trade.currentPrice).toFixed(2)}</span>
                    </div>

                    <div className="coach-trade-stat-item">
                      <span className="coach-stat-label">Return</span>
                      <span
                        className="coach-stat-value"
                        style={{ color: isProfit ? "#16a34a" : "#dc2626" }}
                      >
                        {isProfit ? "+" : ""}
                        {returnPct.toFixed(2)}% (₹{pnl.toFixed(2)})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Analysis Section */}
                {analysis ? (
                  <div className="coach-review-box">
                    <div className="coach-assessment-row">
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#475569" }}>
                          AI COACH REVIEW
                        </span>
                        {getAssessmentBadge(analysis.overallAssessment)}
                      </div>

                      <div style={{ fontSize: "0.82rem", color: "#64748b" }}>
                        Risk Exposure: <strong>{analysis.riskLevel}</strong>
                      </div>
                    </div>

                    {/* Connected RSS News Context (Part 3) */}
                    {analysis.newsContext && analysis.newsContext.headline && (
                      <div className="news-context-banner">
                        <span>📰</span>
                        <div>
                          <strong>Market News Context at Entry:</strong>{" "}
                          <span
                            style={{
                              fontWeight: 600,
                              color:
                                analysis.newsContext.direction === "Bullish"
                                  ? "#166534"
                                  : analysis.newsContext.direction === "Bearish"
                                  ? "#991b1b"
                                  : "#92400e",
                            }}
                          >
                            {analysis.newsContext.direction} ({analysis.newsContext.confidence}% confidence)
                          </span>{" "}
                          — "{analysis.newsContext.headline}"
                        </div>
                      </div>
                    )}

                    {/* Summary */}
                    <p style={{ fontSize: "0.88rem", color: "#334155", margin: "0 0 14px 0", lineHeight: 1.45 }}>
                      {analysis.summary}
                    </p>

                    {/* 3 Feedback Columns */}
                    <div className="coach-grid-feedback">
                      {/* What Went Well */}
                      <div className="coach-feedback-col success">
                        <h5>✓ What Went Well</h5>
                        <ul className="coach-feedback-list">
                          {analysis.whatWentWell &&
                            analysis.whatWentWell.map((pt, i) => <li key={i}>{pt}</li>)}
                        </ul>
                      </div>

                      {/* Potential Risks */}
                      <div className="coach-feedback-col warning">
                        <h5>⚠️ Potential Risks</h5>
                        <ul className="coach-feedback-list">
                          {analysis.risks && analysis.risks.map((pt, i) => <li key={i}>{pt}</li>)}
                        </ul>
                      </div>

                      {/* What Could Improve */}
                      <div className="coach-feedback-col improve">
                        <h5>💡 What Could Improve</h5>
                        <ul className="coach-feedback-list">
                          {analysis.whatCouldImprove &&
                            analysis.whatCouldImprove.map((pt, i) => <li key={i}>{pt}</li>)}
                        </ul>
                      </div>
                    </div>

                    {/* Key Lesson Box */}
                    {analysis.lesson && (
                      <div className="coach-lesson-box">
                        <div className="coach-lesson-title">KEY LESSON</div>
                        <p className="coach-lesson-text">"{analysis.lesson}"</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                    <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
                      This trade hasn't been reviewed by the AI Coach yet.
                    </span>
                    <button
                      className="ai-btn-primary"
                      onClick={() => handleAnalyzeTrade(trade._id)}
                      disabled={analyzingId === trade._id}
                      style={{ fontSize: "0.82rem", padding: "6px 14px" }}
                    >
                      {analyzingId === trade._id ? "Analyzing Trade Decisions..." : "🧠 Analyze Trade with Coach"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="state-container">
          <div className="state-icon">📋</div>
          <div className="state-title">No Orders Found</div>
          <p className="state-desc">
            {filterMode !== "ALL"
              ? "No trades matched your active filter criteria."
              : "You haven't executed any virtual trades in TradeSphere yet. Buy or sell shares from the watchlist to generate trade coaching reviews."}
          </p>
        </div>
      )}
    </div>
  );
};

export default TradeCoach;
