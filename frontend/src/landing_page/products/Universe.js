import React from "react";
import { Link } from "react-router-dom";

function Universe() {
    return (
        <div className="container mt-5">
            <div className="row text-center">
                <h1 className="fw-bold">The TradeSphere Universe</h1>
                <p className="text-muted">
                    Extend your trading and investment experience even further with our
                    partner platforms
                </p>

                <div className="col-4 p-4 mt-4">
                    <img src="media/images/tradesphereFundhouse.png" style={{ height: "45px" }} alt="TradeSphere Fund House" />
                    <p className="text-small text-muted mt-3">Our asset management venture creating simple, transparent index funds.</p>
                </div>
                <div className="col-4 p-4 mt-4">
                    <img src="media/images/sensibullLogo.svg" style={{ height: "45px" }} alt="Sensibull" />
                    <p className="text-small text-muted mt-3">Options trading platform that lets you create strategies and analyze positions.</p>
                </div>
                <div className="col-4 p-4 mt-4">
                    <img src="media/images/goldenpiLogo.png" style={{ height: "45px" }} alt="GoldenPi" />
                    <p className="text-small text-muted mt-3">Bonds and fixed income trading platform for retail investors.</p>
                </div>
                <div className="col-4 p-4 mt-4">
                    <img src="media/images/streakLogo.png" style={{ height: "45px" }} alt="Streak" />
                    <p className="text-small text-muted mt-3">Systematic trading platform without coding. Create, backtest, and deploy strategies.</p>
                </div>
                <div className="col-4 p-4 mt-4">
                    <img src="media/images/smallcaseLogo.png" style={{ height: "45px" }} alt="Smallcase" />
                    <p className="text-small text-muted mt-3">Thematic investment platform for diversified, curated stock baskets.</p>
                </div>
                <div className="col-4 p-4 mt-4">
                    <img src="media/images/dittoLogo.png" style={{ height: "45px" }} alt="Ditto" />
                    <p className="text-small text-muted mt-3">Personalized insurance advice with no spam and zero mis-selling.</p>
                </div>
                <div className="col-12 mt-4">
                    <Link
                        to="/signup"
                        className="p-2 btn btn-primary fs-5 mb-5 px-5"
                    >
                        Sign up for Free
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Universe;