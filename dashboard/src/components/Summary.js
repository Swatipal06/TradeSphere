import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const Summary = () => {
    const [holdings, setHoldings] = useState([]);
    const [funds, setFunds] = useState({ availableMargin: 104043.1, usedMargin: 3757.3 });
    const generalContext = useContext(GeneralContext);

    useEffect(() => {
        axios
            .get("http://localhost:3002/allHoldings")
            .then((res) => {
                setHoldings(res.data || []);
            })
            .catch(() => {});

        axios
            .get("http://localhost:3002/funds")
            .then((res) => {
                if (res.data) setFunds(res.data);
            })
            .catch(() => {});
    }, [generalContext?.refreshCounter]);

    let totalInvestment = 0;
    let currentValue = 0;

    holdings.forEach((stock) => {
        const qty = Number(stock.qty) || 0;
        const avg = Number(stock.avg) || 0;
        const price = Number(stock.price) || 0;
        totalInvestment += avg * qty;
        currentValue += price * qty;
    });

    const totalPnL = currentValue - totalInvestment;
    const pnlPercentage = totalInvestment > 0 ? ((totalPnL / totalInvestment) * 100).toFixed(2) : "0.00";
    const isProfit = totalPnL >= 0;

    const formatCurrency = (val) => {
        if (Math.abs(val) >= 100000) {
            return (val / 100000).toFixed(2) + "L";
        } else if (Math.abs(val) >= 1000) {
            return (val / 1000).toFixed(2) + "k";
        }
        return val.toFixed(2);
    };

    return (
        <div style={{ padding: "20px 30px" }}>
            <div className="username" style={{ marginBottom: "24px" }}>
                <h4 style={{ fontWeight: "700", color: "#1e293b" }}>Hi, Trader! 👋</h4>
                <p style={{ color: "#64748b", margin: 0, fontSize: "0.9rem" }}>
                    Welcome to your TradeSphere Paper Trading Terminal
                </p>
                <hr className="divider" style={{ marginTop: "16px" }} />
            </div>

            {/* Equity & Margin Section */}
            <div className="section" style={{ marginBottom: "30px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "1.05rem", fontWeight: "600", color: "#0f172a" }}>Equity & Margins</span>
                </div>

                <div className="data" style={{ display: "flex", alignItems: "center", gap: "40px" }}>
                    <div className="first">
                        <h3 style={{ fontSize: "2rem", fontWeight: "700", color: "#2563eb", margin: 0 }}>
                            ₹{formatCurrency(funds.availableMargin)}
                        </h3>
                        <p style={{ color: "#64748b", margin: "4px 0 0 0", fontSize: "0.85rem" }}>Margin available</p>
                    </div>
                    <div style={{ width: "1px", height: "60px", background: "#e2e8f0" }}></div>

                    <div className="second" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
                            Margins used: <strong style={{ color: "#0f172a" }}>₹{formatCurrency(funds.usedMargin)}</strong>
                        </p>
                        <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
                            Opening balance: <strong style={{ color: "#0f172a" }}>₹{formatCurrency(funds.availableMargin + funds.usedMargin)}</strong>
                        </p>
                    </div>
                </div>
                <hr className="divider" style={{ marginTop: "24px" }} />
            </div>

            {/* Holdings & P&L Section */}
            <div className="section">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "1.05rem", fontWeight: "600", color: "#0f172a" }}>
                        Holdings ({holdings.length})
                    </span>
                </div>

                <div className="data" style={{ display: "flex", alignItems: "center", gap: "40px" }}>
                    <div className="first">
                        <h3 style={{ fontSize: "2rem", fontWeight: "700", color: isProfit ? "#16a34a" : "#dc2626", margin: 0 }}>
                            {isProfit ? "+" : ""}₹{formatCurrency(totalPnL)}{" "}
                            <small style={{ fontSize: "1rem", fontWeight: "600" }}>
                                ({isProfit ? "+" : ""}{pnlPercentage}%)
                            </small>
                        </h3>
                        <p style={{ color: "#64748b", margin: "4px 0 0 0", fontSize: "0.85rem" }}>Total Profit & Loss</p>
                    </div>
                    <div style={{ width: "1px", height: "60px", background: "#e2e8f0" }}></div>

                    <div className="second" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
                            Current Value: <strong style={{ color: "#0f172a" }}>₹{currentValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong>
                        </p>
                        <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
                            Total Investment: <strong style={{ color: "#0f172a" }}>₹{totalInvestment.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong>
                        </p>
                    </div>
                </div>
                <hr className="divider" style={{ marginTop: "24px" }} />
            </div>
        </div>
    );
};

export default Summary;