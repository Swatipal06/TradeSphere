import React from "react";

function Hero() {
    return (
        <div className="container py-5">
            {/* Header Title Section */}
            <div className="row text-center mt-4 mb-5">
                <div className="col-12">
                    <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fs-6 fw-semibold mb-3">
                        About TradeSphere
                    </span>
                    <h1 className="display-5 fw-bold text-dark mb-3">
                        Reimagining investing for the next generation
                    </h1>
                    <p className="lead text-muted mx-auto" style={{ maxWidth: "800px", lineHeight: "1.8" }}>
                        TradeSphere was built with a simple vision — to make investing and trading
                        accessible, affordable, and technology-driven for everyone.
                    </p>
                </div>
            </div>

            {/* Intro Belief */}
            <div className="row justify-content-center mb-5">
                <div className="col-lg-10">
                    <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5" style={{ background: "linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)" }}>
                        <p className="fs-5 text-secondary mb-0" style={{ lineHeight: "1.9" }}>
                            We launched TradeSphere with the belief that financial markets should not be limited
                            by high costs, complicated platforms, or lack of education. Our goal is to create a
                            seamless ecosystem where users can invest, trade, learn, and grow with confidence.
                        </p>
                    </div>
                </div>
            </div>

            {/* Pillars: What Drives Us & Technology At Core */}
            <div className="row g-4 mb-5 pt-3">
                {/* What Drives Us */}
                <div className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm rounded-4 p-4 p-lg-5">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="bg-primary text-white rounded-3 p-2 px-3 fw-bold fs-4">⚡</div>
                            <h2 className="fs-3 fw-bold text-dark mb-0">What drives us</h2>
                        </div>
                        <p className="text-muted" style={{ lineHeight: "1.8" }}>
                            Traditional investing platforms often create friction through complex interfaces,
                            hidden charges, and limited transparency. TradeSphere is designed to remove these barriers by focusing on:
                        </p>
                        <ul className="list-unstyled mt-3 d-flex flex-column gap-2">
                            <li className="d-flex align-items-center gap-2 text-secondary">
                                <span className="text-primary fw-bold">✓</span> Simple and intuitive user experience
                            </li>
                            <li className="d-flex align-items-center gap-2 text-secondary">
                                <span className="text-primary fw-bold">✓</span> Transparent pricing
                            </li>
                            <li className="d-flex align-items-center gap-2 text-secondary">
                                <span className="text-primary fw-bold">✓</span> Fast and reliable technology
                            </li>
                            <li className="d-flex align-items-center gap-2 text-secondary">
                                <span className="text-primary fw-bold">✓</span> Secure trading infrastructure
                            </li>
                            <li className="d-flex align-items-center gap-2 text-secondary">
                                <span className="text-primary fw-bold">✓</span> Investor-first approach
                            </li>
                        </ul>
                        <p className="text-muted mt-3 mb-0 small" style={{ lineHeight: "1.7" }}>
                            Whether you are a beginner taking your first step into the stock market or an experienced trader managing multiple positions, TradeSphere aims to provide the tools you need in one unified platform.
                        </p>
                    </div>
                </div>

                {/* Technology At Our Core */}
                <div className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm rounded-4 p-4 p-lg-5">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="bg-primary text-white rounded-3 p-2 px-3 fw-bold fs-4">💻</div>
                            <h2 className="fs-3 fw-bold text-dark mb-0">Technology at our core</h2>
                        </div>
                        <p className="text-muted" style={{ lineHeight: "1.8" }}>
                            At TradeSphere, technology is not an add-on — it is the foundation of everything we build. Our platform is designed to deliver:
                        </p>
                        <ul className="list-unstyled mt-3 d-flex flex-column gap-2">
                            <li className="d-flex align-items-center gap-2 text-secondary">
                                <span className="text-primary fw-bold">✓</span> Real-time market data
                            </li>
                            <li className="d-flex align-items-center gap-2 text-secondary">
                                <span className="text-primary fw-bold">✓</span> Smooth order execution
                            </li>
                            <li className="d-flex align-items-center gap-2 text-secondary">
                                <span className="text-primary fw-bold">✓</span> Responsive dashboards
                            </li>
                            <li className="d-flex align-items-center gap-2 text-secondary">
                                <span className="text-primary fw-bold">✓</span> Portfolio tracking
                            </li>
                            <li className="d-flex align-items-center gap-2 text-secondary">
                                <span className="text-primary fw-bold">✓</span> Watchlists and analytics
                            </li>
                            <li className="d-flex align-items-center gap-2 text-secondary">
                                <span className="text-primary fw-bold">✓</span> Educational insights for smarter decisions
                            </li>
                        </ul>
                        <p className="text-muted mt-3 mb-0 small" style={{ lineHeight: "1.7" }}>
                            We continuously improve our products to ensure speed, reliability, and a modern investing experience across devices.
                        </p>
                    </div>
                </div>
            </div>

            {/* Empowering Investors Through Education */}
            <div className="row justify-content-center mb-5">
                <div className="col-lg-12">
                    <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="bg-success text-white rounded-3 p-2 px-3 fw-bold fs-4">📚</div>
                            <h2 className="fs-3 fw-bold text-dark mb-0">Empowering investors through education</h2>
                        </div>
                        <p className="text-secondary fs-5" style={{ lineHeight: "1.8" }}>
                            We believe that informed investors make better financial decisions. Alongside our trading platform,
                            TradeSphere focuses on creating educational resources, market explainers, and community-driven learning
                            initiatives that help users understand investing, risk management, and long-term wealth creation.
                        </p>
                    </div>
                </div>
            </div>

            {/* Mission & Vision Cards */}
            <div className="row g-4 mb-5">
                <div className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm rounded-4 p-4 p-lg-5 text-white" style={{ background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)" }}>
                        <h3 className="fs-4 fw-bold mb-3">🎯 Our mission</h3>
                        <p className="fs-5 mb-0" style={{ lineHeight: "1.8", opacity: "0.95" }}>
                            To build a transparent and technology-led financial platform that enables millions of people to participate confidently in the capital markets.
                        </p>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm rounded-4 p-4 p-lg-5 text-white" style={{ background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)" }}>
                        <h3 className="fs-4 fw-bold mb-3">👁️ Our vision</h3>
                        <p className="fs-5 mb-0" style={{ lineHeight: "1.8", opacity: "0.95" }}>
                            To become one of the most trusted investing ecosystems by combining innovation, simplicity, and investor empowerment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;