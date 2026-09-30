import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import API from "../../Config/API";

export const ServicesManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const initialForm = {
    title: "",
    slug: "",
    sub_heading: "",
    category: "Web Development",
    icon: "fas fa-code",
    short_desc: "",
    contents: "",
    sub_content: "",
    order: 0,
    features: [
      "Custom Architecture & Clean Code",
      "High Performance & Scalability",
      "End-to-End API Integration",
    ],
    tech: ["React", "Node.js", "MySQL", "AWS"],
    image: "",
    existingImage: "",
  };

  const [form, setForm] = useState(initialForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [techInput, setTechInput] = useState("");

  const token = localStorage.getItem("pt_admin_token");
  const authHeaders = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  const quickIcons = [
    { icon: "fas fa-code", label: "Code" },
    { icon: "fas fa-laptop-code", label: "Dev" },
    { icon: "fas fa-mobile-alt", label: "Mobile" },
    { icon: "fas fa-cloud", label: "Cloud" },
    { icon: "fas fa-brain", label: "AI/ML" },
    { icon: "fas fa-database", label: "DB" },
    { icon: "fas fa-shield-alt", label: "Security" },
    { icon: "fas fa-paint-brush", label: "Design" },
    { icon: "fas fa-chart-line", label: "Analytics" },
    { icon: "fas fa-cogs", label: "Engineering" },
  ];

  // Helper to generate slug from title
  const generateSlug = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Load Services
  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API.BASE_URL}admin/services`, authHeaders);
      if (res.data?.success) {
        setServices(res.data.data || []);
      }
    } catch {
      try {
        const fallback = await axios.get(`${API.BASE_URL}services`);
        if (fallback.data?.success) {
          setServices(fallback.data.data || []);
        }
      } catch (err) {
        setErrorMsg("Failed to load services from backend");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter Services
  const filteredServices = services.filter((s) => {
    const matchCat = categoryFilter === "all" || s.category === categoryFilter;
    if (!matchCat) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.title?.toLowerCase().includes(q) ||
      s.slug?.toLowerCase().includes(q) ||
      s.category?.toLowerCase().includes(q) ||
      s.short_desc?.toLowerCase().includes(q)
    );
  });

  const categories = useMemo(() => {
    const set = new Set();
    services.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set);
  }, [services]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditId(null);
    setForm(initialForm);
    setSelectedFile(null);
    setPreviewUrl("");
    setFeatureInput("");
    setTechInput("");
    setErrorMsg("");
    setSuccessMsg("");
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (srv) => {
    setEditId(srv.id);
    let parsedFeatures = [];
    let parsedTech = [];

    try {
      parsedFeatures = Array.isArray(srv.features)
        ? srv.features
        : typeof srv.features === "string"
        ? JSON.parse(srv.features)
        : [];
    } catch {
      parsedFeatures = [];
    }

    try {
      parsedTech = Array.isArray(srv.tech)
        ? srv.tech
        : typeof srv.tech === "string"
        ? JSON.parse(srv.tech)
        : [];
    } catch {
      parsedTech = [];
    }

    setForm({
      title: srv.title || "",
      slug: srv.slug || "",
      sub_heading: srv.sub_heading || "",
      category: srv.category || "Web Development",
      icon: srv.icon || "fas fa-code",
      short_desc: srv.short_desc || "",
      contents: srv.contents || "",
      sub_content: srv.sub_content || "",
      order: srv.order || 0,
      features: parsedFeatures,
      tech: parsedTech,
      existingImage: srv.images || "",
      image: "",
    });

    setSelectedFile(null);
    setPreviewUrl("");
    setFeatureInput("");
    setTechInput("");
    setErrorMsg("");
    setSuccessMsg("");
    setShowModal(true);
  };

  // File selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Feature handling
  const handleAddFeature = () => {
    if (featureInput.trim() && !form.features.includes(featureInput.trim())) {
      setForm((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (idx) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx),
    }));
  };

  // Tech tag handling
  const handleAddTech = () => {
    if (techInput.trim() && !form.tech.includes(techInput.trim())) {
      setForm((prev) => ({
        ...prev,
        tech: [...prev.tech, techInput.trim()],
      }));
      setTechInput("");
    }
  };

  const handleRemoveTech = (tag) => {
    setForm((prev) => ({
      ...prev,
      tech: prev.tech.filter((t) => t !== tag),
    }));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!form.title.trim()) {
      setErrorMsg("Service title is required");
      return;
    }

    const finalSlug = form.slug.trim() ? generateSlug(form.slug) : generateSlug(form.title);

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("slug", finalSlug);
      formData.append("sub_heading", form.sub_heading);
      formData.append("category", form.category);
      formData.append("icon", form.icon);
      formData.append("short_desc", form.short_desc);
      formData.append("contents", form.contents);
      formData.append("sub_content", form.sub_content);
      formData.append("order", form.order);
      formData.append("features", JSON.stringify(form.features));
      formData.append("tech", JSON.stringify(form.tech));

      if (selectedFile) {
        formData.append("image", selectedFile);
      } else if (form.existingImage) {
        formData.append("images", form.existingImage);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (editId) {
        await axios.put(`${API.BASE_URL}admin/services/${editId}`, formData, config);
        setSuccessMsg("Service updated successfully!");
      } else {
        await axios.post(`${API.BASE_URL}admin/services`, formData, config);
        setSuccessMsg("Service created successfully!");
      }

      await loadServices();
      setTimeout(() => setShowModal(false), 900);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to save service");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Status
  const handleToggle = async (id) => {
    try {
      await axios.patch(`${API.BASE_URL}admin/services/${id}/toggle`, {}, authHeaders);
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
      );
    } catch {
      setErrorMsg("Failed to toggle service status");
    }
  };

  // Delete Service
  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await axios.delete(`${API.BASE_URL}admin/services/${deleteConfirmId}`, authHeaders);
      setServices((prev) => prev.filter((s) => s.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch {
      setErrorMsg("Failed to delete service");
    }
  };

  // Helper for image URLs
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
            Services Management
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: "4px 0 0 0" }}>
            Add, update, and manage your technical offerings, capability highlights, and custom solutions.
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
          <span>Add New Service</span>
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
              <i className="fas fa-cogs" />
            </div>
            <div>
              <div style={{ color: "#94a3b8", fontSize: "0.82rem", fontWeight: "500" }}>
                Total Services
              </div>
              <div style={{ color: "#ffffff", fontSize: "1.45rem", fontWeight: "800" }}>
                {services.length}
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
              <i className="fas fa-check-circle" />
            </div>
            <div>
              <div style={{ color: "#94a3b8", fontSize: "0.82rem", fontWeight: "500" }}>
                Active & Live
              </div>
              <div style={{ color: "#ffffff", fontSize: "1.45rem", fontWeight: "800" }}>
                {services.filter((s) => s.isActive !== false).length}
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
              <i className="fas fa-layer-group" />
            </div>
            <div>
              <div style={{ color: "#94a3b8", fontSize: "0.82rem", fontWeight: "500" }}>
                Categories
              </div>
              <div style={{ color: "#ffffff", fontSize: "1.45rem", fontWeight: "800" }}>
                {categories.length || 1}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          background: "rgba(30, 41, 59, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "14px",
          padding: "14px 18px",
          marginBottom: "24px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <div style={{ position: "relative", flex: "1 1 260px" }}>
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
            placeholder="Search by title, slug, category..."
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

        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "2px" }}>
          <button
            type="button"
            onClick={() => setCategoryFilter("all")}
            style={{
              padding: "7px 14px",
              borderRadius: "8px",
              fontSize: "0.8rem",
              fontWeight: "600",
              cursor: "pointer",
              border: "none",
              background: categoryFilter === "all" ? "var(--pt-primary)" : "rgba(15, 23, 42, 0.8)",
              color: categoryFilter === "all" ? "#ffffff" : "#94a3b8",
              transition: "all 0.2s",
            }}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: "7px 14px",
                borderRadius: "8px",
                fontSize: "0.8rem",
                fontWeight: "600",
                cursor: "pointer",
                border: "none",
                background: categoryFilter === cat ? "var(--pt-primary)" : "rgba(15, 23, 42, 0.8)",
                color: categoryFilter === cat ? "#ffffff" : "#94a3b8",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services List Table / Cards */}
      {loading ? (
        <div className="text-center py-5" style={{ color: "#94a3b8" }}>
          <i className="fas fa-spinner fa-spin fa-2x mb-3 d-block" style={{ color: "var(--pt-primary)" }} />
          Loading services from database...
        </div>
      ) : filteredServices.length === 0 ? (
        <div
          style={{
            background: "rgba(30, 41, 59, 0.3)",
            border: "1px dashed rgba(255, 255, 255, 0.15)",
            borderRadius: "16px",
            padding: "50px 20px",
            textAlign: "center",
          }}
        >
          <i className="fas fa-cogs fa-3x mb-3" style={{ color: "#475569" }} />
          <h4 style={{ color: "#ffffff", fontWeight: "700" }}>No services found</h4>
          <p style={{ color: "#94a3b8", fontSize: "0.88rem", maxWidth: "400px", margin: "0 auto 16px" }}>
            {search ? "No matching services match your filter." : "Click below to add your first dynamic service."}
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
            Create Service
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {filteredServices.map((srv) => {
            const hasImg = srv.images;
            const features = Array.isArray(srv.features)
              ? srv.features
              : typeof srv.features === "string"
              ? JSON.parse(srv.features || "[]")
              : [];
            const tech = Array.isArray(srv.tech)
              ? srv.tech
              : typeof srv.tech === "string"
              ? JSON.parse(srv.tech || "[]")
              : [];

            return (
              <div className="col-12 col-md-6 col-xl-4" key={srv.id}>
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
                  {/* Top Bar with Icon & Category */}
                  <div
                    style={{
                      padding: "16px 20px",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "rgba(15, 23, 42, 0.5)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "10px",
                          background: "rgba(245, 32, 41, 0.15)",
                          color: "var(--pt-primary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.05rem",
                        }}
                      >
                        <i className={srv.icon || "fas fa-code"} />
                      </div>
                      <span
                        style={{
                          fontSize: "0.76rem",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          color: "#94a3b8",
                        }}
                      >
                        {srv.category || "Engineering"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggle(srv.id)}
                      title={srv.isActive !== false ? "Click to disable" : "Click to enable"}
                      style={{
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontSize: "0.72rem",
                        fontWeight: "700",
                        border: "none",
                        cursor: "pointer",
                        background:
                          srv.isActive !== false
                            ? "rgba(16, 185, 129, 0.15)"
                            : "rgba(239, 68, 68, 0.15)",
                        color: srv.isActive !== false ? "#10b981" : "#ef4444",
                      }}
                    >
                      <i
                        className={`fas ${
                          srv.isActive !== false ? "fa-circle-check" : "fa-circle-xmark"
                        } me-1`}
                      />
                      {srv.isActive !== false ? "Active" : "Disabled"}
                    </button>
                  </div>

                  {/* Optional Image Banner */}
                  {hasImg && (
                    <div
                      style={{
                        height: "120px",
                        overflow: "hidden",
                        background: "#0f172a",
                        position: "relative",
                      }}
                    >
                      <img
                        src={getImageDisplay(srv.images)}
                        alt={srv.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          opacity: 0.85,
                        }}
                      />
                    </div>
                  )}

                  {/* Body Content */}
                  <div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h3
                      style={{
                        fontSize: "1.15rem",
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: "4px",
                      }}
                    >
                      {srv.title}
                    </h3>

                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "#64748b",
                        fontFamily: "monospace",
                        marginBottom: "10px",
                      }}
                    >
                      /services/{srv.slug}
                    </div>

                    <p
                      style={{
                        color: "#94a3b8",
                        fontSize: "0.85rem",
                        lineHeight: "1.5",
                        marginBottom: "14px",
                        flex: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {srv.short_desc || srv.contents || "No description provided."}
                    </p>

                    {/* Features Snippet */}
                    {features.length > 0 && (
                      <div style={{ marginBottom: "12px" }}>
                        <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: "700", marginBottom: "6px", textTransform: "uppercase" }}>
                          Features ({features.length})
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {features.slice(0, 3).map((f, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: "0.72rem",
                                background: "rgba(15, 23, 42, 0.6)",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                color: "#cbd5e1",
                                padding: "2px 8px",
                                borderRadius: "6px",
                              }}
                            >
                              ✓ {f}
                            </span>
                          ))}
                          {features.length > 3 && (
                            <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                              +{features.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tech Badges */}
                    {tech.length > 0 && (
                      <div style={{ marginBottom: "16px" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                          {tech.map((t, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: "0.7rem",
                                background: "rgba(245, 32, 41, 0.1)",
                                color: "#fca5a5",
                                padding: "2px 7px",
                                borderRadius: "4px",
                                fontWeight: "600",
                              }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Card Actions */}
                    <div
                      style={{
                        paddingTop: "14px",
                        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "8px",
                      }}
                    >
                      <a
                        href={`/services/${srv.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: "#94a3b8",
                          fontSize: "0.8rem",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <i className="fas fa-external-link-alt" />
                        <span>View Page</span>
                      </a>

                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(srv)}
                          style={{
                            background: "rgba(59, 130, 246, 0.15)",
                            color: "#60a5fa",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "8px",
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            cursor: "pointer",
                          }}
                        >
                          <i className="fas fa-edit me-1" /> Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(srv.id)}
                          style={{
                            background: "rgba(239, 68, 68, 0.15)",
                            color: "#f87171",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "8px",
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            cursor: "pointer",
                          }}
                        >
                          <i className="fas fa-trash me-1" /> Delete
                        </button>
                      </div>
                    </div>
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
              maxWidth: "760px",
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
                {editId ? "Edit Service" : "Create New Dynamic Service"}
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
                  {/* Title */}
                  <div className="col-12 col-md-7">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Service Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cloud Solutions & DevOps"
                      value={form.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setForm((prev) => ({
                          ...prev,
                          title: val,
                          slug: editId ? prev.slug : generateSlug(val),
                        }));
                      }}
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

                  {/* Slug */}
                  <div className="col-12 col-md-5">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      URL Slug
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. cloud-solutions"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        background: "rgba(15, 23, 42, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "10px",
                        color: "#ffffff",
                        fontSize: "0.88rem",
                        fontFamily: "monospace",
                      }}
                    />
                  </div>

                  {/* Sub Heading */}
                  <div className="col-12 col-md-6">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Sub Heading
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Scalable, High-Security Cloud Infrastructure"
                      value={form.sub_heading}
                      onChange={(e) => setForm({ ...form, sub_heading: e.target.value })}
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

                  {/* Category */}
                  <div className="col-12 col-md-6">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Category
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Web Development, Cloud, Mobile"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
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

                  {/* Icon Selection */}
                  <div className="col-12">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Icon Class (FontAwesome)
                    </label>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                      <div
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "10px",
                          background: "rgba(245, 32, 41, 0.2)",
                          color: "var(--pt-primary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.1rem",
                        }}
                      >
                        <i className={form.icon || "fas fa-code"} />
                      </div>
                      <input
                        type="text"
                        value={form.icon}
                        onChange={(e) => setForm({ ...form, icon: e.target.value })}
                        placeholder="e.g. fas fa-cloud"
                        style={{
                          flex: 1,
                          padding: "10px 14px",
                          background: "rgba(15, 23, 42, 0.6)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "10px",
                          color: "#ffffff",
                          fontSize: "0.88rem",
                        }}
                      />
                    </div>
                    {/* Quick Icon Selector Badges */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {quickIcons.map((qi) => (
                        <button
                          key={qi.icon}
                          type="button"
                          onClick={() => setForm({ ...form, icon: qi.icon })}
                          style={{
                            background: form.icon === qi.icon ? "var(--pt-primary)" : "rgba(15, 23, 42, 0.7)",
                            color: form.icon === qi.icon ? "#ffffff" : "#94a3b8",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            borderRadius: "6px",
                            padding: "4px 9px",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <i className={qi.icon} />
                          <span>{qi.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Short Description */}
                  <div className="col-12">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Short Overview (Card summary)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Brief 1-2 sentence description shown on overview cards..."
                      value={form.short_desc}
                      onChange={(e) => setForm({ ...form, short_desc: e.target.value })}
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

                  {/* Long Contents */}
                  <div className="col-12">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Detailed Content (Full Service Page)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Comprehensive information detailing your methodology, deliverables, and architecture..."
                      value={form.contents}
                      onChange={(e) => setForm({ ...form, contents: e.target.value })}
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

                  {/* Key Features Builder */}
                  <div className="col-12">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Key Features & Deliverables
                    </label>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                      <input
                        type="text"
                        placeholder="Add a key feature..."
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddFeature();
                          }
                        }}
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          background: "rgba(15, 23, 42, 0.6)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "8px",
                          color: "#ffffff",
                          fontSize: "0.85rem",
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        style={{
                          background: "rgba(59, 130, 246, 0.2)",
                          color: "#60a5fa",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontWeight: "600",
                          fontSize: "0.82rem",
                          cursor: "pointer",
                        }}
                      >
                        Add
                      </button>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {form.features.map((feat, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: "rgba(15, 23, 42, 0.8)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            color: "#cbd5e1",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "0.78rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <span>{feat}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(idx)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#f87171",
                              cursor: "pointer",
                              padding: 0,
                              fontSize: "0.8rem",
                            }}
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack Builder */}
                  <div className="col-12 col-md-8">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Technologies Used
                    </label>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                      <input
                        type="text"
                        placeholder="e.g. React, Node, AWS..."
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTech();
                          }
                        }}
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          background: "rgba(15, 23, 42, 0.6)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "8px",
                          color: "#ffffff",
                          fontSize: "0.85rem",
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddTech}
                        style={{
                          background: "rgba(245, 32, 41, 0.2)",
                          color: "var(--pt-primary)",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontWeight: "600",
                          fontSize: "0.82rem",
                          cursor: "pointer",
                        }}
                      >
                        Add Tag
                      </button>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {form.tech.map((t, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: "rgba(245, 32, 41, 0.15)",
                            border: "1px solid rgba(245, 32, 41, 0.3)",
                            color: "#fca5a5",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "0.78rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <span>{t}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTech(t)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#f87171",
                              cursor: "pointer",
                              padding: 0,
                              fontSize: "0.8rem",
                            }}
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Order */}
                  <div className="col-12 col-md-4">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={form.order}
                      onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
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

                  {/* Banner Image Upload */}
                  <div className="col-12">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Cover Banner Image (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{
                        width: "100%",
                        padding: "8px",
                        background: "rgba(15, 23, 42, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        color: "#cbd5e1",
                        fontSize: "0.82rem",
                      }}
                    />
                    {(previewUrl || form.existingImage) && (
                      <div style={{ marginTop: "10px", position: "relative", display: "inline-block" }}>
                        <img
                          src={previewUrl || getImageDisplay(form.existingImage)}
                          alt="Preview"
                          style={{
                            width: "180px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                        />
                      </div>
                    )}
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
                    <span>{editId ? "Save Changes" : "Create Service"}</span>
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
            <h4 style={{ color: "#ffffff", fontWeight: "700", marginBottom: "8px" }}>Delete Service?</h4>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", marginBottom: "20px" }}>
              Are you sure you want to remove this service? This action cannot be undone.
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
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ServicesManager;
