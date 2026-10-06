import React, { useState, useEffect } from "react";
import api from "../utils/api";
import AIInsightBadge from "./AIInsightBadge";

export const StockNewsModal = ({ symbol, price, isOpen, onClose }) => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyzingId, setAnalyzingId] = useState(null);

  useEffect(() => {
    if (isOpen && symbol) {
      setLoading(true);
      api
        .get(`/api/news/${symbol}`)
        .then((res) => {
          setNewsList(res.data || []);
        })
        .catch((err) => {
          console.error("Stock news modal fetch error:", err);
          setNewsList([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, symbol]);

  if (!isOpen) return null;

  const handleAnalyzeArticle = async (newsId) => {
    setAnalyzingId(newsId);
    try {
      const res = await api.post(`/api/news/${newsId}/analyze`);
      if (res.data?.analysis) {
        setNewsList((prev) =>
          prev.map((item) => (item._id === newsId ? { ...item, analysis: res.data.analysis } : item))
        );
      }
    } catch (err) {
      console.error("Failed to analyze stock news item:", err);
    } finally {
      setAnalyzingId(null);
    }
  };

  // Find dominant sentiment from analyzed news
  const analyzedItems = newsList.filter((n) => n.analysis);
  const latestAnalysis = analyzedItems.length > 0 ? analyzedItems[0].analysis : null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.5)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "10px",
          width: "100%",
          maxWidth: "600px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "18px 22px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#f8fafc",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700", color: "#0f172a" }}>
                {symbol}
              </h3>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "#2563eb",
                  background: "#eff6ff",
                  padding: "2px 8px",
                  borderRadius: "4px",
                }}
              >
                ₹{Number(price || 0).toFixed(2)}
              </span>
            </div>
            <p style={{ margin: "3px 0 0 0", fontSize: "0.8rem", color: "#64748b" }}>
              AI Financial News Intelligence & Catalyst Overview
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "1.5rem",
              color: "#94a3b8",
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "20px 22px", overflowY: "auto", flex: 1 }}>
          {/* Top Sentiment Banner */}
          {latestAnalysis ? (
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "14px 16px",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>
                  AI MARKET INTELLIGENCE
                </div>
                <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#1e293b", marginTop: "2px" }}>
                  {latestAnalysis.summary}
                </div>
              </div>
              <AIInsightBadge
                direction={latestAnalysis.direction}
                confidence={latestAnalysis.confidence}
              />
            </div>
          ) : (
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "12px 14px",
                marginBottom: "18px",
                fontSize: "0.82rem",
                color: "#64748b",
              }}
            >
              Analyze recent news below to derive unified AI market sentiment for {symbol}.
            </div>
          )}

          {/* Recent News List */}
          <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "#1e293b", margin: "0 0 12px 0" }}>
            Recent Relevant News ({newsList.length})
          </h4>

          {loading ? (
            <div style={{ textAlign: "center", padding: "30px", color: "#64748b", fontSize: "0.88rem" }}>
              Loading news for {symbol}...
            </div>
          ) : newsList.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {newsList.map((item) => (
                <div
                  key={item._id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    padding: "14px",
                    background: "#ffffff",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "#0f172a", lineHeight: 1.4 }}>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                        {item.title}
                      </a>
                    </div>
                    {item.analysis && (
                      <AIInsightBadge
                        size="small"
                        direction={item.analysis.direction}
                        confidence={item.analysis.confidence}
                      />
                    )}
                  </div>

                  <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "4px" }}>
                    {item.source}  {new Date(item.publishedAt).toLocaleDateString()}
                  </div>

                  {item.analysis ? (
                    <div
                      style={{
                        marginTop: "10px",
                        padding: "8px 12px",
                        background: "#f8fafc",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        color: "#334155",
                      }}
                    >
                      <strong style={{ color: "#2563eb" }}>AI Insight:</strong> {item.analysis.reasoning || item.analysis.summary}
                    </div>
                  ) : (
                    <div style={{ marginTop: "8px", textAlign: "right" }}>
                      <button
                        onClick={() => handleAnalyzeArticle(item._id)}
                        disabled={analyzingId === item._id}
                        style={{
                          padding: "4px 10px",
                          fontSize: "0.75rem",
                          background: "#eff6ff",
                          color: "#2563eb",
                          border: "1px solid #bfdbfe",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        {analyzingId === item._id ? "Analyzing..." : " Analyze"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "30px", color: "#94a3b8", fontSize: "0.85rem" }}>
              No recent news articles specifically tagged for {symbol}.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: "12px 22px",
            borderTop: "1px solid #f1f5f9",
            textAlign: "right",
            background: "#f8fafc",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "6px 16px",
              background: "#e2e8f0",
              color: "#334155",
              border: "none",
              borderRadius: "4px",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockNewsModal;
