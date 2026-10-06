import React, { useState } from "react";
import AIInsightBadge from "./AIInsightBadge";
import api from "../utils/api";

export const NewsCard = ({ article, onAnalysisGenerated }) => {
  const [analysis, setAnalysis] = useState(article.analysis || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(`/api/news/${article._id}/analyze`);
      if (res.data?.analysis) {
        setAnalysis(res.data.analysis);
        if (onAnalysisGenerated) {
          onAnalysisGenerated(article._id, res.data.analysis);
        }
      }
    } catch (err) {
      console.error("Failed to analyze news:", err);
      setError("Unable to generate AI analysis right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "Recent";
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffHours < 1) return "Just now";
    if (diffHours === 1) return "1 hour ago";
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  return (
    <div className="news-card">
      {/* Meta Bar */}
      <div className="news-card-meta">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {article.symbol ? (
            <span className="badge-symbol">{article.symbol}</span>
          ) : (
            <span className="badge-general">General Market</span>
          )}
          <span style={{ fontWeight: 600, color: "#334155" }}>{article.source}</span>
        </div>
        <span>{formatTimeAgo(article.publishedAt)}</span>
      </div>

      {/* Title */}
      <h4 className="news-card-title">
        <a href={article.url} target="_blank" rel="noopener noreferrer">
          {article.title}
        </a>
      </h4>

      {/* Description */}
      {article.description && <p className="news-card-desc">{article.description}</p>}

      {/* AI Market Insight Box */}
      {analysis ? (
        <div className="ai-insight-box">
          <div className="ai-insight-header">
            <span className="ai-insight-title">AI Market Insight</span>
            <AIInsightBadge
              direction={analysis.direction}
              confidence={analysis.confidence}
            />
          </div>

          <div className="ai-insight-metrics">
            <span>
              Impact: <strong>{analysis.impact || "Medium"}</strong>
            </span>
            <span></span>
            <span>
              Time Horizon: <strong>{analysis.timeHorizon || "Short Term"}</strong>
            </span>
          </div>

          <div className="ai-insight-reasoning">
            <p style={{ margin: "0 0 6px 0", fontWeight: 600, color: "#1e293b", fontSize: "0.82rem" }}>
              Why?
            </p>
            <p style={{ margin: 0 }}>{analysis.reasoning || analysis.summary}</p>
          </div>

          {analysis.keyFactors && analysis.keyFactors.length > 0 && (
            <div style={{ marginTop: "10px" }}>
              <p style={{ margin: "0 0 6px 0", fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>
                Key Factors:
              </p>
              <ul className="ai-factors-list">
                {analysis.keyFactors.map((factor, idx) => (
                  <li key={idx} className="ai-factor-pill">
                     {factor}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px", flexWrap: "wrap", gap: "8px" }}>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "0.82rem", color: "#2563eb", textDecoration: "none", fontWeight: 500 }}
          >
            Read Source Article 
          </a>
          <button
            className="ai-btn-secondary"
            onClick={handleAnalyze}
            disabled={loading}
            style={{ fontSize: "0.8rem", padding: "5px 12px" }}
          >
            {loading ? "Analyzing News..." : " Generate AI Insight"}
          </button>
        </div>
      )}

      {error && (
        <p style={{ color: "#dc2626", fontSize: "0.8rem", margin: "8px 0 0 0" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default NewsCard;
