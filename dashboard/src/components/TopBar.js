import React, { useState, useEffect } from "react";
import Menu from "./Menu";

const TopBar = () => {
    const [niftyPoints, setNiftyPoints] = useState(24834.85);
    const [niftyPercent, setNiftyPercent] = useState("+0.42%");
    const [sensexPoints, setSensexPoints] = useState(81388.40);
    const [sensexPercent, setSensexPercent] = useState("+0.38%");

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
        </div>
    );
};

export default TopBar;