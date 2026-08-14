import React, { useState } from "react";
import { API_BASE_URL } from "../utils/api";

const Login = ({ onLoginSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isSignup
      ? `${API_BASE_URL}/signup`
      : `${API_BASE_URL}/login`;

    const body = isSignup
      ? { fullName: formData.fullName, email: formData.email, password: formData.password }
      : { email: formData.email, password: formData.password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      sessionStorage.setItem("ts_token", data.token);
      sessionStorage.setItem("ts_user", JSON.stringify(data.user));
      onLoginSuccess(data.user);
    } catch (err) {
      setError("Cannot connect to server. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        {/* Logo / Brand */}
        <div style={styles.brandRow}>
          <span style={styles.brandDot}>●</span>
          <span style={styles.brandName}>TradeSphere</span>
        </div>

        <h2 style={styles.heading}>
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>
        <p style={styles.subtext}>
          {isSignup
            ? "Start with ₹1,00,000 virtual balance"
            : "Access your virtual portfolio"}
        </p>

        {/* Toggle Tabs */}
        <div style={styles.tabRow}>
          <button
            style={{ ...styles.tab, ...(isSignup ? {} : styles.activeTab) }}
            onClick={() => { setIsSignup(false); setError(""); }}
          >
            Login
          </button>
          <button
            style={{ ...styles.tab, ...(isSignup ? styles.activeTab : {}) }}
            onClick={() => { setIsSignup(true); setError(""); }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {isSignup && (
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                style={styles.input}
                type="text"
                name="fullName"
                placeholder="e.g. Rahul Sharma"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p style={styles.errorMsg}>{error}</p>}

          <button style={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? "Please wait..." : isSignup ? "Create Account" : "Login to Dashboard"}
          </button>
        </form>

        <p style={styles.footerNote}>
          By continuing, you agree to TradeSphere's Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    padding: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "24px",
  },
  brandDot: {
    color: "#2563eb",
    fontSize: "20px",
    lineHeight: 1,
  },
  brandName: {
    fontWeight: "800",
    fontSize: "1.2rem",
    color: "#0f172a",
    letterSpacing: "-0.3px",
  },
  heading: {
    fontSize: "1.6rem",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 4px 0",
  },
  subtext: {
    color: "#64748b",
    fontSize: "0.9rem",
    margin: "0 0 24px 0",
  },
  tabRow: {
    display: "flex",
    background: "#f1f5f9",
    borderRadius: "8px",
    padding: "4px",
    marginBottom: "24px",
    gap: "4px",
  },
  tab: {
    flex: 1,
    padding: "8px",
    border: "none",
    borderRadius: "6px",
    background: "transparent",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9rem",
    color: "#64748b",
    transition: "all 0.2s",
  },
  activeTab: {
    background: "#fff",
    color: "#0f172a",
    boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "0.82rem",
    fontWeight: "600",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    padding: "12px 14px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "0.95rem",
    color: "#0f172a",
    outline: "none",
    transition: "border-color 0.2s",
  },
  errorMsg: {
    color: "#dc2626",
    fontSize: "0.85rem",
    margin: 0,
    padding: "10px 12px",
    background: "#fef2f2",
    borderRadius: "6px",
    border: "1px solid #fecaca",
  },
  submitBtn: {
    padding: "13px",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "4px",
    transition: "opacity 0.2s",
  },
  footerNote: {
    textAlign: "center",
    fontSize: "0.75rem",
    color: "#94a3b8",
    marginTop: "20px",
    marginBottom: 0,
  },
};

export default Login;
