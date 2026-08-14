import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import GeneralContext from "./GeneralContext";

const Orders = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const generalContext = useContext(GeneralContext);

    const fetchOrders = () => {
        setLoading(true);
        api
            .get("/allOrders")
            .then((res) => {
                setAllOrders(res.data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch orders:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchOrders();
    }, [generalContext.refreshCounter]);

    return (
        <div className="orders-page" style={{ padding: "20px 30px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 className="title" style={{ margin: 0 }}>
                    Orderbook ({allOrders.length})
                </h3>
                <button
                    onClick={fetchOrders}
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
                    Loading executed orders...
                </div>
            ) : allOrders.length > 0 ? (
                <div className="order-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Type</th>
                                <th>Instrument</th>
                                <th>Product</th>
                                <th>Qty.</th>
                                <th>Price (₹)</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allOrders.map((order, index) => {
                                const isBuy = (order.mode || "BUY").toUpperCase() === "BUY";
                                const formattedTime = order.createdAt
                                    ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                                    : "Just now";

                                return (
                                    <tr key={order._id || index}>
                                        <td style={{ color: "#64748b", fontSize: "0.85rem" }}>
                                            {formattedTime}
                                        </td>
                                        <td>
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
                                                {order.mode || "BUY"}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: "600", color: "#1e293b" }}>
                                            {order.name}
                                        </td>
                                        <td style={{ color: "#64748b" }}>
                                            {order.product || "CNC"}
                                        </td>
                                        <td>{order.qty}</td>
                                        <td>{Number(order.price).toFixed(2)}</td>
                                        <td>
                                            <span
                                                style={{
                                                    color: "#16a34a",
                                                    fontWeight: "600",
                                                    fontSize: "0.85rem",
                                                }}
                                            >
                                                ● {order.status || "COMPLETE"}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="orders">
                    <div className="no-orders" style={{ textAlign: "center", padding: "60px 20px" }}>
                        <p style={{ fontSize: "1.1rem", color: "#64748b", marginBottom: "16px" }}>
                            You haven't placed any virtual orders today
                        </p>
                        <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginBottom: "24px" }}>
                            Select any stock from the watchlist on the left and click <strong>Buy</strong> or <strong>Sell</strong>.
                        </p>
                        <Link
                            to={"/"}
                            className="btn"
                            style={{
                                padding: "10px 24px",
                                background: "#2563eb",
                                color: "#fff",
                                textDecoration: "none",
                                borderRadius: "4px",
                                fontWeight: "600",
                            }}
                        >
                            View Dashboard Summary
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;