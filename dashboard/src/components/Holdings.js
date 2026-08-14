import React, { useState, useEffect, useContext } from "react";
import api from "../utils/api";
import { VerticalGraph } from "./VerticalGraph";
import GeneralContext from "./GeneralContext";

const Holdings = () => {
    const [allHoldings, setAllHoldings] = useState([]);
    const [loading, setLoading] = useState(true);
    const generalContext = useContext(GeneralContext);

    const fetchHoldings = () => {
        setLoading(true);
        api
            .get("/allHoldings")
            .then((res) => {
                setAllHoldings(res.data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch holdings:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchHoldings();
    }, [generalContext?.refreshCounter]);

    // Dynamic Calculations
    let totalInvestment = 0;
    let currentValue = 0;

    allHoldings.forEach((stock) => {
        const qty = Number(stock.qty) || 0;
        const avg = Number(stock.avg) || 0;
        const price = Number(stock.price) || 0;

        totalInvestment += avg * qty;
        currentValue += price * qty;
    });

    const totalPnL = currentValue - totalInvestment;
    const pnlPercentage = totalInvestment > 0 ? ((totalPnL / totalInvestment) * 100).toFixed(2) : "0.00";
    const isOverallProfit = totalPnL >= 0;

    const labels = allHoldings.map((subArray) => subArray.name);

    const data = {
        labels,
        datasets: [
            {
                label: "Current Stock Price (₹)",
                data: allHoldings.map((stock) => stock.price),
                backgroundColor: "rgba(37, 99, 235, 0.65)",
                borderColor: "rgba(37, 99, 235, 1)",
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    return (
        <div style={{ padding: "20px 30px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 className="title" style={{ margin: 0 }}>
                    Holdings ({allHoldings.length})
                </h3>
                <button
                    onClick={fetchHoldings}
                    style={{
                        padding: "6px 14px",
                        background: "#f1f5f9",
                        border: "1px solid #cbd5e1",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        color: "#475569",
                    }}
                >
                    🔄 Refresh
                </button>
            </div>

            {loading ? (
                <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                    Loading holdings...
                </div>
            ) : (
                <>
                    <div className="order-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Instrument</th>
                                    <th>Qty.</th>
                                    <th>Avg. cost (₹)</th>
                                    <th>LTP (₹)</th>
                                    <th>Cur. val (₹)</th>
                                    <th>P&L (₹)</th>
                                    <th>Net chg.</th>
                                    <th>Day chg.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allHoldings.map((stock, index) => {
                                    const qty = Number(stock.qty) || 0;
                                    const avg = Number(stock.avg) || 0;
                                    const price = Number(stock.price) || 0;
                                    const stockCurVal = price * qty;
                                    const stockPnL = stockCurVal - (avg * qty);
                                    const isProfit = stockPnL >= 0.0;
                                    const profClass = isProfit ? "profit" : "loss";
                                    const dayClass = stock.isLoss ? "loss" : "profit";

                                    return (
                                        <tr key={index}>
                                            <td style={{ fontWeight: 600 }}>{stock.name}</td>
                                            <td>{stock.qty}</td>
                                            <td>{avg.toFixed(2)}</td>
                                            <td>{price.toFixed(2)}</td>
                                            <td>{stockCurVal.toFixed(2)}</td>
                                            <td className={profClass} style={{ fontWeight: 600 }}>
                                                {isProfit ? `+${stockPnL.toFixed(2)}` : stockPnL.toFixed(2)}
                                            </td>
                                            <td className={profClass}>{stock.net || "+0.00%"}</td>
                                            <td className={dayClass}>{stock.day || "+0.00%"}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Row */}
                    <div className="row" style={{ marginTop: "24px", marginBottom: "24px" }}>
                        <div className="col">
                            <h5>
                                ₹{totalInvestment.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h5>
                            <p>Total investment</p>
                        </div>
                        <div className="col">
                            <h5>
                                ₹{currentValue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h5>
                            <p>Current value</p>
                        </div>
                        <div className="col">
                            <h5 style={{ color: isOverallProfit ? "#16a34a" : "#dc2626" }}>
                                {isOverallProfit ? "+" : ""}
                                ₹{totalPnL.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                {" "}
                                ({isOverallProfit ? "+" : ""}{pnlPercentage}%)
                            </h5>
                            <p>Total P&L</p>
                        </div>
                    </div>

                    <div style={{ marginTop: "30px", background: "#fff", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                        <VerticalGraph data={data} />
                    </div>
                </>
            )}
        </div>
    );
};

export default Holdings;