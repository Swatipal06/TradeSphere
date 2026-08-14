import React, { useState, useEffect, useContext } from "react";
import Menu from "./Menu";
import GeneralContext from "./GeneralContext";

const TopBar = ({ user }) => {
    const [niftyPoints, setNiftyPoints] = useState(24834.85);
    const [niftyPercent, setNiftyPercent] = useState("+0.42%");
    const [sensexPoints, setSensexPoints] = useState(81388.40);
    const [sensexPercent, setSensexPercent] = useState("+0.38%");

    const { logout } = useContext(GeneralContext);

    // Subtle realistic market fluctuations
    useEffect(() => {
        const interval = setInterval(() => {
            const niftyDelta = (Math.random() * 4 - 1.8);
            const sensexDelta = (Math.random() * 12 - 5.5);

            setNiftyPoints((prev) => {
                const nextVal = parseFloat((prev + niftyDelta).toFixed(2));
                const pct = ((niftyDelta / 24834.85) * 100).toFixed(2);
                setNiftyPercent(pct >= 0 ? `+${pct}%` : `${pct}%`);
                return nextVal;
            });

            setSensexPoints((prev) => {
                const nextVal = parseFloat((prev + sensexDelta).toFixed(2));
                const pct = ((sensexDelta / 81388.40) * 100).toFixed(2);
                setSensexPercent(pct >= 0 ? `+${pct}%` : `${pct}%`);
                return nextVal;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const userName = user?.name || user?.email?.split("@")[0] || "Trader";
    const initials = userName.slice(0, 2).toUpperCase();

    return (
        <div className="topbar-container">
            <div className="indices-container">
                <div className="nifty">
                    <p className="index">NIFTY 50</p>
                    <p className="index-points">{niftyPoints.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                    <p className="percent" style={{ color: "#16a34a", fontWeight: "600" }}>{niftyPercent}</p>
                </div>
                <div className="sensex">
                    <p className="index">SENSEX</p>
                    <p className="index-points">{sensexPoints.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                    <p className="percent" style={{ color: "#16a34a", fontWeight: "600" }}>{sensexPercent}</p>
                </div>
            </div>

            <Menu />

            {/* User info + Logout */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: "auto", paddingRight: "16px" }}>
                <div style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    background: "#f1f5f9", borderRadius: "20px", padding: "4px 12px 4px 4px"
                }}>
                    <div style={{
                        width: "28px", height: "28px", borderRadius: "50%",
                        background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                        color: "#fff", display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: "11px", fontWeight: "700"
                    }}>
                        {initials}
                    </div>
                    <span style={{ fontSize: "0.82rem", fontWeight: "600", color: "#334155" }}>
                        {userName}
                    </span>
                </div>
                <button
                    onClick={logout}
                    title="Logout"
                    style={{
                        padding: "6px 14px", background: "transparent",
                        border: "1.5px solid #e2e8f0", borderRadius: "6px",
                        cursor: "pointer", fontSize: "0.8rem", fontWeight: "600",
                        color: "#64748b", transition: "all 0.2s",
                    }}
                    onMouseOver={(e) => { e.target.style.borderColor = "#dc2626"; e.target.style.color = "#dc2626"; }}
                    onMouseOut={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.color = "#64748b"; }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default TopBar;