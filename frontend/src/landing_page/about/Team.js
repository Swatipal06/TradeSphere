import React from "react";

function Team() {
    return (
        <div className="container py-4 mb-5">
            {/* Meet the Founder Section */}
            <div className="row text-center mb-5">
                <div className="col-12">
                    <span className="badge bg-secondary-subtle text-secondary px-3 py-2 rounded-pill fs-6 fw-semibold mb-3">
                        Leadership
                    </span>
                    <h2 className="display-6 fw-bold text-dark">Meet the founder</h2>
                </div>
            </div>

            <div className="row justify-content-center align-items-center mb-5">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                        <div className="row align-items-center g-4">
                            <div className="col-md-4 text-center">
                                <div
                                    className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white shadow"
                                    style={{ width: "120px", height: "120px", fontSize: "2.5rem", fontWeight: 700 }}
                                >
                                    SP
                                </div>
                                <h4 className="fw-bold mt-3 mb-1 text-dark">Swati Pal</h4>
                                <p className="text-primary fw-semibold mb-2">Founder & CEO</p>
                            </div>
                            <div className="col-md-8">
                                <p className="text-secondary mb-3" style={{ lineHeight: "1.8", fontSize: "1.05rem" }}>
                                    TradeSphere began as a project inspired by the idea that great technology can simplify finance for everyone. With a passion for full-stack development, product design, and financial technology, Swati is focused on building a platform that prioritizes user experience, transparency, and continuous innovation.
                                </p>
                                <div className="d-flex gap-3">
                                    <a href="https://github.com/Swatipal06" target="_blank" rel="noreferrer" className="btn btn-outline-dark btn-sm rounded-pill px-3">
                                        GitHub
                                    </a>
                                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm rounded-pill px-3">
                                        LinkedIn
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* The Journey Has Just Begun */}
            <div className="row justify-content-center text-center mt-5">
                <div className="col-lg-9">
                    <div className="card border-0 rounded-4 p-4 p-md-5 text-white shadow-lg" style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}>
                        <h2 className="fw-bold mb-3">The journey has just begun</h2>
                        <p className="fs-5 mb-4 text-slate-300" style={{ lineHeight: "1.8", color: "#cbd5e1" }}>
                            TradeSphere is more than a trading platform — it is a step toward a future where investing is simple, inclusive, and powered by technology.
                        </p>
                        <p className="lead fw-semibold text-primary mb-4" style={{ color: "#60a5fa" }}>
                            And this is only the beginning.
                        </p>
                        <div>
                            <a href="/signup" className="btn btn-primary btn-lg px-4 rounded-pill fw-semibold">
                                Join TradeSphere Today 🚀
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Team;