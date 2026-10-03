import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import API from "../../Config/API";

export const PortfolioManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Delete modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const initialForm = {
    title: "",
    sub_heading: "",
    category: "webapp",
    client: "",
    year: new Date().getFullYear().toString(),
    industry: "",
    platform: "Web Application / Cloud",
    status: "Live",
    impact: "",
    link: "",
    description: "",
    tech: ["React", "Node.js"],
    features: ["High-performance architecture", "Responsive layout"],
    images: [],
    existingImages: [],
  };

  const [form, setForm] = useState(initialForm);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [urlInput, setUrlInput] = useState("");

  const token = localStorage.getItem("pt_admin_token");
  const authHeaders = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` },
  }), [token]);

  // Load projects from database
  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API.BASE_URL}admin/portfolio`, authHeaders);
      if (res.data?.success) {
        setProjects(res.data.data || []);
      }
    } catch {
      // Fallback to public list if admin list fails
      try {
        const publicRes = await axios.get(`${API.BASE_URL}portfolio`);
        if (publicRes.data?.success) {
          setProjects(publicRes.data.data || []);
        }
      } catch (err) {
        setErrorMsg("Failed to load projects from server");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchCat = categoryFilter === "all" || p.category === categoryFilter;
    if (!matchCat) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.client?.toLowerCase().includes(q) ||
      p.sub_heading?.toLowerCase().includes(q)
    );
  });

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditId(null);
    setForm(initialForm);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setErrorMsg("");
    setSuccessMsg("");
    setShowModal(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (project) => {
    setEditId(project.id);
    const existingImgs = Array.isArray(project.images)
      ? project.images
      : typeof project.images === "string"
      ? [project.images]
      : [];

    setForm({
      title: project.title || "",
      sub_heading: project.sub_heading || "",
      category: project.category || "webapp",
      client: project.client || "",
      year: project.year || "",
      industry: project.industry || "",
      platform: project.platform || "",
      status: project.status || "Live",
      impact: project.impact || "",
      link: project.link || "",
      description: project.description || "",
      tech: Array.isArray(project.tech) ? project.tech : [],
      features: Array.isArray(project.features) ? project.features : [],
      existingImages: existingImgs,
    });

    setSelectedFiles([]);
    setPreviewUrls([]);
    setErrorMsg("");
    setSuccessMsg("");
    setShowModal(true);
  };

  // Handle file selections (multi-file support)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setSelectedFiles((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  // Remove a newly selected file
  const handleRemoveNewFile = (idx) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  // Remove an existing image
  const handleRemoveExistingImg = (idx) => {
    setForm((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== idx),
    }));
  };

  // Add an external image URL
  const handleAddUrl = () => {
    if (urlInput.trim()) {
      setForm((prev) => ({
        ...prev,
        existingImages: [...prev.existingImages, urlInput.trim()],
      }));
      setUrlInput("");
    }
  };

  // Add tech tag
  const handleAddTech = () => {
    if (techInput.trim() && !form.tech.includes(techInput.trim())) {
      setForm((prev) => ({ ...prev, tech: [...prev.tech, techInput.trim()] }));
      setTechInput("");
    }
  };

  const handleRemoveTech = (tag) => {
    setForm((prev) => ({ ...prev, tech: prev.tech.filter((t) => t !== tag) }));
  };

  // Add feature item
  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setForm((prev) => ({ ...prev, features: [...prev.features, featureInput.trim()] }));
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (idx) => {
    setForm((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!form.title.trim()) {
      setErrorMsg("Project title is required.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("sub_heading", form.sub_heading);
      formData.append("category", form.category);
      formData.append("client", form.client);
      formData.append("year", form.year);
      formData.append("industry", form.industry);
      formData.append("platform", form.platform);
      formData.append("status", form.status);
      formData.append("impact", form.impact);
      formData.append("link", form.link);
      formData.append("description", form.description);
      formData.append("tech", JSON.stringify(form.tech));
      formData.append("features", JSON.stringify(form.features));
      formData.append("existingImages", JSON.stringify(form.existingImages));

      // Append new files
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (editId) {
        await axios.put(`${API.BASE_URL}admin/portfolio/${editId}`, formData, config);
        setSuccessMsg("Project updated successfully!");
      } else {
        await axios.post(`${API.BASE_URL}admin/portfolio`, formData, config);
        setSuccessMsg("Project created successfully!");
      }

      await loadProjects();
      setTimeout(() => setShowModal(false), 900);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to save project");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle active status
  const handleToggle = async (id) => {
    try {
      await axios.patch(`${API.BASE_URL}admin/portfolio/${id}/toggle`, {}, authHeaders);
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
      );
    } catch {
      setErrorMsg("Failed to toggle project status");
    }
  };

  // Delete project
  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await axios.delete(`${API.BASE_URL}admin/portfolio/${deleteConfirmId}`, authHeaders);
      setProjects((prev) => prev.filter((p) => p.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch {
      setErrorMsg("Failed to delete project");
    }
  };

  // Format image display helper
  const getImageDisplay = (img) => {
    if (!img) return "";
    if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("/")) {
      return img;
    }
    return `${API.BASE_URL_IMAGES}${img}`;
  };

  return (
    <div>
      {/* Top Action Bar */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#ffffff", margin: 0 }}>
            Portfolio & Gallery Manager
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: "4px 0 0 0" }}>
            Add, update, or remove projects. Supports single images and multi-image galleries.
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
          <span>Add New Project</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          background: "rgba(15, 23, 42, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          padding: "16px 20px",
          marginBottom: "24px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {["all", "webapp", "website", "android"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              style={{
                background: categoryFilter === cat ? "var(--pt-primary)" : "rgba(255, 255, 255, 0.05)",
                color: "#ffffff",
                border: "none",
                padding: "7px 16px",
                borderRadius: "99px",
                fontSize: "0.82rem",
                fontWeight: "600",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {cat === "all" ? "All Projects" : cat === "webapp" ? "Web Apps" : cat === "website" ? "Websites" : "Android"}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", minWidth: "260px" }}>
          <i
            className="fas fa-search"
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#64748b",
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or client..."
            style={{
              width: "100%",
              padding: "8px 14px 8px 38px",
              borderRadius: "99px",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              background: "rgba(10, 14, 23, 0.6)",
              color: "#ffffff",
              fontSize: "0.85rem",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Projects Table */}
      <div
        style={{
          background: "rgba(15, 23, 42, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "18px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <th style={{ padding: "16px 20px", color: "#94a3b8", fontSize: "0.78rem", textTransform: "uppercase" }}>
                  Project
                </th>
                <th style={{ padding: "16px 20px", color: "#94a3b8", fontSize: "0.78rem", textTransform: "uppercase" }}>
                  Category
                </th>
                <th style={{ padding: "16px 20px", color: "#94a3b8", fontSize: "0.78rem", textTransform: "uppercase" }}>
                  Gallery / Photos
                </th>
                <th style={{ padding: "16px 20px", color: "#94a3b8", fontSize: "0.78rem", textTransform: "uppercase" }}>
                  Client & Year
                </th>
                <th style={{ padding: "16px 20px", color: "#94a3b8", fontSize: "0.78rem", textTransform: "uppercase" }}>
                  Status
                </th>
                <th style={{ padding: "16px 20px", color: "#94a3b8", fontSize: "0.78rem", textTransform: "uppercase", textAlign: "right" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
                    <i className="fas fa-spinner fa-spin me-2" /> Loading projects...
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
                    No projects found. Click "Add New Project" to get started!
                  </td>
                </tr>
              ) : (
                filteredProjects.map((p) => {
                  const imgs = Array.isArray(p.images)
                    ? p.images
                    : typeof p.images === "string"
                    ? [p.images]
                    : [];
                  const coverImg = imgs[0] || "";
                  const isMulti = imgs.length > 1;

                  return (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                        transition: "background 0.15s",
                      }}
                    >
                      {/* Project info & Thumbnail */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          <div
                            style={{
                              width: "60px",
                              height: "44px",
                              borderRadius: "8px",
                              overflow: "hidden",
                              background: "#1e293b",
                              flexShrink: 0,
                            }}
                          >
                            {coverImg ? (
                              <img
                                src={getImageDisplay(coverImg)}
                                alt={p.title}
                                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "#64748b",
                                  fontSize: "0.8rem",
                                }}
                              >
                                <i className="fas fa-image" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: "700", color: "#ffffff", fontSize: "0.92rem" }}>
                              {p.title}
                            </div>
                            <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                              {p.sub_heading}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: "16px 20px" }}>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            padding: "4px 10px",
                            borderRadius: "99px",
                            background: "rgba(255, 255, 255, 0.08)",
                            color: "#cbd5e1",
                            fontWeight: "600",
                            textTransform: "uppercase",
                          }}
                        >
                          {p.category}
                        </span>
                      </td>

                      {/* Images count badge */}
                      <td style={{ padding: "16px 20px" }}>
                        {isMulti ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              fontSize: "0.75rem",
                              padding: "4px 10px",
                              borderRadius: "99px",
                              background: "rgba(245, 32, 41, 0.15)",
                              color: "var(--pt-primary)",
                              fontWeight: "700",
                              border: "1px solid rgba(245, 32, 41, 0.3)",
                            }}
                          >
                            <i className="fas fa-images" />
                            <span>{imgs.length} Photos</span>
                          </span>
                        ) : (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              fontSize: "0.75rem",
                              padding: "4px 10px",
                              borderRadius: "99px",
                              background: "rgba(100, 116, 139, 0.15)",
                              color: "#94a3b8",
                              fontWeight: "600",
                            }}
                          >
                            <i className="fas fa-image" />
                            <span>Single</span>
                          </span>
                        )}
                      </td>

                      {/* Client & Year */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ fontSize: "0.85rem", color: "#ffffff", fontWeight: "600" }}>
                          {p.client || "—"}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                          {p.year || "—"}
                        </div>
                      </td>

                      {/* Active toggle */}
                      <td style={{ padding: "16px 20px" }}>
                        <button
                          type="button"
                          onClick={() => handleToggle(p.id)}
                          style={{
                            border: "none",
                            background: p.isActive
                              ? "rgba(16, 185, 129, 0.15)"
                              : "rgba(239, 68, 68, 0.15)",
                            color: p.isActive ? "#34d399" : "#f87171",
                            padding: "4px 12px",
                            borderRadius: "99px",
                            fontSize: "0.75rem",
                            fontWeight: "700",
                            cursor: "pointer",
                          }}
                        >
                          ● {p.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "16px 20px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            style={{
                              background: "rgba(255, 255, 255, 0.08)",
                              border: "none",
                              color: "#ffffff",
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              cursor: "pointer",
                            }}
                            title="Edit project"
                          >
                            <i className="fas fa-pencil-alt" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(p.id)}
                            style={{
                              background: "rgba(239, 68, 68, 0.12)",
                              border: "none",
                              color: "#f87171",
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              cursor: "pointer",
                            }}
                            title="Delete project"
                          >
                            <i className="fas fa-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================================
          Add / Edit Project Modal
          ====================================================================== */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 14, 23, 0.85)",
            backdropFilter: "blur(12px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            overflowY: "auto",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div
            style={{
              background: "#0f172a",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "850px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              color: "#ffffff",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6)",
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
              }}
            >
              <h4 style={{ margin: 0, fontWeight: "800", fontSize: "1.2rem" }}>
                {editId ? "Edit Project Details" : "Create New Portfolio Project"}
              </h4>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "none",
                  color: "#cbd5e1",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              >
                <i className="fas fa-times" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} style={{ overflowY: "auto", padding: "24px" }}>
              {errorMsg && (
                <div
                  style={{
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    color: "#fca5a5",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    marginBottom: "16px",
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
                    border: "1px solid rgba(16, 185, 129, 0.4)",
                    color: "#34d399",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    marginBottom: "16px",
                  }}
                >
                  <i className="fas fa-check-circle me-2" />
                  {successMsg}
                </div>
              )}

              {/* Title & Subtitle */}
              <div className="row g-3 mb-3">
                <div className="col-md-7">
                  <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Enterprise Resource Management"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      background: "rgba(255, 255, 255, 0.04)",
                      color: "#ffffff",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>
                <div className="col-md-5">
                  <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      background: "#1e293b",
                      color: "#ffffff",
                      fontSize: "0.9rem",
                    }}
                  >
                    <option value="webapp">Web Application</option>
                    <option value="website">Corporate Website</option>
                    <option value="android">Android Application</option>
                    <option value="cloud">Cloud & DevOps</option>
                    <option value="ai">AI & Automation</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                  Subtitle / Badge Headline
                </label>
                <input
                  type="text"
                  value={form.sub_heading}
                  onChange={(e) => setForm({ ...form, sub_heading: e.target.value })}
                  placeholder="e.g. Cloud-Native ERP & Telemetry System"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    background: "rgba(255, 255, 255, 0.04)",
                    color: "#ffffff",
                    fontSize: "0.9rem",
                  }}
                />
              </div>

              {/* ── Multi-Image & Single-Image Section ── */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "14px",
                  padding: "18px",
                  marginBottom: "18px",
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <label style={{ fontSize: "0.88rem", fontWeight: "700", color: "#ffffff", margin: 0 }}>
                    <i className="fas fa-images me-2" style={{ color: "var(--pt-primary)" }} />
                    Project Media & Screenshots (Single or Multiple)
                  </label>
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                    Total: {form.existingImages.length + selectedFiles.length} photo(s)
                  </span>
                </div>
                <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginBottom: "14px" }}>
                  Upload multiple screenshots for a gallery view, or a single photo for a clean showcase.
                </p>

                {/* File Upload Input */}
                <div className="mb-3">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    id="project-media-input"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="project-media-input"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "20px",
                      borderRadius: "12px",
                      border: "2px dashed rgba(255, 255, 255, 0.2)",
                      background: "rgba(255, 255, 255, 0.02)",
                      cursor: "pointer",
                      transition: "border-color 0.2s",
                    }}
                  >
                    <i className="fas fa-cloud-upload-alt mb-2" style={{ fontSize: "1.8rem", color: "var(--pt-primary)" }} />
                    <span style={{ fontSize: "0.88rem", fontWeight: "600", color: "#ffffff" }}>
                      Click to choose image(s) from computer
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>
                      PNG, JPG, WEBP, SVG up to 15MB each
                    </span>
                  </label>
                </div>

                {/* Or Add Image URL */}
                <div className="d-flex gap-2 mb-3">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Or paste external image URL (e.g. https://...)"
                    style={{
                      flexGrow: 1,
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      background: "rgba(255, 255, 255, 0.04)",
                      color: "#ffffff",
                      fontSize: "0.82rem",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddUrl}
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      color: "#ffffff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontWeight: "600",
                      fontSize: "0.82rem",
                      cursor: "pointer",
                    }}
                  >
                    Add URL
                  </button>
                </div>

                {/* Previews Grid: Existing Images + Newly Selected Images */}
                {(form.existingImages.length > 0 || previewUrls.length > 0) && (
                  <div>
                    <div style={{ fontSize: "0.78rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "8px" }}>
                      Attached Media Previews:
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {/* Existing */}
                      {form.existingImages.map((img, idx) => (
                        <div
                          key={`exist-${idx}`}
                          style={{
                            position: "relative",
                            width: "80px",
                            height: "60px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                          }}
                        >
                          <img
                            src={getImageDisplay(img)}
                            alt="Preview"
                            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImg(idx)}
                            style={{
                              position: "absolute",
                              top: "2px",
                              right: "2px",
                              background: "rgba(239, 68, 68, 0.85)",
                              color: "#fff",
                              border: "none",
                              width: "18px",
                              height: "18px",
                              borderRadius: "50%",
                              fontSize: "0.6rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      {/* Newly selected files */}
                      {previewUrls.map((url, idx) => (
                        <div
                          key={`new-${idx}`}
                          style={{
                            position: "relative",
                            width: "80px",
                            height: "60px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            border: "2px solid var(--pt-primary)",
                          }}
                        >
                          <img
                            src={url}
                            alt="New preview"
                            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewFile(idx)}
                            style={{
                              position: "absolute",
                              top: "2px",
                              right: "2px",
                              background: "rgba(239, 68, 68, 0.85)",
                              color: "#fff",
                              border: "none",
                              width: "18px",
                              height: "18px",
                              borderRadius: "50%",
                              fontSize: "0.6rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Client, Year, Status, Live Link */}
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                    Client Organization
                  </label>
                  <input
                    type="text"
                    value={form.client}
                    onChange={(e) => setForm({ ...form, client: e.target.value })}
                    placeholder="e.g. Acuity Logistics"
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "10px",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      background: "rgba(255, 255, 255, 0.04)",
                      color: "#ffffff",
                      fontSize: "0.88rem",
                    }}
                  />
                </div>
                <div className="col-md-2">
                  <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                    Year
                  </label>
                  <input
                    type="text"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    placeholder="2024"
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "10px",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      background: "rgba(255, 255, 255, 0.04)",
                      color: "#ffffff",
                      fontSize: "0.88rem",
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                    Project Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "10px",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      background: "#1e293b",
                      color: "#ffffff",
                      fontSize: "0.88rem",
                    }}
                  >
                    <option value="Live">Live</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Featured">Featured</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                    Demo / Live Link
                  </label>
                  <input
                    type="url"
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    placeholder="https://..."
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "10px",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      background: "rgba(255, 255, 255, 0.04)",
                      color: "#ffffff",
                      fontSize: "0.88rem",
                    }}
                  />
                </div>
              </div>

              {/* Key Impact Metric */}
              <div className="mb-3">
                <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                  Key Accomplishment & Impact Metric
                </label>
                <input
                  type="text"
                  value={form.impact}
                  onChange={(e) => setForm({ ...form, impact: e.target.value })}
                  placeholder="e.g. 42% reduction in supply chain turnaround time"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    background: "rgba(255, 255, 255, 0.04)",
                    color: "#ffffff",
                    fontSize: "0.88rem",
                  }}
                />
              </div>

              {/* Tech Stack Pills Builder */}
              <div className="mb-3">
                <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                  Technologies Used (Press Add or Enter)
                </label>
                <div className="d-flex gap-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTech();
                      }
                    }}
                    placeholder="e.g. React 19, TypeScript, PostgreSQL..."
                    style={{
                      flexGrow: 1,
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      background: "rgba(255, 255, 255, 0.04)",
                      color: "#ffffff",
                      fontSize: "0.85rem",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      color: "#ffffff",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      fontSize: "0.82rem",
                      fontWeight: "600",
                    }}
                  >
                    Add Tag
                  </button>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {form.tech.map((t) => (
                    <span
                      key={t}
                      style={{
                        background: "rgba(99, 102, 241, 0.15)",
                        border: "1px solid rgba(99, 102, 241, 0.3)",
                        color: "#a5b4fc",
                        fontSize: "0.78rem",
                        fontWeight: "600",
                        padding: "3px 10px",
                        borderRadius: "99px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(t)}
                        style={{ background: "none", border: "none", color: "#cbd5e1", padding: 0, cursor: "pointer" }}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Features Builder */}
              <div className="mb-3">
                <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                  Key Capabilities / Feature Highlights
                </label>
                <div className="d-flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="e.g. Granular role-based access control with immutable audit trail..."
                    style={{
                      flexGrow: 1,
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      background: "rgba(255, 255, 255, 0.04)",
                      color: "#ffffff",
                      fontSize: "0.85rem",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      color: "#ffffff",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      fontSize: "0.82rem",
                      fontWeight: "600",
                    }}
                  >
                    Add Feature
                  </button>
                </div>
                <div className="d-flex flex-column gap-1">
                  {form.features.map((feat, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "6px 12px",
                        background: "rgba(255, 255, 255, 0.02)",
                        borderRadius: "8px",
                        fontSize: "0.82rem",
                        color: "#cbd5e1",
                      }}
                    >
                      <span style={{ marginRight: "10px" }}>✓ {feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer" }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                  Full Project Overview / Narrative Description
                </label>
                <textarea
                  rows="4"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detail the technical architecture, problems solved, and solutions engineered..."
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    background: "rgba(255, 255, 255, 0.04)",
                    color: "#ffffff",
                    fontSize: "0.88rem",
                    lineHeight: "1.6",
                  }}
                />
              </div>

              {/* Submit Buttons */}
              <div className="d-flex justify-content-end gap-2 pt-3 border-top border-secondary">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    color: "#ffffff",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "10px",
                    fontWeight: "600",
                    fontSize: "0.88rem",
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
                    padding: "10px 24px",
                    borderRadius: "10px",
                    fontWeight: "700",
                    fontSize: "0.88rem",
                    cursor: submitting ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {submitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check" />
                      <span>{editId ? "Update Project" : "Publish Project"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          Delete Confirmation Modal
          ====================================================================== */}
      {deleteConfirmId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 14, 23, 0.8)",
            backdropFilter: "blur(8px)",
            zIndex: 1100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#1e293b",
              borderRadius: "16px",
              padding: "26px",
              maxWidth: "420px",
              width: "100%",
              textAlign: "center",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#ffffff",
            }}
          >
            <i className="fas fa-exclamation-triangle mb-3" style={{ fontSize: "2.4rem", color: "#f87171" }} />
            <h4 style={{ fontWeight: "700", marginBottom: "8px" }}>Delete Project?</h4>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", marginBottom: "20px" }}>
              Are you sure you want to permanently delete this project from the database? This action cannot be undone.
            </p>
            <div className="d-flex justify-content-center gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                  border: "none",
                  padding: "9px 18px",
                  borderRadius: "8px",
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
                  color: "#ffffff",
                  border: "none",
                  padding: "9px 20px",
                  borderRadius: "8px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioManager;

