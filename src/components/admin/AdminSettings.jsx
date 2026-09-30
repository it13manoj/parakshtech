import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import API from "../../Config/API";

export const AdminSettings = () => {
  // Current user info from localStorage or API
  const rawUser = localStorage.getItem("pt_admin_user");
  const initialUser = rawUser ? JSON.parse(rawUser) : { name: "Administrator", email: "admin@parakshtech.com" };

  const [user, setUser] = useState(initialUser);
  const [profileForm, setProfileForm] = useState({
    name: initialUser.name || "Administrator",
    email: initialUser.email || "admin@parakshtech.com",
  });

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // UI state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [savingPassword, setSavingPassword] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [runningMigration, setRunningMigration] = useState(false);

  const [toastMsg, setToastMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [schemaStatus, setSchemaStatus] = useState(null);

  const token = localStorage.getItem("pt_admin_token");
  const authHeaders = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  // Load latest profile & schema diagnostics
  const loadDiagnostics = async () => {
    try {
      // 1. Fetch current me
      const meRes = await axios.get(`${API.BASE_URL}auth/me`, authHeaders);
      if (meRes.data?.user) {
        setUser(meRes.data.user);
        setProfileForm({
          name: meRes.data.user.name,
          email: meRes.data.user.email,
        });
      }
    } catch {
      // fallback to cached
    }

    try {
      // 2. Fetch schema status
      const schemaRes = await axios.get(`${API.BASE_URL}admin/system/schema-status`, authHeaders);
      if (schemaRes.data?.success) {
        setSchemaStatus(schemaRes.data);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadDiagnostics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Password strength calculator
  const passwordStrength = useMemo(() => {
    const p = passwordForm.newPassword;
    if (!p) return { score: 0, text: "", color: "#64748b" };
    let score = 0;
    if (p.length >= 6) score += 1;
    if (p.length >= 10) score += 1;
    if (/[A-Z]/.test(p)) score += 1;
    if (/[0-9]/.test(p)) score += 1;
    if (/[^A-Za-z0-9]/.test(p)) score += 1;

    if (score <= 2) return { score: 25, text: "Weak", color: "#f87171" };
    if (score <= 3) return { score: 60, text: "Medium", color: "#fbbf24" };
    return { score: 100, text: "Strong", color: "#34d399" };
  }, [passwordForm.newPassword]);

  // Handle Password Update
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setToastMsg("");

    if (!passwordForm.currentPassword) {
      setErrorMsg("Please enter your current password.");
      return;
    }

    if (!passwordForm.newPassword) {
      setErrorMsg("Please enter a new password.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters long.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMsg("New password and confirm password do not match.");
      return;
    }

    try {
      setSavingPassword(true);
      const res = await axios.put(
        `${API.BASE_URL}auth/password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        authHeaders
      );

      if (res.data?.success) {
        setToastMsg(res.data.message || "Password updated successfully!");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => setToastMsg(""), 5000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update password. Please check your current password.");
    } finally {
      setSavingPassword(false);
    }
  };

  // Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setToastMsg("");

    try {
      setSavingProfile(true);
      const res = await axios.put(
        `${API.BASE_URL}auth/profile`,
        {
          name: profileForm.name,
          email: profileForm.email,
        },
        authHeaders
      );

      if (res.data?.success) {
        const updatedUser = res.data.user;
        setUser(updatedUser);
        localStorage.setItem("pt_admin_user", JSON.stringify(updatedUser));
        setToastMsg("Admin profile information updated successfully!");
        setTimeout(() => setToastMsg(""), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update profile details.");
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Run Migration
  const handleRunMigration = async () => {
    try {
      setRunningMigration(true);
      setErrorMsg("");
      setToastMsg("");

      const res = await axios.post(`${API.BASE_URL}admin/system/migrate`, {}, authHeaders);
      if (res.data?.success) {
        setToastMsg("Database auto-migration completed! All tables synced and altered.");
        await loadDiagnostics();
        setTimeout(() => setToastMsg(""), 4500);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Migration process encountered an issue.");
    } finally {
      setRunningMigration(false);
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#ffffff", margin: 0 }}>
            Admin Account & Security Settings
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: "4px 0 0 0" }}>
            Configure admin credentials, update login password, and inspect database schema integrity.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunMigration}
          disabled={runningMigration}
          style={{
            background: "rgba(30, 41, 59, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            color: "#ffffff",
            padding: "9px 18px",
            borderRadius: "10px",
            fontWeight: "600",
            fontSize: "0.85rem",
            cursor: runningMigration ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <i className={`fas fa-database ${runningMigration ? "fa-spin" : ""}`} style={{ color: "#38bdf8" }} />
          <span>{runningMigration ? "Running Migration..." : "Verify / Alter Schema"}</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            color: "#34d399",
            padding: "12px 18px",
            borderRadius: "10px",
            marginBottom: "20px",
            fontSize: "0.88rem",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.2)",
          }}
        >
          <i className="fas fa-check-circle" style={{ fontSize: "1.1rem" }} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div
          style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#f87171",
            padding: "12px 18px",
            borderRadius: "10px",
            marginBottom: "20px",
            fontSize: "0.88rem",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <i className="fas fa-exclamation-triangle" style={{ fontSize: "1.1rem" }} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="row g-4">
        {/* ── CARD 1: UPDATE LOGIN PASSWORD ── */}
        <div className="col-12 col-lg-7">
          <div
            style={{
              background: "rgba(30, 41, 59, 0.45)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "18px",
              padding: "28px",
              height: "100%",
            }}
          >
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "rgba(245, 32, 41, 0.15)",
                  color: "var(--pt-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                }}
              >
                <i className="fas fa-key" />
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#ffffff", margin: 0 }}>
                  Update Admin Password
                </h3>
                <span style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
                  Ensure your account uses a strong, unique password to prevent unauthorized access.
                </span>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} style={{ marginTop: "24px" }}>
              {/* Current Password */}
              <div style={{ marginBottom: "18px" }}>
                <label
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    color: "#cbd5e1",
                    marginBottom: "6px",
                    display: "block",
                  }}
                >
                  Current Password *
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    placeholder="Enter current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "11px 44px 11px 14px",
                      background: "rgba(15, 23, 42, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "10px",
                      color: "#ffffff",
                      fontSize: "0.88rem",
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={{
                      position: "absolute",
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      color: "#94a3b8",
                      cursor: "pointer",
                      padding: 0,
                    }}
                    title={showCurrentPassword ? "Hide password" : "Show password"}
                  >
                    <i className={`fas ${showCurrentPassword ? "fa-eye-slash" : "fa-eye"}`} />
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div style={{ marginBottom: "18px" }}>
                <label
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    color: "#cbd5e1",
                    marginBottom: "6px",
                    display: "block",
                  }}
                >
                  New Password *
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    placeholder="At least 6 characters"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "11px 44px 11px 14px",
                      background: "rgba(15, 23, 42, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "10px",
                      color: "#ffffff",
                      fontSize: "0.88rem",
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: "absolute",
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      color: "#94a3b8",
                      cursor: "pointer",
                      padding: 0,
                    }}
                    title={showNewPassword ? "Hide password" : "Show password"}
                  >
                    <i className={`fas ${showNewPassword ? "fa-eye-slash" : "fa-eye"}`} />
                  </button>
                </div>

                {/* Password strength meter */}
                {passwordForm.newPassword && (
                  <div style={{ marginTop: "8px" }}>
                    <div
                      style={{
                        height: "4px",
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "2px",
                        overflow: "hidden",
                        marginBottom: "4px",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${passwordStrength.score}%`,
                          background: passwordStrength.color,
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                    <div style={{ fontSize: "0.74rem", color: passwordStrength.color, fontWeight: "600" }}>
                      Strength: {passwordStrength.text}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    color: "#cbd5e1",
                    marginBottom: "6px",
                    display: "block",
                  }}
                >
                  Confirm New Password *
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Re-type new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "11px 44px 11px 14px",
                      background: "rgba(15, 23, 42, 0.6)",
                      border:
                        passwordForm.confirmPassword &&
                        passwordForm.newPassword !== passwordForm.confirmPassword
                          ? "1px solid rgba(239, 68, 68, 0.5)"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "10px",
                      color: "#ffffff",
                      fontSize: "0.88rem",
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      color: "#94a3b8",
                      cursor: "pointer",
                      padding: 0,
                    }}
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`} />
                  </button>
                </div>

                {passwordForm.confirmPassword && (
                  <div style={{ marginTop: "6px", fontSize: "0.76rem" }}>
                    {passwordForm.newPassword === passwordForm.confirmPassword ? (
                      <span style={{ color: "#34d399", fontWeight: "600" }}>
                        <i className="fas fa-check-circle me-1" /> Passwords match
                      </span>
                    ) : (
                      <span style={{ color: "#f87171", fontWeight: "600" }}>
                        <i className="fas fa-times-circle me-1" /> Passwords do not match
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="submit"
                  disabled={savingPassword}
                  style={{
                    background: "linear-gradient(135deg, var(--pt-primary) 0%, #b8141b 100%)",
                    color: "#ffffff",
                    border: "none",
                    padding: "11px 26px",
                    borderRadius: "10px",
                    fontWeight: "700",
                    fontSize: "0.88rem",
                    cursor: savingPassword ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 6px 20px -3px rgba(245, 32, 41, 0.4)",
                  }}
                >
                  {savingPassword && <i className="fas fa-spinner fa-spin" />}
                  <span>{savingPassword ? "Updating..." : "Update Password"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ── CARD 2: PROFILE DETAILS & DATABASE INFO ── */}
        <div className="col-12 col-lg-5">
          <div className="d-flex flex-column gap-4">
            {/* Admin Profile Details */}
            <div
              style={{
                background: "rgba(30, 41, 59, 0.45)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "18px",
                padding: "24px",
              }}
            >
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "rgba(59, 130, 246, 0.15)",
                    color: "#60a5fa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.1rem",
                  }}
                >
                  <i className="fas fa-user-shield" />
                </div>
                <div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#ffffff", margin: 0 }}>
                    Profile Credentials
                  </h4>
                  <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                    Administrator identity & notifications
                  </span>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} style={{ marginTop: "16px" }}>
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "4px", display: "block" }}>
                    Administrator Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      background: "rgba(15, 23, 42, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "0.85rem",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "18px" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "4px", display: "block" }}>
                    Login Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      background: "rgba(15, 23, 42, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "0.85rem",
                    }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#10b981",
                      background: "rgba(16, 185, 129, 0.1)",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontWeight: "700",
                    }}
                  >
                    Role: {user.role?.toUpperCase() || "ADMIN"}
                  </span>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    style={{
                      background: "rgba(59, 130, 246, 0.2)",
                      color: "#60a5fa",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontWeight: "600",
                      fontSize: "0.82rem",
                      cursor: savingProfile ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {savingProfile && <i className="fas fa-spinner fa-spin" />}
                    <span>Save Profile</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Database & Schema Status */}
            <div
              style={{
                background: "rgba(30, 41, 59, 0.45)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "18px",
                padding: "24px",
              }}
            >
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "#10b981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.1rem",
                  }}
                >
                  <i className="fas fa-server" />
                </div>
                <div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#ffffff", margin: 0 }}>
                    MySQL Database Status
                  </h4>
                  <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                    Engine: MySQL 8.0 • ORM: Sequelize
                  </span>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "10px",
                  padding: "14px",
                  fontSize: "0.8rem",
                  color: "#cbd5e1",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <div className="d-flex justify-content-between">
                  <span style={{ color: "#94a3b8" }}>Database Name:</span>
                  <span style={{ fontWeight: "600", color: "#ffffff", fontFamily: "monospace" }}>
                    {schemaStatus?.database || "parakshtech_db"}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span style={{ color: "#94a3b8" }}>Active Tables:</span>
                  <span style={{ fontWeight: "700", color: "#34d399" }}>
                    {schemaStatus?.tablesCount || 10} Tables Synchronized
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span style={{ color: "#94a3b8" }}>Auto-Alter Status:</span>
                  <span style={{ fontWeight: "600", color: "#60a5fa" }}>Enabled (alter: true)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
