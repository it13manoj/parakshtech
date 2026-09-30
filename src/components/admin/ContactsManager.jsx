import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import API from "../../Config/API";

export const ContactsManager = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Detail / Reply Modal
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("new");
  const [notesUpdate, setNotesUpdate] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  const token = localStorage.getItem("pt_admin_token");
  const authHeaders = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  // Load inquiries
  const loadInquiries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API.BASE_URL}admin/contacts`, authHeaders);
      if (res.data?.success) {
        setInquiries(res.data.data || []);
      }
    } catch {
      // Inquiries might be empty initially
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchStatus = statusFilter === "all" || inq.status === statusFilter;
    if (!matchStatus) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      inq.name?.toLowerCase().includes(q) ||
      inq.email?.toLowerCase().includes(q) ||
      inq.phone?.toLowerCase().includes(q) ||
      inq.subject?.toLowerCase().includes(q) ||
      inq.contents?.toLowerCase().includes(q)
    );
  });

  // Open inquiry detail
  const handleOpenDetail = (inq) => {
    setSelectedInquiry(inq);
    setStatusUpdate(inq.status || "new");
    setNotesUpdate(inq.notes || "");
  };

  // Update status or notes
  const handleUpdateStatus = async (id, newStatus, newNotes = null) => {
    try {
      setSavingNote(true);
      const payload = { status: newStatus };
      if (newNotes !== null) payload.notes = newNotes;

      await axios.patch(`${API.BASE_URL}admin/contacts/${id}`, payload, authHeaders);

      setInquiries((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus, ...(newNotes !== null ? { notes: newNotes } : {}) } : item
        )
      );

      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry((prev) => ({
          ...prev,
          status: newStatus,
          ...(newNotes !== null ? { notes: newNotes } : {}),
        }));
      }

      setToastMsg("Inquiry status updated successfully!");
      setTimeout(() => setToastMsg(""), 3000);
    } catch {
      setToastMsg("Failed to update status");
      setTimeout(() => setToastMsg(""), 3000);
    } finally {
      setSavingNote(false);
    }
  };

  // Delete inquiry
  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await axios.delete(`${API.BASE_URL}admin/contacts/${deleteConfirmId}`, authHeaders);
      setInquiries((prev) => prev.filter((i) => i.id !== deleteConfirmId));
      if (selectedInquiry?.id === deleteConfirmId) {
        setSelectedInquiry(null);
      }
      setDeleteConfirmId(null);
      setToastMsg("Inquiry removed");
      setTimeout(() => setToastMsg(""), 3000);
    } catch {
      setToastMsg("Failed to delete inquiry");
      setTimeout(() => setToastMsg(""), 3000);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "new":
        return {
          bg: "rgba(245, 158, 11, 0.15)",
          color: "#fbbf24",
          border: "rgba(245, 158, 11, 0.3)",
          label: "New Lead",
          icon: "fas fa-bell",
        };
      case "in_progress":
        return {
          bg: "rgba(59, 130, 246, 0.15)",
          color: "#60a5fa",
          border: "rgba(59, 130, 246, 0.3)",
          label: "In Discussion",
          icon: "fas fa-spinner fa-spin",
        };
      case "contacted":
        return {
          bg: "rgba(16, 185, 129, 0.15)",
          color: "#34d399",
          border: "rgba(16, 185, 129, 0.3)",
          label: "Contacted",
          icon: "fas fa-check-circle",
        };
      case "archived":
        return {
          bg: "rgba(100, 116, 139, 0.15)",
          color: "#94a3b8",
          border: "rgba(100, 116, 139, 0.3)",
          label: "Archived",
          icon: "fas fa-archive",
        };
      default:
        return {
          bg: "rgba(100, 116, 139, 0.15)",
          color: "#94a3b8",
          border: "rgba(100, 116, 139, 0.3)",
          label: status,
          icon: "fas fa-circle",
        };
    }
  };

  const newCount = inquiries.filter((i) => i.status === "new").length;
  const inProgressCount = inquiries.filter((i) => i.status === "in_progress").length;
  const contactedCount = inquiries.filter((i) => i.status === "contacted").length;

  return (
    <div>
      {/* Top Action Bar */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#ffffff", margin: 0 }}>
            Client Inquiries & Leads Inbox
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: "4px 0 0 0" }}>
            Review and respond to messages submitted via the Contact Us form and project estimation requests.
          </p>
        </div>

        <button
          type="button"
          onClick={loadInquiries}
          style={{
            background: "rgba(30, 41, 59, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "#ffffff",
            padding: "9px 18px",
            borderRadius: "10px",
            fontWeight: "600",
            fontSize: "0.85rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <i className="fas fa-sync-alt" />
          <span>Refresh Inbox</span>
        </button>
      </div>

      {toastMsg && (
        <div
          style={{
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            color: "#34d399",
            padding: "10px 16px",
            borderRadius: "10px",
            marginBottom: "18px",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <i className="fas fa-check-circle" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
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
              <i className="fas fa-inbox" />
            </div>
            <div>
              <div style={{ color: "#94a3b8", fontSize: "0.82rem", fontWeight: "500" }}>
                Total Messages
              </div>
              <div style={{ color: "#ffffff", fontSize: "1.45rem", fontWeight: "800" }}>
                {inquiries.length}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
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
                background: "rgba(245, 158, 11, 0.15)",
                color: "#fbbf24",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
              }}
            >
              <i className="fas fa-envelope-open-text" />
            </div>
            <div>
              <div style={{ color: "#94a3b8", fontSize: "0.82rem", fontWeight: "500" }}>
                New Leads
              </div>
              <div style={{ color: "#fbbf24", fontSize: "1.45rem", fontWeight: "800" }}>
                {newCount}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
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
                color: "#60a5fa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
              }}
            >
              <i className="fas fa-comments" />
            </div>
            <div>
              <div style={{ color: "#94a3b8", fontSize: "0.82rem", fontWeight: "500" }}>
                In Discussion
              </div>
              <div style={{ color: "#60a5fa", fontSize: "1.45rem", fontWeight: "800" }}>
                {inProgressCount}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
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
                color: "#34d399",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
              }}
            >
              <i className="fas fa-check-double" />
            </div>
            <div>
              <div style={{ color: "#94a3b8", fontSize: "0.82rem", fontWeight: "500" }}>
                Contacted & Closed
              </div>
              <div style={{ color: "#34d399", fontSize: "1.45rem", fontWeight: "800" }}>
                {contactedCount}
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
            placeholder="Search leads by name, email, phone, subject..."
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

        <div style={{ display: "flex", gap: "8px", overflowX: "auto" }}>
          {[
            { id: "all", label: "All Messages" },
            { id: "new", label: `New (${newCount})` },
            { id: "in_progress", label: "In Discussion" },
            { id: "contacted", label: "Contacted" },
            { id: "archived", label: "Archived" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              style={{
                padding: "7px 14px",
                borderRadius: "8px",
                fontSize: "0.8rem",
                fontWeight: "600",
                cursor: "pointer",
                border: "none",
                background: statusFilter === tab.id ? "var(--pt-primary)" : "rgba(15, 23, 42, 0.8)",
                color: statusFilter === tab.id ? "#ffffff" : "#94a3b8",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Table / List */}
      {loading ? (
        <div className="text-center py-5" style={{ color: "#94a3b8" }}>
          <i className="fas fa-spinner fa-spin fa-2x mb-3 d-block" style={{ color: "var(--pt-primary)" }} />
          Loading messages from database...
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div
          style={{
            background: "rgba(30, 41, 59, 0.3)",
            border: "1px dashed rgba(255, 255, 255, 0.15)",
            borderRadius: "16px",
            padding: "50px 20px",
            textAlign: "center",
          }}
        >
          <i className="fas fa-inbox fa-3x mb-3" style={{ color: "#475569" }} />
          <h4 style={{ color: "#ffffff", fontWeight: "700" }}>No inquiries found</h4>
          <p style={{ color: "#94a3b8", fontSize: "0.88rem", maxWidth: "420px", margin: "0 auto" }}>
            {search
              ? "No messages match your search filter."
              : "Submissions from your public Contact Us page will automatically appear here."}
          </p>
        </div>
      ) : (
        <div
          style={{
            background: "rgba(30, 41, 59, 0.45)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <div className="table-responsive">
            <table
              className="table table-borderless align-middle mb-0"
              style={{ color: "#cbd5e1", fontSize: "0.86rem" }}
            >
              <thead
                style={{
                  background: "rgba(15, 23, 42, 0.8)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#94a3b8",
                  fontSize: "0.78rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                <tr>
                  <th style={{ padding: "14px 20px" }}>Client</th>
                  <th style={{ padding: "14px 20px" }}>Subject & Message</th>
                  <th style={{ padding: "14px 20px" }}>Status</th>
                  <th style={{ padding: "14px 20px" }}>Date</th>
                  <th style={{ padding: "14px 20px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map((inq) => {
                  const badge = getStatusBadge(inq.status);
                  const dateStr = inq.createdAt
                    ? new Date(inq.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recent";

                  return (
                    <tr
                      key={inq.id}
                      style={{
                        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {/* Client */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ fontWeight: "700", color: "#ffffff", fontSize: "0.92rem" }}>
                          {inq.name}
                        </div>
                        <div style={{ color: "#60a5fa", fontSize: "0.8rem" }}>
                          <i className="fas fa-envelope me-1" />
                          <a
                            href={`mailto:${inq.email}`}
                            style={{ color: "inherit", textDecoration: "none" }}
                          >
                            {inq.email}
                          </a>
                        </div>
                        {inq.phone && (
                          <div style={{ color: "#94a3b8", fontSize: "0.78rem" }}>
                            <i className="fas fa-phone me-1" />
                            <a
                              href={`tel:${inq.phone}`}
                              style={{ color: "inherit", textDecoration: "none" }}
                            >
                              {inq.phone}
                            </a>
                          </div>
                        )}
                      </td>

                      {/* Subject & Preview */}
                      <td style={{ padding: "16px 20px", maxWidth: "340px" }}>
                        <div
                          style={{
                            fontWeight: "600",
                            color: "#e2e8f0",
                            marginBottom: "3px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {inq.subject || "Project Inquiry"}
                        </div>
                        <div
                          style={{
                            color: "#94a3b8",
                            fontSize: "0.8rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {inq.contents}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "16px 20px" }}>
                        <span
                          style={{
                            background: badge.bg,
                            border: `1px solid ${badge.border}`,
                            color: badge.color,
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <i className={badge.icon} style={{ fontSize: "0.7rem" }} />
                          <span>{badge.label}</span>
                        </span>
                      </td>

                      {/* Date */}
                      <td style={{ padding: "16px 20px", color: "#94a3b8", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                        {dateStr}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "16px 20px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(inq)}
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
                            <i className="fas fa-eye me-1" /> View
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(inq.id)}
                            style={{
                              background: "rgba(239, 68, 68, 0.15)",
                              color: "#f87171",
                              border: "none",
                              padding: "6px 10px",
                              borderRadius: "8px",
                              fontSize: "0.8rem",
                              fontWeight: "600",
                              cursor: "pointer",
                            }}
                          >
                            <i className="fas fa-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Detail Modal ── */}
      {selectedInquiry && (
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
              maxWidth: "680px",
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
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#ffffff", margin: 0 }}>
                  Inquiry from {selectedInquiry.name}
                </h3>
                <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                  Received on {new Date(selectedInquiry.createdAt || Date.now()).toLocaleString()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
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
              {/* Contact info cards */}
              <div className="row g-2 mb-4">
                <div className="col-12 col-sm-6">
                  <div
                    style={{
                      background: "rgba(15, 23, 42, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "10px",
                      padding: "12px",
                    }}
                  >
                    <div style={{ fontSize: "0.74rem", color: "#64748b", textTransform: "uppercase" }}>
                      Email Address
                    </div>
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      style={{ color: "#60a5fa", fontWeight: "600", fontSize: "0.88rem", textDecoration: "none" }}
                    >
                      <i className="fas fa-paper-plane me-1" /> {selectedInquiry.email}
                    </a>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div
                    style={{
                      background: "rgba(15, 23, 42, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "10px",
                      padding: "12px",
                    }}
                  >
                    <div style={{ fontSize: "0.74rem", color: "#64748b", textTransform: "uppercase" }}>
                      Phone / Mobile
                    </div>
                    {selectedInquiry.phone ? (
                      <a
                        href={`tel:${selectedInquiry.phone}`}
                        style={{ color: "#34d399", fontWeight: "600", fontSize: "0.88rem", textDecoration: "none" }}
                      >
                        <i className="fas fa-phone-alt me-1" /> {selectedInquiry.phone}
                      </a>
                    ) : (
                      <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Not provided</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "0.76rem", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>
                  Subject
                </div>
                <div
                  style={{
                    background: "rgba(15, 23, 42, 0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    color: "#ffffff",
                    fontWeight: "600",
                    fontSize: "0.92rem",
                  }}
                >
                  {selectedInquiry.subject || "No subject"}
                </div>
              </div>

              {/* Message Content */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "0.76rem", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>
                  Message Content
                </div>
                <div
                  style={{
                    background: "rgba(15, 23, 42, 0.7)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "10px",
                    padding: "16px",
                    color: "#e2e8f0",
                    fontSize: "0.88rem",
                    lineHeight: "1.6",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selectedInquiry.contents}
                </div>
              </div>

              {/* Status Selector & Internal Notes */}
              <div
                style={{
                  background: "rgba(15, 23, 42, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "12px",
                  padding: "16px",
                }}
              >
                <div className="row g-3">
                  <div className="col-12 col-md-5">
                    <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Update Status
                    </label>
                    <select
                      value={statusUpdate}
                      onChange={(e) => setStatusUpdate(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        background: "rgba(15, 23, 42, 0.8)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        color: "#ffffff",
                        fontSize: "0.85rem",
                      }}
                    >
                      <option value="new">New Lead</option>
                      <option value="in_progress">In Discussion</option>
                      <option value="contacted">Contacted / Closed</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-7">
                    <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Internal Staff Notes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sent proposal via email on Thursday..."
                      value={notesUpdate}
                      onChange={(e) => setNotesUpdate(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        background: "rgba(15, 23, 42, 0.8)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        color: "#ffffff",
                        fontSize: "0.85rem",
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: "12px", textAlign: "right" }}>
                  <button
                    type="button"
                    disabled={savingNote}
                    onClick={() => handleUpdateStatus(selectedInquiry.id, statusUpdate, notesUpdate)}
                    style={{
                      background: "var(--pt-primary)",
                      color: "#fff",
                      border: "none",
                      padding: "8px 18px",
                      borderRadius: "8px",
                      fontSize: "0.82rem",
                      fontWeight: "700",
                      cursor: savingNote ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {savingNote && <i className="fas fa-spinner fa-spin" />}
                    <span>Save Status & Notes</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(15, 23, 42, 0.6)",
              }}
            >
              <a
                href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(
                  selectedInquiry.subject || "Your inquiry with Paraksh Technologies"
                )}`}
                style={{
                  background: "linear-gradient(135deg, var(--pt-primary) 0%, #b8141b 100%)",
                  color: "#ffffff",
                  textDecoration: "none",
                  padding: "9px 20px",
                  borderRadius: "10px",
                  fontWeight: "700",
                  fontSize: "0.85rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <i className="fas fa-reply" />
                <span>Reply via Email</span>
              </a>

              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
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
                Close
              </button>
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
              Delete Inquiry?
            </h4>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", marginBottom: "20px" }}>
              Are you sure you want to permanently delete this message record?
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
export default ContactsManager;
