import React from "react";

const Apps = () => {
    const appsList = [
        {
            title: "TradeSphere Connect API",
            tag: "Developer & Algo",
            desc: "Build automated trading platforms, algorithmic execution bots, and custom portfolio tracking apps with simple REST/WebSocket APIs.",
            icon: "⚡",
            status: "Connected",
        },
        {
            title: "Sensibull",
            tag: "Options & Derivatives",
            desc: "India's largest options trading platform. Create custom option payoff strategies, analyze Greeks, and manage multi-leg positions.",
            icon: "📊",
            status: "Launch App",
        },
        {
            title: "Streak",
            tag: "Systematic Algo Trading",
            desc: "Create, backtest on historical ticks, and deploy trading strategies across equities and futures with zero coding required.",
            icon: "🎯",
            status: "Launch App",
        },
        {
            title: "Smallcase",
            tag: "Thematic Portfolios",
            desc: "Invest in diversified ideas and models built by SEBI-registered professionals — Clean Energy, Top 100 Tech, Dividends, and more.",
            icon: "💼",
            status: "Explore Baskets",
        },
        {
            title: "TradingView Terminal",
            tag: "Technical Analysis",
            desc: "Over 100+ technical indicators, candlestick pattern detection, multi-timeframe overlays, and live order execution from chart pins.",
            icon: "📈",
            status: "Integrated",
        },
        {
            title: "Sentinel",
            tag: "Cloud Triggers & Alerts",
            desc: "Set advanced conditional alerts on price, volume, and open interest. Receive instant push notifications across web and mobile.",
            icon: "🔔",
            status: "Active",
        },
    ];

    return (
        <div style={{ padding: "24px 32px" }}>
            <div style={{ marginBottom: "28px" }}>
                <h3 style={{ fontSize: "1.6rem", fontWeight: "700", color: "#1e293b", margin: "0 0 6px 0" }}>
                    TradeSphere Apps & Ecosystem 🚀
                </h3>
                <p style={{ color: "#64748b", margin: 0, fontSize: "0.95rem" }}>
                    Supercharge your trading setup with integrated tools and fintech partner platforms.
                </p>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: "20px",
                }}
            >
                {appsList.map((app, index) => (
                    <div
                        key={index}
                        style={{
                            background: "#ffffff",
                            borderRadius: "10px",
                            padding: "22px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            transition: "transform 0.15s ease, box-shadow 0.15s ease",
                        }}
                    >
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                                <div style={{ fontSize: "2rem" }}>{app.icon}</div>
                                <span
                                    style={{
                                        fontSize: "0.75rem",
                                        fontWeight: "600",
                                        padding: "3px 8px",
                                        borderRadius: "4px",
                                        background: "#f1f5f9",
                                        color: "#475569",
                                    }}
                                >
                                    {app.tag}
                                </span>
                            </div>
                            <h4 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#0f172a", margin: "0 0 8px 0" }}>
                                {app.title}
                            </h4>
                            <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: "1.6", margin: 0 }}>
                                {app.desc}
                            </p>
                        </div>

                        <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end" }}>
                            <button
                                style={{
                                    padding: "6px 14px",
                                    fontSize: "0.85rem",
                                    fontWeight: "600",
                                    color: "#2563eb",
                                    background: "#eff6ff",
                                    border: "1px solid #bfdbfe",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                                onClick={() => alert(`${app.title} is fully integrated with your TradeSphere virtual account!`)}
                            >
                                {app.status} →
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Apps;