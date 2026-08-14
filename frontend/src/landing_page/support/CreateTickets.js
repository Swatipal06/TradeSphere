import React from "react";

function CreateTicket() {
    return (
        <div className="container">
            <div className="row p-5 mt-5 mb-5">
                <h1 className="fs-2 mb-4">To create a ticket, select a relevant topic</h1>

                {/* Topic 1: Account Opening */}
                <div className="col-md-4 p-4">
                    <h4 className="fs-5 fw-semibold mb-3">
                        <i className="fa fa-plus-circle me-2 text-primary" aria-hidden="true"></i> Account Opening
                    </h4>
                    <ul className="list-unstyled" style={{ lineHeight: "2.2" }}>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Online Account Opening</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Offline Account Opening</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Company, Partnership and HUF Account</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">NRI Account Opening</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Charges at TradeSphere</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">TradeSphere 3-in-1 Bank Account</a></li>
                    </ul>
                </div>

                {/* Topic 2: TradeSphere Account & KYC */}
                <div className="col-md-4 p-4">
                    <h4 className="fs-5 fw-semibold mb-3">
                        <i className="fa fa-user me-2 text-primary" aria-hidden="true"></i> Your TradeSphere Account
                    </h4>
                    <ul className="list-unstyled" style={{ lineHeight: "2.2" }}>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Login & 2FA credentials</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Profile and KYC modification</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Adding nominee to Demat account</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Segment Activation (F&O, MCX)</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Transfer and conversion of shares</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Re-KYC and annual compliance</a></li>
                    </ul>
                </div>

                {/* Topic 3: Trading and Markets */}
                <div className="col-md-4 p-4">
                    <h4 className="fs-5 fw-semibold mb-3">
                        <i className="fa fa-line-chart me-2 text-primary" aria-hidden="true"></i> Trading & Markets
                    </h4>
                    <ul className="list-unstyled" style={{ lineHeight: "2.2" }}>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Placing simulated CNC and MIS orders</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Stoploss, GTT and Cover Orders</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">TradingView & ChartIQ features</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Margins & Intraday leverage</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Market timings & holidays calendar</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Corporate actions & buybacks</a></li>
                    </ul>
                </div>

                {/* Topic 4: Funds */}
                <div className="col-md-4 p-4">
                    <h4 className="fs-5 fw-semibold mb-3">
                        <i className="fa fa-credit-card me-2 text-primary" aria-hidden="true"></i> Funds & Banking
                    </h4>
                    <ul className="list-unstyled" style={{ lineHeight: "2.2" }}>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Adding virtual funds via UPI/Netbanking</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Instant withdrawal process</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Bank account linking and verification</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">eMandates & automated SIP debits</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Margin utilization & pledged collateral</a></li>
                    </ul>
                </div>

                {/* Topic 5: Console & Analytics */}
                <div className="col-md-4 p-4">
                    <h4 className="fs-5 fw-semibold mb-3">
                        <i className="fa fa-dashboard me-2 text-primary" aria-hidden="true"></i> Console & Reports
                    </h4>
                    <ul className="list-unstyled" style={{ lineHeight: "2.2" }}>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Portfolio and Profit & Loss report</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Tradebook and contract notes</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Tax P&L and statement downloads</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Analytics breakdown & sector allocations</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Family portfolio tracking</a></li>
                    </ul>
                </div>

                {/* Topic 6: Coin & Mutual Funds */}
                <div className="col-md-4 p-4">
                    <h4 className="fs-5 fw-semibold mb-3">
                        <i className="fa fa-pie-chart me-2 text-primary" aria-hidden="true"></i> Coin & Mutual Funds
                    </h4>
                    <ul className="list-unstyled" style={{ lineHeight: "2.2" }}>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Direct Mutual Funds investment</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Setting up flexible SIPs</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Govt. Securities (G-Secs) & T-Bills</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">Sovereign Gold Bonds (SGBs)</a></li>
                        <li><a href="#ticket" className="text-decoration-none text-muted">National Pension Scheme (NPS)</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default CreateTicket;