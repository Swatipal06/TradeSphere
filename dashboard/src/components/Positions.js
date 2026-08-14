import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const Positions = () => {
    const [allPositions, setAllPositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const generalContext = useContext(GeneralContext);

    const fetchPositions = () => {
        setLoading(true);
        axios
            .get("http://localhost:3002/allPositions")
            .then((res) => {
                setAllPositions(res.data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch positions:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchPositions();
    }, []);

    let totalPnL = 0;
    allPositions.forEach((pos) => {
        const qty = Number(pos.qty) || 0;
        const avg = Number(pos.avg) || 0;
        const price = Number(pos.price) || 0;
        totalPnL += (price * qty) - (avg * qty);
    });

    const isTotalProfit = totalPnL >= 0;

    return (
        <div style={{ padding: "20px 30px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 className="title" style={{ margin: 0 }}>
                    Positions ({allPositions.length})
                </h3>
                <span style={{ fontSize: "0.95rem", fontWeight: "600", color: isTotalProfit ? "#16a34a" : "#dc2626" }}>
                    Total P&L: {isTotalProfit ? "+" : ""}₹{totalPnL.toFixed(2)}
                </span>
            </div>

            {loading ? (
                <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                    Loading open positions...
                </div>
            ) : (
                <div className="order-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Instrument</th>
                                <th>Qty.</th>
                                <th>Avg. (₹)</th>
                                <th>LTP (₹)</th>
                                <th>P&L (₹)</th>
                                <th>Chg.</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allPositions.map((stock, index) => {
                                const curValue = stock.price * stock.qty;
                                const pnl = curValue - stock.avg * stock.qty;
                                const isProfit = pnl >= 0.0;
                                const profClass = isProfit ? "profit" : "loss";
                                const dayClass = stock.isLoss ? "loss" : "profit";

                                return (
                                    <tr key={index}>
                                        <td>
                                            <span style={{ padding: "2px 6px", background: "#f1f5f9", borderRadius: "3px", fontSize: "0.75rem", fontWeight: 600 }}>
                                                {stock.product}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: "600" }}>{stock.name}</td>
                                        <td>{stock.qty}</td>
                                        <td>{stock.avg.toFixed(2)}</td>
                                        <td>{stock.price.toFixed(2)}</td>
                                        <td className={profClass} style={{ fontWeight: 600 }}>
                                            {isProfit ? `+${pnl.toFixed(2)}` : pnl.toFixed(2)}
                                        </td>
                                        <td className={dayClass}>{stock.day}</td>
                                        <td>
                                            <button
                                                onClick={() => generalContext.openSellWindow(stock.name, stock.price)}
                                                style={{
                                                    padding: "3px 8px",
                                                    fontSize: "0.75rem",
                                                    background: "#fee2e2",
                                                    color: "#b91c1c",
                                                    border: "none",
                                                    borderRadius: "3px",
                                                    cursor: "pointer",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                Exit
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Positions;