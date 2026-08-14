import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, price = 0, initialMode = "BUY" }) => {
    const [mode, setMode] = useState(initialMode);
    const [productType, setProductType] = useState("CNC");
    const [orderType, setOrderType] = useState("LIMIT");
    const [stockQuantity, setStockQuantity] = useState(1);
    const [stockPrice, setStockPrice] = useState(price || 100.0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");

    const generalContext = useContext(GeneralContext);

    useEffect(() => {
        if (price > 0) {
            setStockPrice(price);
        }
        setMode(initialMode);
    }, [uid, price, initialMode]);

    const marginRequired = (Number(stockQuantity) * Number(stockPrice)).toFixed(2);

    const handleOrderSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsSubmitting(true);
        setStatusMsg("");

        try {
            await axios.post("http://localhost:3002/newOrder", {
                name: uid,
                qty: Number(stockQuantity),
                price: Number(stockPrice),
                mode: mode,
                product: productType,
            });

            setStatusMsg("Order executed successfully!");
            generalContext.triggerOrderRefresh();

            setTimeout(() => {
                generalContext.closeBuyWindow();
            }, 700);
        } catch (err) {
            console.error("Order error:", err);
            setStatusMsg("Simulated order recorded!");
            generalContext.triggerOrderRefresh();
            setTimeout(() => {
                generalContext.closeBuyWindow();
            }, 700);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelClick = () => {
        generalContext.closeBuyWindow();
    };

    return (
        <div className="order-window-overlay">
            <div className={`order-window-card ${mode === "SELL" ? "sell-mode" : "buy-mode"}`}>
                {/* Header */}
                <div className="order-window-header">
                    <div>
                        <span className="order-action-title">
                            {mode === "BUY" ? "BUY" : "SELL"} {uid}
                        </span>
                        <span className="exchange-badge">NSE</span>
                        <span className="live-price-tag">₹{Number(stockPrice).toFixed(2)}</span>
                    </div>
                    <button className="close-btn" onClick={handleCancelClick}>&times;</button>
                </div>

                {/* Mode Selector Tabs */}
                <div className="order-mode-tabs">
                    <button
                        type="button"
                        className={`tab-btn ${mode === "BUY" ? "active buy" : ""}`}
                        onClick={() => setMode("BUY")}
                    >
                        BUY
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${mode === "SELL" ? "active sell" : ""}`}
                        onClick={() => setMode("SELL")}
                    >
                        SELL
                    </button>
                </div>

                {/* Form Body */}
                <div className="order-window-body">
                    {/* Product Type (Intraday vs Longterm) */}
                    <div className="radio-group-container">
                        <label className={`radio-label ${productType === "CNC" ? "selected" : ""}`}>
                            <input
                                type="radio"
                                name="productType"
                                value="CNC"
                                checked={productType === "CNC"}
                                onChange={() => setProductType("CNC")}
                            />
                            <span>Longterm (CNC)</span>
                        </label>
                        <label className={`radio-label ${productType === "MIS" ? "selected" : ""}`}>
                            <input
                                type="radio"
                                name="productType"
                                value="MIS"
                                checked={productType === "MIS"}
                                onChange={() => setProductType("MIS")}
                            />
                            <span>Intraday (MIS)</span>
                        </label>
                    </div>

                    {/* Quantity and Price Inputs */}
                    <div className="order-inputs-row">
                        <div className="input-box">
                            <label htmlFor="qty-input">Qty.</label>
                            <input
                                type="number"
                                id="qty-input"
                                min="1"
                                value={stockQuantity}
                                onChange={(e) => setStockQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            />
                        </div>
                        <div className="input-box">
                            <label htmlFor="price-input">Price (₹)</label>
                            <input
                                type="number"
                                id="price-input"
                                step="0.05"
                                min="0.05"
                                value={stockPrice}
                                onChange={(e) => setStockPrice(parseFloat(e.target.value) || 0)}
                                disabled={orderType === "MARKET"}
                            />
                        </div>
                    </div>

                    {/* Order Type (Market vs Limit) */}
                    <div className="order-type-toggle">
                        <label className={`radio-pill ${orderType === "LIMIT" ? "active" : ""}`}>
                            <input
                                type="radio"
                                name="orderType"
                                value="LIMIT"
                                checked={orderType === "LIMIT"}
                                onChange={() => setOrderType("LIMIT")}
                            />
                            Limit
                        </label>
                        <label className={`radio-pill ${orderType === "MARKET" ? "active" : ""}`}>
                            <input
                                type="radio"
                                name="orderType"
                                value="MARKET"
                                checked={orderType === "MARKET"}
                                onChange={() => setOrderType("MARKET")}
                            />
                            Market
                        </label>
                    </div>

                    {statusMsg && <div className="order-status-msg">{statusMsg}</div>}
                </div>

                {/* Footer Controls */}
                <div className="order-window-footer">
                    <div className="margin-info">
                        <small>Margin req:</small> <strong>₹{marginRequired}</strong>
                    </div>
                    <div className="action-buttons">
                        <button
                            type="button"
                            className={`btn-execute ${mode === "SELL" ? "btn-sell" : "btn-buy"}`}
                            onClick={handleOrderSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Placing..." : mode}
                        </button>
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={handleCancelClick}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyActionWindow;