import React, { useState } from "react";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";
const DASHBOARD_URL = process.env.REACT_APP_DASHBOARD_URL || "http://localhost:3001";

function Signup() {
    const [isLogin, setIsLogin] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobile: "",
        password: "",
    });
    const [statusMessage, setStatusMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatusMessage(null);

        const endpoint = isLogin
            ? `${API_BASE_URL}/login`
            : `${API_BASE_URL}/signup`;

        const payload = isLogin
            ? { email: formData.email, password: formData.password }
            : { fullName: formData.fullName, email: formData.email, mobile: formData.mobile, password: formData.password };

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.token) {
                    sessionStorage.setItem("ts_token", data.token);
                    sessionStorage.setItem("ts_user", JSON.stringify(data.user));
                    localStorage.setItem("ts_token", data.token);
                    localStorage.setItem("ts_user", JSON.stringify(data.user));
                }

                setStatusMessage({
                    type: "success",
                    text: isLogin
                        ? `Welcome back, ${data.user?.name || "Trader"}! Opening dashboard...`
                        : "Account created successfully! Opening dashboard...",
                });
                setTimeout(() => {
                    window.location.href = DASHBOARD_URL;
                }, 1200);
            } else {
                setStatusMessage({
                    type: "danger",
                    text: data.error || "Authentication failed. Please check your credentials.",
                });
            }
        } catch (err) {
            setStatusMessage({
                type: "danger",
                text: "Cannot connect to server. Please check your network connection.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoLogin = () => {
        setStatusMessage({
            type: "success",
            text: "Opening TradeSphere Dashboard...",
        });
        setTimeout(() => {
            window.location.href = DASHBOARD_URL;
        }, 800);
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center align-items-center">
                <div className="col-lg-5 col-md-8">
                    <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5">
                        <div className="text-center mb-4">
                            <img
                                src="media/images/logo.svg"
                                alt="TradeSphere Logo"
                                style={{ height: "40px", marginBottom: "15px" }}
                            />
                            <h3 className="fw-bold text-dark">
                                {isLogin ? "Welcome Back" : "Open a Free Account"}
                            </h3>
                            <p className="text-muted small">
                                {isLogin
                                    ? "Access your live virtual trading portfolio"
                                    : "Start paper trading with ₹1,00,000 virtual balance"}
                            </p>
                        </div>

                        {/* Mode Switcher */}
                        <div className="btn-group w-100 mb-4" role="group">
                            <button
                                type="button"
                                className={`btn ${!isLogin ? "btn-primary" : "btn-outline-primary"} py-2 fw-semibold`}
                                onClick={() => { setIsLogin(false); setStatusMessage(null); }}
                            >
                                Sign Up
                            </button>
                            <button
                                type="button"
                                className={`btn ${isLogin ? "btn-primary" : "btn-outline-primary"} py-2 fw-semibold`}
                                onClick={() => { setIsLogin(true); setStatusMessage(null); }}
                            >
                                Login
                            </button>
                        </div>

                        {statusMessage && (
                            <div
                                className={`alert alert-${statusMessage.type === "success" ? "success" : "info"} text-center py-2`}
                                role="alert"
                            >
                                {statusMessage.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {!isLogin && (
                                <div className="mb-3">
                                    <label htmlFor="fullName" className="form-label small fw-semibold text-secondary">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg fs-6"
                                        id="fullName"
                                        name="fullName"
                                        placeholder="e.g. Rahul Sharma"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required={!isLogin}
                                    />
                                </div>
                            )}

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label small fw-semibold text-secondary">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    className="form-control form-control-lg fs-6"
                                    id="email"
                                    name="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {!isLogin && (
                                <div className="mb-3">
                                    <label htmlFor="mobile" className="form-label small fw-semibold text-secondary">
                                        Mobile Number
                                    </label>
                                    <input
                                        type="tel"
                                        className="form-control form-control-lg fs-6"
                                        id="mobile"
                                        name="mobile"
                                        placeholder="10-digit mobile number"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        required={!isLogin}
                                    />
                                </div>
                            )}

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label small fw-semibold text-secondary">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="form-control form-control-lg fs-6"
                                    id="password"
                                    name="password"
                                    placeholder="Enter your secure password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="d-grid mt-4">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg fw-semibold"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Processing..." : isLogin ? "Login to TradeSphere" : "Create Virtual Trading Account"}
                                </button>
                            </div>
                        </form>

                        <div className="position-relative my-4 text-center">
                            <hr />
                            <span className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted small">
                                OR
                            </span>
                        </div>

                        {/* Quick One-Click Demo Access */}
                        <div className="d-grid">
                            <button
                                type="button"
                                onClick={handleDemoLogin}
                                className="btn btn-outline-success btn-lg fw-semibold"
                            >
                                ⚡ Launch Instant Demo Mode
                            </button>
                        </div>

                        <p className="text-center mt-4 text-muted small mb-0">
                            By continuing, you agree to TradeSphere's{" "}
                            <a href="#terms" className="text-decoration-none">Terms & Conditions</a> and{" "}
                            <a href="#privacy" className="text-decoration-none">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
