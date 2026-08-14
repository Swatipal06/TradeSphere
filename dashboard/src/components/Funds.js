import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const Funds = () => {
    const [funds, setFunds] = useState({
        availableMargin: 104043.1,
        usedMargin: 3757.3,
        availableCash: 104043.1,
        openingBalance: 104043.1,
        payin: 100000.0,
        span: 0.0,
        deliveryMargin: 0.0,
        exposure: 0.0,
        optionsPremium: 0.0,
        collateralLiquid: 0.0,
        collateralEquity: 0.0,
        totalCollateral: 0.0,
    });

    const [modalMode, setModalMode] = useState(null); // 'ADD' or 'WITHDRAW'
    const [amountInput, setAmountInput] = useState("");
    const [message, setMessage] = useState("");
    const generalContext = useContext(GeneralContext);

    const fetchFunds = () => {
        axios
            .get("http://localhost:3002/funds")
            .then((res) => {
                if (res.data) setFunds(res.data);
            })
            .catch(() => {});
    };

    useEffect(() => {
        fetchFunds();
    }, [generalContext?.refreshCounter]);

    const handleFundTransaction = (e) => {
        e.preventDefault();
        const amt = parseFloat(amountInput);
        if (!amt || amt <= 0) {
            setMessage("Please enter a valid amount");
            return;
        }

        if (modalMode === "WITHDRAW" && amt > funds.availableMargin) {
            setMessage("Withdrawal amount cannot exceed available margin");
            return;
        }

        axios
            .post("http://localhost:3002/funds/update", {
                amount: amt,
                type: modalMode,
            })
            .then((res) => {
                if (res.data && res.data.funds) {
                    setFunds(res.data.funds);
                }
                setMessage(`Successfully ${modalMode === "ADD" ? "added" : "withdrawn"} ₹${amt.toLocaleString("en-IN")}!`);
                setTimeout(() => {
                    setModalMode(null);
                    setAmountInput("");
                    setMessage("");
                }, 1000);
            })
            .catch(() => {
                // In-memory local update
                if (modalMode === "ADD") {
                    setFunds((prev) => ({
                        ...prev,
                        availableMargin: prev.availableMargin + amt,
                        availableCash: prev.availableCash + amt,
                        payin: prev.payin + amt,
                    }));
                } else {
                    setFunds((prev) => ({
                        ...prev,
                        availableMargin: prev.availableMargin - amt,
                        availableCash: prev.availableCash - amt,
                    }));
                }
                setMessage(`Successfully ${modalMode === "ADD" ? "added" : "withdrawn"} ₹${amt.toLocaleString("en-IN")}!`);
                setTimeout(() => {
                    setModalMode(null);
                    setAmountInput("");
                    setMessage("");
                }, 1000);
            });
    };

    return (
        <div style={{ padding: "20px 30px" }}>
            <div className="funds" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", background: "#f8fafc", padding: "16px 20px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <p style={{ margin: 0, fontWeight: "500", color: "#334155" }}>
                    Instant, zero-cost virtual fund transfers with UPI & Net Banking
                </p>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        className="btn btn-green"
                        style={{ background: "#16a34a", color: "#fff", border: "none", padding: "8px 20px", borderRadius: "4px", fontWeight: "600", cursor: "pointer" }}
                        onClick={() => { setModalMode("ADD"); setMessage(""); }}
                    >
                        + Add funds
                    </button>
                    <button
                        className="btn btn-blue"
                        style={{ background: "#2563eb", color: "#fff", border: "none", padding: "8px 20px", borderRadius: "4px", fontWeight: "600", cursor: "pointer" }}
                        onClick={() => { setModalMode("WITHDRAW"); setMessage(""); }}
                    >
                        - Withdraw
                    </button>
                </div>
            </div>

            {/* Modal Overlay for Fund Transactions */}
            {modalMode && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                    <div style={{ background: "#fff", padding: "24px", borderRadius: "8px", width: "380px", maxWidth: "90vw", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
                        <h4 style={{ margin: "0 0 16px 0", fontWeight: "700" }}>
                            {modalMode === "ADD" ? "Deposit Virtual Funds" : "Withdraw Virtual Funds"}
                        </h4>
                        <form onSubmit={handleFundTransaction}>
                            <label style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>
                                Amount (₹)
                            </label>
                            <input
                                type="number"
                                min="100"
                                step="100"
                                placeholder="e.g. 50000"
                                value={amountInput}
                                onChange={(e) => setAmountInput(e.target.value)}
                                style={{ width: "100%", padding: "10px", margin: "8px 0 16px 0", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "1.1rem", fontWeight: "600", boxSizing: "border-box" }}
                                autoFocus
                            />

                            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                                {[10000, 25000, 50000, 100000].map((preset) => (
                                    <button
                                        type="button"
                                        key={preset}
                                        onClick={() => setAmountInput(preset.toString())}
                                        style={{ flex: 1, padding: "4px", fontSize: "0.75rem", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer" }}
                                    >
                                        +{preset / 1000}k
                                    </button>
                                ))}
                            </div>

                            {message && (
                                <p style={{ fontSize: "0.85rem", color: message.includes("Success") ? "#16a34a" : "#dc2626", margin: "0 0 12px 0", fontWeight: "500" }}>
                                    {message}
                                </p>
                            )}

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                                <button
                                    type="button"
                                    onClick={() => setModalMode(null)}
                                    style={{ padding: "8px 16px", background: "#e2e8f0", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: "8px 20px", background: modalMode === "ADD" ? "#16a34a" : "#2563eb", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "600", cursor: "pointer" }}
                                >
                                    Confirm {modalMode === "ADD" ? "Deposit" : "Withdrawal"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="row">
                <div className="col">
                    <span>
                        <p style={{ fontWeight: "600", fontSize: "1.05rem", color: "#0f172a" }}>Equity Breakdown</p>
                    </span>

                    <div className="table">
                        <div className="data">
                            <p>Available margin</p>
                            <p className="imp colored" style={{ color: "#16a34a", fontWeight: "700" }}>
                                ₹{funds.availableMargin.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="data">
                            <p>Used margin</p>
                            <p className="imp">₹{funds.usedMargin.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                        <div className="data">
                            <p>Available cash</p>
                            <p className="imp">₹{funds.availableCash.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                        <hr />
                        <div className="data">
                            <p>Opening Balance</p>
                            <p>₹{(funds.availableMargin + funds.usedMargin).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                        <div className="data">
                            <p>Payin</p>
                            <p>₹{funds.payin.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                        <div className="data">
                            <p>SPAN</p>
                            <p>₹0.00</p>
                        </div>
                        <div className="data">
                            <p>Delivery margin</p>
                            <p>₹0.00</p>
                        </div>
                        <div className="data">
                            <p>Exposure</p>
                            <p>₹0.00</p>
                        </div>
                        <div className="data">
                            <p>Options premium</p>
                            <p>₹0.00</p>
                        </div>
                        <hr />
                        <div className="data">
                            <p>Collateral (Liquid funds)</p>
                            <p>₹0.00</p>
                        </div>
                        <div className="data">
                            <p>Collateral (Equity)</p>
                            <p>₹0.00</p>
                        </div>
                        <div className="data">
                            <p>Total Collateral</p>
                            <p>₹0.00</p>
                        </div>
                    </div>
                </div>

                <div className="col">
                    <div className="commodity">
                        <p style={{ fontWeight: "600", fontSize: "1rem" }}>Commodity Trading</p>
                        <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                            You have activated simulated Equity, F&O, and Currency segments.
                        </p>
                        <button
                            style={{ padding: "8px 16px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600" }}
                            onClick={() => alert("Simulated Commodity Account is active!")}
                        >
                            Active Demat Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Funds;