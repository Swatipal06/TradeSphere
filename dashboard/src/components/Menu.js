import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Menu = () => {
    const location = useLocation();
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const isSelected = (path) => {
        if (path === "/" && location.pathname === "/") return true;
        if (path !== "/" && location.pathname.startsWith(path)) return true;
        return false;
    };

    const menuClass = "menu";
    const activeMenuClass = "menu selected";

    return (
        <div className="menu-container" style={{ position: "relative" }}>
            <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                <img
                    src="logo.svg"
                    style={{ height: "30px", width: "auto", marginRight: "10px" }}
                    alt="TradeSphere Logo"
                />
            </Link>

            <div className="menus">
                <ul>
                    <li>
                        <Link style={{ textDecoration: "none" }} to="/">
                            <p className={isSelected("/") ? activeMenuClass : menuClass}>
                                Dashboard
                            </p>
                        </Link>
                    </li>
                    <li>
                        <Link style={{ textDecoration: "none" }} to="/orders">
                            <p className={isSelected("/orders") ? activeMenuClass : menuClass}>
                                Orders
                            </p>
                        </Link>
                    </li>
                    <li>
                        <Link style={{ textDecoration: "none" }} to="/holdings">
                            <p className={isSelected("/holdings") ? activeMenuClass : menuClass}>
                                Holdings
                            </p>
                        </Link>
                    </li>
                    <li>
                        <Link style={{ textDecoration: "none" }} to="/positions">
                            <p className={isSelected("/positions") ? activeMenuClass : menuClass}>
                                Positions
                            </p>
                        </Link>
                    </li>
                    <li>
                        <Link style={{ textDecoration: "none" }} to="/funds">
                            <p className={isSelected("/funds") ? activeMenuClass : menuClass}>
                                Funds
                            </p>
                        </Link>
                    </li>
                    <li>
                        <Link style={{ textDecoration: "none" }} to="/apps">
                            <p className={isSelected("/apps") ? activeMenuClass : menuClass}>
                                Apps
                            </p>
                        </Link>
                    </li>
                </ul>

                <hr style={{ margin: "0 15px", borderColor: "#e2e8f0" }} />

                <div
                    className="profile"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    style={{ cursor: "pointer", position: "relative" }}
                >
                    <div className="avatar" style={{ background: "#2563eb", color: "#fff", fontWeight: 700 }}>
                        TS
                    </div>
                    <p className="username" style={{ fontWeight: 600 }}>TS-TRADER</p>

                    {/* Profile Dropdown */}
                    {isProfileDropdownOpen && (
                        <div
                            style={{
                                position: "absolute",
                                top: "50px",
                                right: "0",
                                width: "230px",
                                background: "#ffffff",
                                borderRadius: "8px",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                                border: "1px solid #e2e8f0",
                                padding: "16px",
                                zIndex: 1000,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div style={{ paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>
                                <div style={{ fontWeight: "700", color: "#1e293b" }}>Trader Profile</div>
                                <div style={{ fontSize: "0.8rem", color: "#64748b" }}>ID: TS-89421</div>
                                <div style={{ marginTop: "6px" }}>
                                    <span style={{ fontSize: "0.75rem", background: "#dcfce7", color: "#166534", padding: "2px 6px", borderRadius: "4px", fontWeight: "600" }}>
                                        ✓ KYC Simulated Verified
                                    </span>
                                </div>
                            </div>

                            <div style={{ padding: "10px 0", fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "8px" }}>
                                <a
                                    href="http://localhost:3000"
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ color: "#2563eb", textDecoration: "none", fontWeight: "500" }}
                                >
                                    🌐 TradeSphere Main Portal
                                </a>
                                <span style={{ color: "#475569" }}>Segment: Equity, F&O</span>
                                <span style={{ color: "#475569" }}>Mode: Paper Trading (Risk-Free)</span>
                            </div>

                            <div style={{ paddingTop: "10px", borderTop: "1px solid #f1f5f9" }}>
                                <button
                                    onClick={() => {
                                        alert("Logged out of TradeSphere Session");
                                        window.location.href = "http://localhost:3000/signup";
                                    }}
                                    style={{
                                        width: "100%",
                                        padding: "6px",
                                        background: "#fee2e2",
                                        color: "#b91c1c",
                                        border: "none",
                                        borderRadius: "4px",
                                        fontSize: "0.8rem",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Menu;