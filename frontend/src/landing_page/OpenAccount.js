import React from "react";
import { Link } from "react-router-dom";

function OpenAccount() {
    return (
        <div className="container p-5 mb-5">
            <div className="row text-center">
                <h1 className="mt-5 fw-bold">Open a TradeSphere account</h1>
                <p className="text-muted fs-5">
                    Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and
                    F&O trades with simulated paper trading.
                </p>
                <div>
                    <Link
                        to="/signup"
                        className="btn btn-primary btn-lg fs-5 px-5 mt-3"
                    >
                        Sign up Now
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default OpenAccount;