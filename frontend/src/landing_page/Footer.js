import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer style={{ backgroundColor: "#f8fafc" }} className="border-top pt-5">
            <div className="container">
                <div className="row g-4 mb-4">
                    {/* Brand Column */}
                    <div className="col-lg-3 col-md-6">
                        <img
                            src="media/images/logo.svg"
                            alt="TradeSphere Logo"
                            style={{ height: "36px", marginBottom: "16px" }}
                        />
                        <p className="text-muted small mb-3">
                            &copy; 2026 TradeSphere. All rights reserved.
                        </p>
                        <p className="text-secondary small">
                            Built with React, Node.js, Express, and MongoDB by <strong>Swati Pal</strong>.
                        </p>
                        <div className="d-flex gap-3 mt-3">
                            <a href="https://github.com/Swatipal06" target="_blank" rel="noreferrer" className="text-muted text-decoration-none small">
                                GitHub
                            </a>
                            <span>•</span>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-muted text-decoration-none small">
                                LinkedIn
                            </a>
                            <span>•</span>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-muted text-decoration-none small">
                                Twitter
                            </a>
                        </div>
                    </div>

                    {/* Company */}
                    <div className="col-lg-2 col-md-6 col-6">
                        <h6 className="fw-bold text-dark mb-3">Company</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2 small">
                            <li><Link to="/about" className="text-muted text-decoration-none">About</Link></li>
                            <li><Link to="/product" className="text-muted text-decoration-none">Products</Link></li>
                            <li><Link to="/pricing" className="text-muted text-decoration-none">Pricing</Link></li>
                            <li><a href="#careers" className="text-muted text-decoration-none">Careers</a></li>
                            <li><a href="#press" className="text-muted text-decoration-none">Press & Media</a></li>
                        </ul>
                    </div>

                    {/* Features */}
                    <div className="col-lg-2 col-md-6 col-6">
                        <h6 className="fw-bold text-dark mb-3">Features</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2 small">
                            <li><a href="http://localhost:3001" target="_blank" rel="noreferrer" className="text-muted text-decoration-none">Trading Dashboard</a></li>
                            <li><a href="http://localhost:3001/holdings" target="_blank" rel="noreferrer" className="text-muted text-decoration-none">Portfolio</a></li>
                            <li><a href="http://localhost:3001" target="_blank" rel="noreferrer" className="text-muted text-decoration-none">Watchlist</a></li>
                            <li><a href="http://localhost:3001/positions" target="_blank" rel="noreferrer" className="text-muted text-decoration-none">Market Insights</a></li>
                            <li><Link to="/product" className="text-muted text-decoration-none">Learn</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="col-lg-2 col-md-6 col-6">
                        <h6 className="fw-bold text-dark mb-3">Support</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2 small">
                            <li><Link to="/support" className="text-muted text-decoration-none">Contact</Link></li>
                            <li><Link to="/support" className="text-muted text-decoration-none">Help Center</Link></li>
                            <li><a href="#resources" className="text-muted text-decoration-none">Resources</a></li>
                            <li><a href="#faqs" className="text-muted text-decoration-none">FAQs</a></li>
                            <li><a href="#community" className="text-muted text-decoration-none">Community</a></li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div className="col-lg-3 col-md-6 col-6">
                        <h6 className="fw-bold text-dark mb-3">Account</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2 small">
                            <li><Link to="/signup" className="text-muted text-decoration-none">Open Account</Link></li>
                            <li><Link to="/signup" className="text-muted text-decoration-none">Login</Link></li>
                            <li><a href="http://localhost:3001" target="_blank" rel="noreferrer" className="text-muted text-decoration-none">Profile & Settings</a></li>
                            <li><a href="http://localhost:3001/funds" target="_blank" rel="noreferrer" className="text-muted text-decoration-none">Fund Transfer</a></li>
                        </ul>
                    </div>
                </div>

                {/* Disclaimer & Policy Notice */}
                <div className="border-top pt-4 pb-4 text-muted small" style={{ fontSize: "13px", lineHeight: "1.7" }}>
                    <p className="mb-2">
                        <strong>Disclaimer:</strong> TradeSphere is a portfolio project created for educational and demonstration purposes. It is not a registered stock broker, financial intermediary, or investment advisor. The information and features presented on this platform are intended solely for learning, development, and showcasing full-stack application capabilities.
                    </p>
                    <p className="mb-2">
                        Investments in financial markets are subject to risk. Always perform your own research and consult a qualified financial professional before making any investment decisions.
                    </p>
                    <p className="mb-0">
                        For support or feedback, contact: <a href="mailto:support@tradesphere.dev" className="text-primary text-decoration-none">support@tradesphere.dev</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;