import React from "react";
import { Link } from "react-router-dom";

function Hero() {
    return (
        <div className="container p-5 mb-5">
            <div className="row text-center">
                <img
                    src="media/images/homeHero.png"
                    alt="TradeSphere Trading Ecosystem"
                    className="mb-5 img-fluid"
                    style={{ maxHeight: "380px", objectFit: "contain" }}
                />
                <h1 className="mt-4 fw-bold">Invest in everything</h1>
                <p className="fs-5 text-muted mb-4">
                    Online platform to invest in stocks, derivatives, mutual funds, and more — with zero risk virtual simulation.
                </p>
                <div className="d-flex justify-content-center gap-3">
                    <Link
                        to="/signup"
                        className="btn btn-primary btn-lg px-4 fw-semibold"
                    >
                        Sign up for Free
                    </Link>
                    <a
                        href="http://localhost:3001"
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline-dark btn-lg px-4 fw-semibold"
                    >
                        Live Trading Dashboard →
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Hero;