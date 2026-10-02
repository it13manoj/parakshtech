import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import API from "../../Config/API";
import logo from "../../assets/images/logo.png";

export const AdminLogin = () => {
  const [email, setEmail] = useState("admin@parakshtech.com");
  const [password, setPassword] = useState("Admin@123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API.BASE_URL}auth/login`, {
        email: email.trim(),
        password,
      });

      if (res.data?.success && res.data?.token) {
        localStorage.setItem("pt_admin_token", res.data.token);
        localStorage.setItem("pt_admin_user", JSON.stringify(res.data.user || {}));
        navigate("/admin/dashboard");
      } else {
        setError(res.data?.message || "Invalid login credentials");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to connect to backend API. Ensure server is running on port 4800."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0e17 0%, #111827 50%, #1e1b4b 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 40px rgba(245, 32, 41, 0.15)",
          padding: "40px 36px",
          color: "#ffffff",
        }}
      >
        {/* Brand Header */}
        <div className="text-center mb-4">
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              textDecoration: "none",
              marginBottom: "16px",
            }}
          >
            <img
              src={logo}
              alt="ParakshTech"
              style={{
                width: "44px",
                height: "44px",
                objectFit: "contain",
                filter: "drop-shadow(0 2px 10px rgba(245, 32, 41, 0.4))",
              }}
            />
            <span style={{ fontSize: "1.45rem", fontWeight: "800", color: "#ffffff" }}>
              <span style={{ color: "var(--pt-primary)" }}>PARAKSH</span>TECH
            </span>
          </Link>
          <div
            style={{
              fontSize: "0.8rem",
              fontWeight: "700",
              color: "var(--pt-primary)",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            Admin Management Portal
          </div>
          <p style={{ color: "#94a3b8", fontSize: "0.88rem", marginTop: "6px" }}>
            Sign in to manage portfolio, services, jobs, and leads
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              color: "#fca5a5",
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "0.85rem",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <i className="fas fa-exclamation-circle" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label
              style={{
                fontSize: "0.82rem",
                fontWeight: "600",
                color: "#cbd5e1",
                marginBottom: "6px",
                display: "block",
              }}
            >
              Admin Email
            </label>
            <div style={{ position: "relative" }}>
              <i
                className="fas fa-envelope"
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#64748b",
                  fontSize: "0.9rem",
                }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@parakshtech.com"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 44px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  background: "rgba(15, 23, 42, 0.6)",
                  color: "#ffffff",
                  fontSize: "0.92rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              style={{
                fontSize: "0.82rem",
                fontWeight: "600",
                color: "#cbd5e1",
                marginBottom: "6px",
                display: "block",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <i
                className="fas fa-lock"
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#64748b",
                  fontSize: "0.9rem",
                }}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%",
                  padding: "12px 44px 12px 44px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  background: "rgba(15, 23, 42, 0.6)",
                  color: "#ffffff",
                  fontSize: "0.92rem",
                  outline: "none",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#64748b",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, var(--pt-primary) 0%, #b8141b 100%)",
              color: "#ffffff",
              fontSize: "0.95rem",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 8px 24px -4px rgba(245, 32, 41, 0.4)",
              transition: "transform 0.2s, box-shadow 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <i className="fas fa-arrow-right" />
              </>
            )}
          </button>
        </form>

        {/* Credentials Tip Card */}
        <div
          style={{
            marginTop: "24px",
            padding: "14px",
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px dashed rgba(255, 255, 255, 0.12)",
            fontSize: "0.78rem",
            color: "#94a3b8",
            textAlign: "center",
          }}
        >
          <div style={{ fontWeight: "600", color: "#cbd5e1", marginBottom: "4px" }}>
            <i className="fas fa-key me-1" style={{ color: "var(--pt-primary)" }} /> Default
            Credentials:
          </div>
          <div>
            Email: <strong style={{ color: "#ffffff" }}>admin@parakshtech.com</strong>
          </div>
          <div>
            Password: <strong style={{ color: "#ffffff" }}>Admin@123</strong>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link
            to="/"
            style={{
              color: "#94a3b8",
              fontSize: "0.84rem",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <i className="fas fa-arrow-left" /> Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

