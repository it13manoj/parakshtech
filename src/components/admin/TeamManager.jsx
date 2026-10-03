import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import API from "../../Config/API";

export const TeamManager = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const initialForm = {
    name: "",
    designation: "",
    bio: "",
    order: 0,
    social: {
      linkedin: "",
      github: "",
      twitter: "",
    },
    image: "",
    existingImage: "",
  };

  const [form, setForm] = useState(initialForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const token = localStorage.getItem("pt_admin_token");
  const authHeaders = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  // Helper for safe social parsing
  const getCleanSocial = useCallback((socialRaw) => {
    if (!socialRaw) return { linkedin: "", github: "", twitter: "" };
    let parsed = socialRaw;
    if (typeof socialRaw === "string") {
      try {
        parsed = JSON.parse(socialRaw);
      } catch {
        return { linkedin: "", github: "", twitter: "" };
      }
    }
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return { linkedin: "", github: "", twitter: "" };
    }
    return {
      linkedin: typeof parsed.linkedin === "string" ? parsed.linkedin.trim() : "",
      github: typeof parsed.github === "string" ? parsed.github.trim() : "",
      twitter: typeof parsed.twitter === "string" ? parsed.twitter.trim() : "",
    };
  }, []);

  // Helper for image URL
  const getImageDisplay = useCallback((img) => {
    if (!img || typeof img !== "string") return "";
    const clean = img.trim();
    if (!clean) return "";
    if (
      clean.startsWith("http://") ||
      clean.startsWith("https://") ||
      clean.startsWith("data:") ||
      clean.startsWith("blob:")
    ) {
      return clean;
    }
    if (clean.startsWith("/")) {
      return clean;
    }
    return `${API.BASE_URL_IMAGES}${clean}`;
  }, []);

  // Load team members
  const loadTeam = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await axios.get(`${API.BASE_URL}admin/team`, authHeaders);
      if (res.data?.success && Array.isArray(res.data.data)) {
        setMembers(res.data.data);
      } else {
        const fallback = await axios.get(`${API.BASE_URL}team`);
        if (fallback.data?.success && Array.isArray(fallback.data.data)) {
          setMembers(fallback.data.data);
        } else {
          setMembers([]);
        }
      }
    } catch {
      try {
        const fallback = await axios.get(`${API.BASE_URL}team`);
        if (fallback.data?.success && Array.isArray(fallback.data.data)) {
          setMembers(fallback.data.data);
        } else {
          setMembers([]);
        }
      } catch {
        setErrorMsg("Failed to load team members from database. Please check connection.");
        setMembers([]);
      }
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  // Safe members list
  const memberList = useMemo(() => {
    return Array.isArray(members) ? members.filter((m) => m && typeof m === "object") : [];
  }, [members]);

  // Filtered members
  const filteredMembers = useMemo(() => {
    if (!search.trim()) return memberList;
    const q = search.toLowerCase();
    return memberList.filter((m) => {
      const name = String(m?.name || "").toLowerCase();
      const designation = String(m?.designation || "").toLowerCase();
      const bio = String(m?.bio || "").toLowerCase();
      return name.includes(q) || designation.includes(q) || bio.includes(q);
    });
  }, [memberList, search]);

  // Metrics
  const totalCount = memberList.length;
  const activeCount = memberList.filter(
    (m) => m.isActive === true || m.isActive === 1 || m.isActive === "1"
  ).length;
  const leadershipCount =
    memberList.filter((m) => {
      const d = String(m?.designation || "").toLowerCase();
      return (
        d.includes("ceo") ||
        d.includes("founder") ||
        d.includes("manager") ||
        d.includes("lead") ||
        d.includes("director") ||
        d.includes("head")
      );
    }).length || totalCount;

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditId(null);
    setForm(initialForm);
    setSelectedFile(null);
    setPreviewUrl("");
    setErrorMsg("");
    setSuccessMsg("");
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (m) => {
    if (!m) return;
    setEditId(m.id);
    const social = getCleanSocial(m.social);

    setForm({
      name: String(m.name || ""),
      designation: String(m.designation || ""),
      bio: String(m.bio || ""),
      order: Number(m.order) || 0,
      social: {
        linkedin: social.linkedin || "",
        github: social.github || "",
        twitter: social.twitter || "",
      },
      existingImage: typeof m.image === "string" ? m.image : "",
      image: "",
    });

    setSelectedFile(null);
    setPreviewUrl("");
    setErrorMsg("");
    setSuccessMsg("");
    setShowModal(true);
  };

  // Image select
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!form.name.trim() || !form.designation.trim()) {
      setErrorMsg("Name and designation are required fields.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("designation", form.designation.trim());
      formData.append("bio", form.bio.trim());
      formData.append("order", String(form.order || 0));
      formData.append("social", JSON.stringify(form.social || {}));

      if (selectedFile) {
        formData.append("image", selectedFile);
      } else if (form.existingImage) {
        formData.append("image", form.existingImage);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (editId) {
        await axios.put(`${API.BASE_URL}admin/team/${editId}`, formData, config);
        setSuccessMsg("Team member updated successfully!");
      } else {
        await axios.post(`${API.BASE_URL}admin/team`, formData, config);
        setSuccessMsg("Team member added successfully!");
      }

      await loadTeam();
      setTimeout(() => setShowModal(false), 800);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to save team member");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Status
  const handleToggle = async (id) => {
    try {
      await axios.patch(`${API.BASE_URL}admin/team/${id}/toggle`, {}, authHeaders);
      setMembers((prev) =>
        (Array.isArray(prev) ? prev : []).map((m) =>
          m.id === id
            ? { ...m, isActive: !(m.isActive === true || m.isActive === 1 || m.isActive === "1") }
            : m
        )
      );
    } catch {
      setErrorMsg("Failed to toggle status");
    }
  };

  // Delete Member
  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await axios.delete(`${API.BASE_URL}admin/team/${deleteConfirmId}`, authHeaders);
      setMembers((prev) =>
        (Array.isArray(prev) ? prev : []).filter((m) => m.id !== deleteConfirmId)
      );
      setDeleteConfirmId(null);
    } catch {
      setErrorMsg("Failed to remove team member");
    }
  };

  return (
    <div>
      {/* Top Action Bar */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#ffffff", margin: 0 }}>
            Team & Leadership
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: "4px 0 0 0" }}>
            Manage leadership and team profiles displayed in the Expert People section and About page.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          style={{
            background: "linear-gradient(135deg, var(--pt-primary) 0%, #b8141b 100%)",
            color: "#ffffff",
            border: "none",
            padding: "11px 22px",
            borderRadius: "12px",
            fontWeight: "700",
            fontSize: "0.88rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 6px 20px -3px rgba(245, 32, 41, 0.4)",
          }}
        >
          <i className="fas fa-plus-circle" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-4">
          <div
            style={{
              background: "rgba(30, 41, 59, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(245, 32, 41, 0.15)",
                color: "var(--pt-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
              }}
            >
              <i className="fas fa-user-friends" />
            </div>
            <div>
              <div style={{ color: "#94a3b8", fontSize: "0.82rem", fontWeight: "500" }}>
                Total Profiles
              </div>
              <div style={{ color: "#ffffff", fontSize: "1.45rem", fontWeight: "800" }}>
                {totalCount}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4">
          <div
            style={{
              background: "rgba(30, 41, 59, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(16, 185, 129, 0.15)",
                color: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
              }}
            >
              <i className="fas fa-user-check" />
            </div>
            <div>
              <div style={{ color: "#94a3b8", fontSize: "0.82rem", fontWeight: "500" }}>
                Active on Website
              </div>
              <div style={{ color: "#ffffff", fontSize: "1.45rem", fontWeight: "800" }}>
                {activeCount}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4">
          <div
            style={{
              background: "rgba(30, 41, 59, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(59, 130, 246, 0.15)",
                color: "#3b82f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
              }}
            >
              <i className="fas fa-crown" />
            </div>
            <div>
              <div style={{ color: "#94a3b8", fontSize: "0.82rem", fontWeight: "500" }}>
                Leadership & Staff
              </div>
              <div style={{ color: "#ffffff", fontSize: "1.45rem", fontWeight: "800" }}>
                {leadershipCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div
        style={{
          background: "rgba(30, 41, 59, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "14px",
          padding: "14px 18px",
          marginBottom: "24px",
        }}
      >
        <div style={{ position: "relative", maxWidth: "420px" }}>
          <i
            className="fas fa-search"
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#64748b",
              fontSize: "0.85rem",
            }}
          />
          <input
            type="text"
            placeholder="Search by name, designation, bio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 14px 9px 38px",
              background: "rgba(15, 23, 42, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "10px",
              color: "#ffffff",
              fontSize: "0.85rem",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Global Error Notice if any */}
      {errorMsg && !showModal && (
        <div
          style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#f87171",
            padding: "12px 18px",
            borderRadius: "12px",
            marginBottom: "20px",
            fontSize: "0.88rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <i className="fas fa-exclamation-circle me-2" />
            {errorMsg}
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg("")}
            style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Team Cards Grid */}
      {loading ? (
        <div className="text-center py-5" style={{ color: "#94a3b8" }}>
          <i className="fas fa-spinner fa-spin fa-2x mb-3 d-block" style={{ color: "var(--pt-primary)" }} />
          Loading team members from database...
        </div>
      ) : filteredMembers.length === 0 ? (
        <div
          style={{
            background: "rgba(30, 41, 59, 0.3)",
            border: "1px dashed rgba(255, 255, 255, 0.15)",
            borderRadius: "16px",
            padding: "50px 20px",
            textAlign: "center",
          }}
        >
          <i className="fas fa-user-friends fa-3x mb-3" style={{ color: "#475569" }} />
          <h4 style={{ color: "#ffffff", fontWeight: "700" }}>No team members found</h4>
          <p style={{ color: "#94a3b8", fontSize: "0.88rem", maxWidth: "400px", margin: "0 auto 16px" }}>
            {search ? "No members match your search filter." : "Click below to add your first team profile."}
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            style={{
              background: "var(--pt-primary)",
              color: "#fff",
              border: "none",
              padding: "9px 20px",
              borderRadius: "10px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Add Member
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {filteredMembers.map((m, idx) => {
            const social = getCleanSocial(m?.social);
            const imgDisplay = getImageDisplay(m?.image);
            const isActive = m?.isActive === true || m?.isActive === 1 || m?.isActive === "1";

            return (
              <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={m?.id || idx}>
                <div
                  style={{
                    background: "rgba(30, 41, 59, 0.45)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "16px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    transition: "all 0.25s ease",
                    textAlign: "center",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(245, 32, 41, 0.4)";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Top Status & Order */}
                  <div
                    style={{
                      padding: "12px 14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "rgba(15, 23, 42, 0.4)",
                    }}
                  >
                    <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: "600" }}>
                      Order: #{m?.order ?? 0}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggle(m.id)}
                      style={{
                        padding: "2px 8px",
                        borderRadius: "20px",
                        fontSize: "0.7rem",
                        fontWeight: "700",
                        border: "none",
                        cursor: "pointer",
                        background: isActive
                          ? "rgba(16, 185, 129, 0.15)"
                          : "rgba(239, 68, 68, 0.15)",
                        color: isActive ? "#10b981" : "#ef4444",
                      }}
                    >
                      {isActive ? "Active" : "Hidden"}
                    </button>
                  </div>

                  {/* Avatar Area */}
                  <div style={{ padding: "20px 20px 10px" }}>
                    <div
                      style={{
                        width: "90px",
                        height: "90px",
                        borderRadius: "50%",
                        margin: "0 auto 14px",
                        background: "#0f172a",
                        border: "2px solid rgba(245, 32, 41, 0.3)",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {imgDisplay ? (
                        <img
                          src={imgDisplay}
                          alt={m?.name || "Member"}
                          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <i className="fas fa-user fa-2x" style={{ color: "#64748b" }} />
                      )}
                    </div>

                    <h4
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: "4px",
                      }}
                    >
                      {m?.name || "Unnamed"}
                    </h4>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--pt-primary)",
                        fontWeight: "600",
                        marginBottom: "10px",
                      }}
                    >
                      {m?.designation || "Staff"}
                    </div>

                    {m?.bio && (
                      <p
                        style={{
                          color: "#94a3b8",
                          fontSize: "0.78rem",
                          lineHeight: "1.4",
                          marginBottom: "12px",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {m.bio}
                      </p>
                    )}

                    {/* Social Icons */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "8px",
                        marginBottom: "12px",
                        minHeight: "28px",
                      }}
                    >
                      {social.linkedin && social.linkedin !== "#" && (
                        <a
                          href={social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="LinkedIn"
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "6px",
                            background: "rgba(15, 23, 42, 0.8)",
                            color: "#60a5fa",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.78rem",
                            textDecoration: "none",
                          }}
                        >
                          <i className="fab fa-linkedin-in" />
                        </a>
                      )}
                      {social.github && social.github !== "#" && (
                        <a
                          href={social.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="GitHub"
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "6px",
                            background: "rgba(15, 23, 42, 0.8)",
                            color: "#cbd5e1",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.78rem",
                            textDecoration: "none",
                          }}
                        >
                          <i className="fab fa-github" />
                        </a>
                      )}
                      {social.twitter && social.twitter !== "#" && (
                        <a
                          href={social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Twitter"
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "6px",
                            background: "rgba(15, 23, 42, 0.8)",
                            color: "#38bdf8",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.78rem",
                            textDecoration: "none",
                          }}
                        >
                          <i className="fab fa-twitter" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      marginTop: "auto",
                      padding: "12px 14px",
                      borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(m)}
                      style={{
                        flex: 1,
                        background: "rgba(59, 130, 246, 0.15)",
                        color: "#60a5fa",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        fontSize: "0.78rem",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      <i className="fas fa-edit me-1" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(m.id)}
                      style={{
                        flex: 1,
                        background: "rgba(239, 68, 68, 0.15)",
                        color: "#f87171",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        fontSize: "0.78rem",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      <i className="fas fa-trash me-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal for Create / Edit ── */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(6px)",
            zIndex: 1050,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#1e293b",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "600px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
              overflow: "hidden",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(15, 23, 42, 0.6)",
              }}
            >
              <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#ffffff", margin: 0 }}>
                {editId ? "Edit Team Member" : "Add Team Member"}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
              {errorMsg && (
                <div
                  style={{
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#f87171",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    marginBottom: "18px",
                    fontSize: "0.85rem",
                  }}
                >
                  <i className="fas fa-exclamation-circle me-2" />
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div
                  style={{
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    color: "#34d399",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    marginBottom: "18px",
                    fontSize: "0.85rem",
                  }}
                >
                  <i className="fas fa-check-circle me-2" />
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Name */}
                  <div className="col-12 col-md-7">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Henderson"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        background: "rgba(15, 23, 42, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "10px",
                        color: "#ffffff",
                        fontSize: "0.88rem",
                      }}
                    />
                  </div>

                  {/* Designation */}
                  <div className="col-12 col-md-5">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Designation / Role *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lead Architect"
                      value={form.designation}
                      onChange={(e) => setForm({ ...form, designation: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        background: "rgba(15, 23, 42, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "10px",
                        color: "#ffffff",
                        fontSize: "0.88rem",
                      }}
                    />
                  </div>

                  {/* Bio */}
                  <div className="col-12">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Short Bio
                    </label>
                    <textarea
                      rows={2}
                      placeholder="1-2 sentences on their background or expertise..."
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        background: "rgba(15, 23, 42, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "10px",
                        color: "#ffffff",
                        fontSize: "0.88rem",
                      }}
                    />
                  </div>

                  {/* Display Order */}
                  <div className="col-12 col-md-4">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={form.order}
                      onChange={(e) => setForm({ ...form, order: Number(e.target.value) || 0 })}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        background: "rgba(15, 23, 42, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        color: "#ffffff",
                        fontSize: "0.85rem",
                      }}
                    />
                  </div>

                  {/* Photo Upload */}
                  <div className="col-12 col-md-8">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Photo Avatar
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{
                        width: "100%",
                        padding: "7px",
                        background: "rgba(15, 23, 42, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        color: "#cbd5e1",
                        fontSize: "0.82rem",
                      }}
                    />
                    {(previewUrl || form.existingImage) && (
                      <div style={{ marginTop: "10px" }}>
                        <img
                          src={previewUrl || getImageDisplay(form.existingImage)}
                          alt="Preview"
                          style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            objectPosition: "top center",
                            border: "2px solid var(--pt-primary)",
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="col-12">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "8px", display: "block" }}>
                      Social Profiles (Optional)
                    </label>
                    <div className="row g-2">
                      <div className="col-12 col-md-4">
                        <div style={{ position: "relative" }}>
                          <i
                            className="fab fa-linkedin"
                            style={{
                              position: "absolute",
                              left: "12px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#60a5fa",
                              fontSize: "0.85rem",
                            }}
                          />
                          <input
                            type="text"
                            placeholder="LinkedIn URL"
                            value={form.social?.linkedin || ""}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                social: { ...(form.social || {}), linkedin: e.target.value },
                              })
                            }
                            style={{
                              width: "100%",
                              padding: "8px 12px 8px 34px",
                              background: "rgba(15, 23, 42, 0.6)",
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                              borderRadius: "8px",
                              color: "#ffffff",
                              fontSize: "0.82rem",
                            }}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-4">
                        <div style={{ position: "relative" }}>
                          <i
                            className="fab fa-github"
                            style={{
                              position: "absolute",
                              left: "12px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#cbd5e1",
                              fontSize: "0.85rem",
                            }}
                          />
                          <input
                            type="text"
                            placeholder="GitHub URL"
                            value={form.social?.github || ""}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                social: { ...(form.social || {}), github: e.target.value },
                              })
                            }
                            style={{
                              width: "100%",
                              padding: "8px 12px 8px 34px",
                              background: "rgba(15, 23, 42, 0.6)",
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                              borderRadius: "8px",
                              color: "#ffffff",
                              fontSize: "0.82rem",
                            }}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-4">
                        <div style={{ position: "relative" }}>
                          <i
                            className="fab fa-twitter"
                            style={{
                              position: "absolute",
                              left: "12px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#38bdf8",
                              fontSize: "0.85rem",
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Twitter / X URL"
                            value={form.social?.twitter || ""}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                social: { ...(form.social || {}), twitter: e.target.value },
                              })
                            }
                            style={{
                              width: "100%",
                              padding: "8px 12px 8px 34px",
                              background: "rgba(15, 23, 42, 0.6)",
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                              borderRadius: "8px",
                              color: "#ffffff",
                              fontSize: "0.82rem",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div
                  style={{
                    marginTop: "24px",
                    paddingTop: "16px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      background: "rgba(15, 23, 42, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#94a3b8",
                      padding: "9px 18px",
                      borderRadius: "10px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      background: "linear-gradient(135deg, var(--pt-primary) 0%, #b8141b 100%)",
                      color: "#ffffff",
                      border: "none",
                      padding: "9px 22px",
                      borderRadius: "10px",
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      cursor: submitting ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {submitting && <i className="fas fa-spinner fa-spin" />}
                    <span>{editId ? "Save Member" : "Add Member"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirmId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(6px)",
            zIndex: 1060,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#1e293b",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "16px",
              padding: "24px",
              maxWidth: "420px",
              width: "100%",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.15)",
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                margin: "0 auto 16px",
              }}
            >
              <i className="fas fa-trash-alt" />
            </div>
            <h4 style={{ color: "#ffffff", fontWeight: "700", marginBottom: "8px" }}>
              Remove Team Member?
            </h4>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", marginBottom: "20px" }}>
              Are you sure you want to remove this profile from the website?
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                style={{
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#94a3b8",
                  padding: "8px 18px",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                style={{
                  background: "#ef4444",
                  border: "none",
                  color: "#ffffff",
                  padding: "8px 20px",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManager;

