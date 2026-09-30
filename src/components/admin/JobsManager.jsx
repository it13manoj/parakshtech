import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import API from "../../Config/API";

export const JobsManager = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");

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
    department: "Software Engineering",
    location: "Remote / Hybrid",
    job_type: "Full-Time",
    experience: "2+ Years",
    salary: "Competitive",
    deadline: "",
    description: "",
    requirements: [
      "Proficient in modern JavaScript / TypeScript ecosystems",
      "Solid understanding of REST APIs and system design",
      "Experience with relational databases (MySQL / PostgreSQL)",
    ],
    responsibilities: [
      "Design, build, and deploy high-performance scalable web applications",
      "Collaborate with cross-functional teams to define architecture specifications",
      "Conduct code reviews and ensure engineering best practices",
    ],
    skills: ["React.js", "Node.js", "Express", "MySQL", "Git"],
  };

  const [form, setForm] = useState(initialForm);
  const [reqInput, setReqInput] = useState("");
  const [respInput, setRespInput] = useState("");
  const [skillInput, setSkillInput] = useState("");

  const token = localStorage.getItem("pt_admin_token");
  const authHeaders = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  const departmentsList = [
    "Software Engineering",
    "Frontend Development",
    "Backend & Cloud",
    "Mobile App Development",
    "UI/UX Design",
    "Quality Assurance",
    "Product Management",
    "DevOps & Security",
  ];

  // Load jobs
  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API.BASE_URL}admin/jobs`, authHeaders);
      if (res.data?.success) {
        setJobs(res.data.data || []);
      }
    } catch {
      try {
        const fallback = await axios.get(`${API.BASE_URL}jobs`);
        if (fallback.data?.success) {
          setJobs(fallback.data.data || []);
        }
      } catch (err) {
        setErrorMsg("Failed to load career listings");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter jobs
  const filteredJobs = jobs.filter((j) => {
    const matchDept = deptFilter === "all" || j.department === deptFilter;
    if (!matchDept) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      j.title?.toLowerCase().includes(q) ||
      j.department?.toLowerCase().includes(q) ||
      j.location?.toLowerCase().includes(q) ||
      j.job_type?.toLowerCase().includes(q)
    );
  });

  const allDepartments = useMemo(() => {
    const set = new Set();
    jobs.forEach((j) => {
      if (j.department) set.add(j.department);
    });
    return Array.from(set);
  }, [jobs]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditId(null);
    setForm(initialForm);
    setReqInput("");
    setRespInput("");
    setSkillInput("");
    setErrorMsg("");
    setSuccessMsg("");
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (job) => {
    setEditId(job.id);

    const parseArr = (field) => {
      if (Array.isArray(field)) return field;
      if (typeof field === "string") {
        try {
          const parsed = JSON.parse(field);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return field ? [field] : [];
        }
      }
      return [];
    };

    setForm({
      title: job.title || "",
      department: job.department || "Software Engineering",
      location: job.location || "Remote / Hybrid",
      job_type: job.job_type || "Full-Time",
      experience: job.experience || "2+ Years",
      salary: job.salary || "Competitive",
      deadline: job.deadline || "",
      description: job.description || "",
      requirements: parseArr(job.requirements),
      responsibilities: parseArr(job.responsibilities),
      skills: parseArr(job.skills),
    });

    setReqInput("");
    setRespInput("");
    setSkillInput("");
    setErrorMsg("");
    setSuccessMsg("");
    setShowModal(true);
  };

  // Tag helper functions
  const handleAddReq = () => {
    if (reqInput.trim() && !form.requirements.includes(reqInput.trim())) {
      setForm((prev) => ({ ...prev, requirements: [...prev.requirements, reqInput.trim()] }));
      setReqInput("");
    }
  };

  const handleRemoveReq = (idx) => {
    setForm((prev) => ({ ...prev, requirements: prev.requirements.filter((_, i) => i !== idx) }));
  };

  const handleAddResp = () => {
    if (respInput.trim() && !form.responsibilities.includes(respInput.trim())) {
      setForm((prev) => ({ ...prev, responsibilities: [...prev.responsibilities, respInput.trim()] }));
      setRespInput("");
    }
  };

  const handleRemoveResp = (idx) => {
    setForm((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== idx),
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      setForm((prev) => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (tag) => {
    setForm((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== tag) }));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!form.title.trim()) {
      setErrorMsg("Job title is required.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: form.title,
        department: form.department,
        location: form.location,
        job_type: form.job_type,
        experience: form.experience,
        salary: form.salary,
        deadline: form.deadline,
        description: form.description,
        requirements: form.requirements,
        responsibilities: form.responsibilities,
        skills: form.skills,
      };

      if (editId) {
        await axios.put(`${API.BASE_URL}admin/jobs/${editId}`, payload, authHeaders);
        setSuccessMsg("Job opening updated successfully!");
      } else {
        await axios.post(`${API.BASE_URL}admin/jobs`, payload, authHeaders);
        setSuccessMsg("New job opening published!");
      }

      await loadJobs();
      setTimeout(() => setShowModal(false), 900);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to save job posting");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Status
  const handleToggle = async (id) => {
    try {
      await axios.patch(`${API.BASE_URL}admin/jobs/${id}/toggle`, {}, authHeaders);
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, isActive: !j.isActive } : j))
      );
    } catch {
      setErrorMsg("Failed to toggle status");
    }
  };

  // Delete Job
  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await axios.delete(`${API.BASE_URL}admin/jobs/${deleteConfirmId}`, authHeaders);
      setJobs((prev) => prev.filter((j) => j.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch {
      setErrorMsg("Failed to delete job posting");
    }
  };

  return (
    <div>
      {/* Top Action Bar */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#ffffff", margin: 0 }}>
            Careers & Job Postings
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: "4px 0 0 0" }}>
            Manage open opportunities, requirements, responsibilities, and applicant postings.
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
          <span>Post New Job</span>
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
              <i className="fas fa-briefcase" />
            </div>
            <div>
              <div style={{ color: "#94a3b8", fontSize: "0.82rem", fontWeight: "500" }}>
                Total Postings
              </div>
              <div style={{ color: "#ffffff", fontSize: "1.45rem", fontWeight: "800" }}>
                {jobs.length}
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
                Actively Hiring
              </div>
              <div style={{ color: "#ffffff", fontSize: "1.45rem", fontWeight: "800" }}>
                {jobs.filter((j) => j.isActive !== false).length}
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
                background: "rgba(168, 85, 247, 0.15)",
                color: "#c084fc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
              }}
            >
              <i className="fas fa-sitemap" />
            </div>
            <div>
              <div style={{ color: "#94a3b8", fontSize: "0.82rem", fontWeight: "500" }}>
                Departments
              </div>
              <div style={{ color: "#ffffff", fontSize: "1.45rem", fontWeight: "800" }}>
                {allDepartments.length || 1}
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
            placeholder="Search positions by title, dept, location..."
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
            onClick={() => setDeptFilter("all")}
            style={{
              padding: "7px 14px",
              borderRadius: "8px",
              fontSize: "0.8rem",
              fontWeight: "600",
              cursor: "pointer",
              border: "none",
              background: deptFilter === "all" ? "var(--pt-primary)" : "rgba(15, 23, 42, 0.8)",
              color: deptFilter === "all" ? "#ffffff" : "#94a3b8",
              transition: "all 0.2s",
            }}
          >
            All Departments
          </button>
          {allDepartments.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setDeptFilter(dept)}
              style={{
                padding: "7px 14px",
                borderRadius: "8px",
                fontSize: "0.8rem",
                fontWeight: "600",
                cursor: "pointer",
                border: "none",
                background: deptFilter === dept ? "var(--pt-primary)" : "rgba(15, 23, 42, 0.8)",
                color: deptFilter === dept ? "#ffffff" : "#94a3b8",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="text-center py-5" style={{ color: "#94a3b8" }}>
          <i className="fas fa-spinner fa-spin fa-2x mb-3 d-block" style={{ color: "var(--pt-primary)" }} />
          Loading career openings from database...
        </div>
      ) : filteredJobs.length === 0 ? (
        <div
          style={{
            background: "rgba(30, 41, 59, 0.3)",
            border: "1px dashed rgba(255, 255, 255, 0.15)",
            borderRadius: "16px",
            padding: "50px 20px",
            textAlign: "center",
          }}
        >
          <i className="fas fa-briefcase fa-3x mb-3" style={{ color: "#475569" }} />
          <h4 style={{ color: "#ffffff", fontWeight: "700" }}>No job postings found</h4>
          <p style={{ color: "#94a3b8", fontSize: "0.88rem", maxWidth: "400px", margin: "0 auto 16px" }}>
            {search ? "No openings match your search filter." : "Click below to create your first dynamic career posting."}
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
            Post a Job
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {filteredJobs.map((job) => {
            const reqs = Array.isArray(job.requirements)
              ? job.requirements
              : typeof job.requirements === "string"
              ? JSON.parse(job.requirements || "[]")
              : [];
            const skills = Array.isArray(job.skills)
              ? job.skills
              : typeof job.skills === "string"
              ? JSON.parse(job.skills || "[]")
              : [];

            return (
              <div className="col-12 col-lg-6" key={job.id}>
                <div
                  style={{
                    background: "rgba(30, 41, 59, 0.45)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "16px",
                    padding: "22px",
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
                  {/* Top Bar with Department & Status */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.74rem",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        color: "var(--pt-primary)",
                        background: "rgba(245, 32, 41, 0.1)",
                        padding: "3px 10px",
                        borderRadius: "6px",
                      }}
                    >
                      {job.department || "Engineering"}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggle(job.id)}
                      style={{
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontSize: "0.72rem",
                        fontWeight: "700",
                        border: "none",
                        cursor: "pointer",
                        background:
                          job.isActive !== false
                            ? "rgba(16, 185, 129, 0.15)"
                            : "rgba(239, 68, 68, 0.15)",
                        color: job.isActive !== false ? "#10b981" : "#ef4444",
                      }}
                    >
                      <i
                        className={`fas ${
                          job.isActive !== false ? "fa-circle-check" : "fa-circle-xmark"
                        } me-1`}
                      />
                      {job.isActive !== false ? "Active (Open)" : "Closed"}
                    </button>
                  </div>

                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: "10px",
                    }}
                  >
                    {job.title}
                  </h3>

                  {/* Pills Row (Location, Type, Exp, Salary) */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                      marginBottom: "14px",
                      color: "#94a3b8",
                      fontSize: "0.82rem",
                    }}
                  >
                    <span>
                      <i className="fas fa-map-marker-alt me-1 text-danger" />
                      {job.location || "Remote"}
                    </span>
                    <span>•</span>
                    <span>
                      <i className="fas fa-clock me-1 text-info" />
                      {job.job_type || "Full-Time"}
                    </span>
                    <span>•</span>
                    <span>
                      <i className="fas fa-briefcase me-1 text-warning" />
                      {job.experience || "2+ Yrs"}
                    </span>
                    {job.salary && (
                      <>
                        <span>•</span>
                        <span style={{ color: "#34d399", fontWeight: "600" }}>
                          <i className="fas fa-money-bill-wave me-1" />
                          {job.salary}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Description preview */}
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
                    {job.description || "No overview provided."}
                  </p>

                  {/* Requirements preview */}
                  {reqs.length > 0 && (
                    <div style={{ marginBottom: "14px" }}>
                      <div
                        style={{
                          fontSize: "0.72rem",
                          color: "#64748b",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          marginBottom: "6px",
                        }}
                      >
                        Key Requirements ({reqs.length})
                      </div>
                      <ul style={{ margin: 0, paddingLeft: "18px", color: "#cbd5e1", fontSize: "0.8rem" }}>
                        {reqs.slice(0, 2).map((r, i) => (
                          <li key={i} style={{ marginBottom: "3px" }}>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Skills tags */}
                  {skills.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                      {skills.map((s, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: "rgba(15, 23, 42, 0.7)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            color: "#cbd5e1",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "0.74rem",
                            fontWeight: "500",
                          }}
                        >
                          {s}
                        </span>
                      ))}
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
                      href={`/careers/job-detail/${job.id}`}
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
                      <span>View Detail</span>
                    </a>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(job)}
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
                        onClick={() => setDeleteConfirmId(job.id)}
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
                {editId ? "Edit Job Posting" : "Create New Job Opening"}
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
                  <div className="col-12 col-md-8">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Job Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Full Stack Engineer"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
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

                  {/* Department */}
                  <div className="col-12 col-md-4">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Department
                    </label>
                    <input
                      type="text"
                      list="deptList"
                      placeholder="Select / Type department"
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
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
                    <datalist id="deptList">
                      {departmentsList.map((d, i) => (
                        <option key={i} value={d} />
                      ))}
                    </datalist>
                  </div>

                  {/* Location & Job Type */}
                  <div className="col-12 col-md-4">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Remote / Noida, IN"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
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

                  <div className="col-12 col-md-4">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Job Type
                    </label>
                    <select
                      value={form.job_type}
                      onChange={(e) => setForm({ ...form, job_type: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        background: "rgba(15, 23, 42, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "10px",
                        color: "#ffffff",
                        fontSize: "0.88rem",
                      }}
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-4">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Experience Needed
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2-4 Years"
                      value={form.experience}
                      onChange={(e) => setForm({ ...form, experience: e.target.value })}
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

                  {/* Salary & Deadline */}
                  <div className="col-12 col-md-6">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Compensation / Salary Range
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Competitive / ₹8 - ₹14 LPA"
                      value={form.salary}
                      onChange={(e) => setForm({ ...form, salary: e.target.value })}
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

                  <div className="col-12 col-md-6">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Application Deadline (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 30 Nov 2026 / Open until filled"
                      value={form.deadline}
                      onChange={(e) => setForm({ ...form, deadline: e.target.value })}
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

                  {/* Overview Description */}
                  <div className="col-12">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Role Overview & Mission
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe what makes this position impactful and how the candidate will contribute..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
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

                  {/* Requirements List */}
                  <div className="col-12">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Candidate Requirements
                    </label>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                      <input
                        type="text"
                        placeholder="Add a required qualification or skill..."
                        value={reqInput}
                        onChange={(e) => setReqInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddReq();
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
                        onClick={handleAddReq}
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

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {form.requirements.map((req, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: "rgba(15, 23, 42, 0.8)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            color: "#cbd5e1",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "0.8rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>• {req}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveReq(idx)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#f87171",
                              cursor: "pointer",
                              padding: "0 4px",
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Responsibilities List */}
                  <div className="col-12">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Key Responsibilities
                    </label>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                      <input
                        type="text"
                        placeholder="Add a key responsibility..."
                        value={respInput}
                        onChange={(e) => setRespInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddResp();
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
                        onClick={handleAddResp}
                        style={{
                          background: "rgba(16, 185, 129, 0.2)",
                          color: "#34d399",
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

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {form.responsibilities.map((resp, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: "rgba(15, 23, 42, 0.8)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            color: "#cbd5e1",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "0.8rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>✓ {resp}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveResp(idx)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#f87171",
                              cursor: "pointer",
                              padding: "0 4px",
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="col-12">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Required Tech / Skills
                    </label>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                      <input
                        type="text"
                        placeholder="e.g. React, Node.js, AWS, TypeScript..."
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSkill();
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
                        onClick={handleAddSkill}
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
                        Add Skill
                      </button>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {form.skills.map((s, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: "rgba(245, 32, 41, 0.15)",
                            border: "1px solid rgba(245, 32, 41, 0.3)",
                            color: "#fca5a5",
                            padding: "3px 9px",
                            borderRadius: "6px",
                            fontSize: "0.78rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <span>{s}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(s)}
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
                    <span>{editId ? "Save Position" : "Publish Job Opening"}</span>
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
              Delete Job Posting?
            </h4>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", marginBottom: "20px" }}>
              Are you sure you want to permanently remove this career opening?
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
export default JobsManager;
