import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav
            className="navbar navbar-expand-lg border-bottom"
            style={{ backgroundColor: "#FFF" }}
        >
            <div className="container p-2">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img
                        src="media/images/logo.svg"
                        style={{ height: "36px", width: "auto" }}
                        alt="TradeSphere Logo"
                    />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto align-items-center mb-2 mb-lg-0 gap-2">
                        <li className="nav-item">
                            <Link className="nav-link text-muted" to="/signup">
                                Signup
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-muted" to="/about">
                                About
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-muted" to="/product">
                                Products
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-muted" to="/pricing">
                                Pricing
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-muted" to="/support">
                                Support
                            </Link>
                        </li>
                        <li className="nav-item ms-lg-2">
                            <a
                                className="btn btn-primary btn-sm px-3 fw-semibold shadow-sm"
                                href="http://localhost:3001"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Open Dashboard 🚀
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;