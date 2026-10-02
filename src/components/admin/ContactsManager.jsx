import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import API from "../../Config/API";

// Helper: Extract sender initials
const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Helper: Consistent avatar background color based on sender name
const getAvatarBg = (name) => {
  const colors = [
    "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    "linear-gradient(135deg, #10b981 0%, #047857 100%)",
    "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
    "linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)",
    "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
  ];
  let hash = 0;
  for (let i = 0; i < (name || "").length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Helper: Formatted short date for email list
const formatShortDate = (isoStr) => {
  if (!isoStr) return "Recent";
  const date = new Date(isoStr);
  if (isNaN(date.getTime())) return "Recent";

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

// Helper: Formatted full date & time for letterhead
const formatFullDate = (isoStr) => {
  if (!isoStr) return "Unknown date";
  const date = new Date(isoStr);
  if (isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleString([], {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const STATUS_CONFIG = {
  new: {
    bg: "rgba(245, 158, 11, 0.15)",
    color: "#fbbf24",
    border: "rgba(245, 158, 11, 0.3)",
    label: "New Lead",
    icon: "fas fa-bell",
  },
  in_progress: {
    bg: "rgba(59, 130, 246, 0.15)",
    color: "#60a5fa",
    border: "rgba(59, 130, 246, 0.3)",
    label: "In Discussion",
    icon: "fas fa-comments",
  },
  contacted: {
    bg: "rgba(16, 185, 129, 0.15)",
    color: "#34d399",
    border: "rgba(16, 185, 129, 0.3)",
    label: "Contacted",
    icon: "fas fa-check-circle",
  },
  archived: {
    bg: "rgba(100, 116, 139, 0.15)",
    color: "#94a3b8",
    border: "rgba(100, 116, 139, 0.3)",
    label: "Archived",
    icon: "fas fa-archive",
  },
};

const REPLY_TEMPLATES = [
  {
    id: "ack",
    label: "Acknowledge Lead",
    subjectPrefix: "Re: ",
    body: (name, subject) =>
      `Hi ${name},\n\nThank you for reaching out to Paraksh Technologies regarding "${subject}".\n\nWe have received your requirements and one of our solution architects will review them and follow up with you within 24 hours.\n\nBest regards,\nParaksh Technologies Team\nsupport@parakshtech.com`,
  },
  {
    id: "call",
    label: "Schedule Discovery Call",
    subjectPrefix: "Discovery Call: ",
    body: (name, subject) =>
      `Hi ${name},\n\nThanks for contacting Paraksh Technologies regarding "${subject}".\n\nWe would love to schedule a brief 15-minute technical discovery call to discuss your project vision, timeline, and architecture options.\n\nPlease let us know what time slots work best for you this week.\n\nLooking forward to speaking with you!\n\nBest regards,\nParaksh Technologies Team`,
  },
  {
    id: "quote",
    label: "Request Project Specs",
    subjectPrefix: "Project Details Request: ",
    body: (name, subject) =>
      `Hi ${name},\n\nThank you for contacting Paraksh Technologies.\n\nTo help us prepare an accurate proposal and estimate for "${subject}", could you please share a few details:\n1. Preferred timeline & launch date\n2. Key features or integrations required\n3. Target audience and scale\n\nWe look forward to collaborating with you.\n\nBest regards,\nParaksh Technologies Team`,
  },
];

export const ContactsManager = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc"); // 'desc' | 'asc'

  // Selected email for reading pane
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Email reading state
  const [notesUpdate, setNotesUpdate] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Mobile layout state
  const [isMobileView, setIsMobileView] = useState(false);

  const token = localStorage.getItem("pt_admin_token");
  const authHeaders = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  // Responsive listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 992);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load inquiries
  const loadInquiries = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API.BASE_URL}admin/contacts`, authHeaders);
      if (res.data?.success) {
        const data = res.data.data || [];
        setInquiries(data);
        // Automatically select the first message on desktop if none selected
        if (data.length > 0 && !selectedInquiry && window.innerWidth >= 992) {
          setSelectedInquiry(data[0]);
          setNotesUpdate(data[0].notes || "");
        }
      }
    } catch {
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  }, [authHeaders, selectedInquiry]);

  useEffect(() => {
    loadInquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update selected inquiry notes when selected message changes
  useEffect(() => {
    if (selectedInquiry) {
      setNotesUpdate(selectedInquiry.notes || "");
    }
  }, [selectedInquiry]);

  // Status badges & counts
  const newCount = inquiries.filter((i) => i.status === "new").length;
  const inProgressCount = inquiries.filter((i) => i.status === "in_progress").length;
  const contactedCount = inquiries.filter((i) => i.status === "contacted").length;
  const archivedCount = inquiries.filter((i) => i.status === "archived").length;

  // Filtered & Sorted Inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries
      .filter((inq) => {
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
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
  }, [inquiries, statusFilter, search, sortOrder]);

  // When selected inquiry gets deleted or filtered out, manage selection
  useEffect(() => {
    if (selectedInquiry && !filteredInquiries.some((i) => i.id === selectedInquiry.id)) {
      if (filteredInquiries.length > 0 && !isMobileView) {
        setSelectedInquiry(filteredInquiries[0]);
      } else if (isMobileView) {
        setSelectedInquiry(null);
      }
    }
  }, [filteredInquiries, selectedInquiry, isMobileView]);

  // Update status or notes
  const handleUpdateStatus = async (id, newStatus, newNotes = null) => {
    try {
      setSavingNote(true);
      const payload = { status: newStatus };
      if (newNotes !== null) payload.notes = newNotes;

      await axios.patch(`${API.BASE_URL}admin/contacts/${id}`, payload, authHeaders);

      setInquiries((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: newStatus, ...(newNotes !== null ? { notes: newNotes } : {}) }
            : item
        )
      );

      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry((prev) => ({
          ...prev,
          status: newStatus,
          ...(newNotes !== null ? { notes: newNotes } : {}),
        }));
      }

      setToastMsg(`Status changed to ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
      setTimeout(() => setToastMsg(""), 3000);
    } catch {
      setToastMsg("Failed to update status");
      setTimeout(() => setToastMsg(""), 3000);
    } finally {
      setSavingNote(false);
    }
  };

  // Save internal notes
  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    try {
      setSavingNote(true);
      await axios.patch(
        `${API.BASE_URL}admin/contacts/${selectedInquiry.id}`,
        { notes: notesUpdate },
        authHeaders
      );

      setInquiries((prev) =>
        prev.map((item) =>
          item.id === selectedInquiry.id ? { ...item, notes: notesUpdate } : item
        )
      );

      setSelectedInquiry((prev) => ({
        ...prev,
        notes: notesUpdate,
      }));

      setToastMsg("Internal staff notes saved successfully!");
      setTimeout(() => setToastMsg(""), 3000);
    } catch {
      setToastMsg("Failed to save notes");
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
        const remaining = inquiries.filter((i) => i.id !== deleteConfirmId);
        setSelectedInquiry(remaining.length > 0 && !isMobileView ? remaining[0] : null);
      }

      setDeleteConfirmId(null);
      setToastMsg("Message deleted successfully");
      setTimeout(() => setToastMsg(""), 3000);
    } catch {
      setToastMsg("Failed to delete inquiry");
      setTimeout(() => setToastMsg(""), 3000);
    }
  };

  // Copy to clipboard helpers
  const handleCopyEmail = (email) => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = (phone) => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  // Launch email reply with template
  const handleReplyTemplate = (tpl) => {
    if (!selectedInquiry) return;
    const subject = encodeURIComponent(`${tpl.subjectPrefix}${selectedInquiry.subject || "Project Inquiry"}`);
    const body = encodeURIComponent(tpl.body(selectedInquiry.name, selectedInquiry.subject || "your project inquiry"));
    window.location.href = `mailto:${selectedInquiry.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div style={{ paddingBottom: "30px" }}>
      {/* ── Top Header & Actions ── */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#ffffff", margin: 0 }}>
              Client Messages & Inquiries
            </h2>
            <span
              style={{
                background: "rgba(245, 32, 41, 0.15)",
                color: "var(--pt-primary)",
                border: "1px solid rgba(245, 32, 41, 0.3)",
                padding: "3px 10px",
                borderRadius: "20px",
                fontSize: "0.75rem",
                fontWeight: "700",
              }}
            >
              Unified Webmail
            </span>
          </div>
          <p style={{ color: "#94a3b8", fontSize: "0.88rem", margin: "4px 0 0 0" }}>
            Inbox layout to review, track, and reply to all leads sent from the website contact forms.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
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
              transition: "all 0.2s",
            }}
          >
            <i className={`fas fa-sync-alt ${loading ? "fa-spin" : ""}`} />
            <span>Refresh Inbox</span>
          </button>
        </div>
      </div>

      {/* ── Toast Notification ── */}
      {toastMsg && (
        <div
          style={{
            background: "rgba(16, 185, 129, 0.18)",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            color: "#34d399",
            padding: "10px 16px",
            borderRadius: "10px",
            marginBottom: "16px",
            fontSize: "0.86rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
          }}
        >
          <i className="fas fa-check-circle" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── Status Metrics Cards ── */}
      <div className="row g-2 mb-3">
        {[
          {
            id: "all",
            label: "All Messages",
            count: inquiries.length,
            icon: "fas fa-inbox",
            color: "var(--pt-primary)",
            bg: "rgba(245, 32, 41, 0.12)",
          },
          {
            id: "new",
            label: "New Leads",
            count: newCount,
            icon: "fas fa-bell",
            color: "#fbbf24",
            bg: "rgba(245, 158, 11, 0.12)",
          },
          {
            id: "in_progress",
            label: "In Discussion",
            count: inProgressCount,
            icon: "fas fa-comments",
            color: "#60a5fa",
            bg: "rgba(59, 130, 246, 0.12)",
          },
          {
            id: "contacted",
            label: "Contacted",
            count: contactedCount,
            icon: "fas fa-check-circle",
            color: "#34d399",
            bg: "rgba(16, 185, 129, 0.12)",
          },
          {
            id: "archived",
            label: "Archived",
            count: archivedCount,
            icon: "fas fa-archive",
            color: "#94a3b8",
            bg: "rgba(100, 116, 139, 0.12)",
          },
        ].map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <div key={tab.id} className="col">
              <button
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  width: "100%",
                  background: isActive ? "rgba(30, 41, 59, 0.95)" : "rgba(30, 41, 59, 0.4)",
                  border: isActive
                    ? `1.5px solid ${tab.color}`
                    : "1px solid rgba(255, 255, 255, 0.07)",
                  borderRadius: "12px",
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: tab.bg,
                      color: tab.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.85rem",
                    }}
                  >
                    <i className={tab.icon} />
                  </div>
                  <div>
                    <div style={{ color: "#94a3b8", fontSize: "0.74rem", fontWeight: "600", textTransform: "uppercase" }}>
                      {tab.label}
                    </div>
                    <div style={{ color: "#ffffff", fontSize: "1.1rem", fontWeight: "800", lineHeight: 1.2 }}>
                      {tab.count}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Unified Email Client Container ── */}
      <div
        style={{
          background: "#0f172a",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          overflow: "hidden",
          minHeight: "700px",
          height: isMobileView ? "auto" : "calc(100vh - 280px)",
          maxHeight: isMobileView ? "none" : "850px",
          display: "flex",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* ══════════════════════════════════════════════════
            LEFT COLUMN: INBOX FEED LIST
           ══════════════════════════════════════════════════ */}
        <div
          style={{
            width: isMobileView ? "100%" : "400px",
            minWidth: isMobileView ? "100%" : "360px",
            maxWidth: isMobileView ? "100%" : "420px",
            borderRight: isMobileView ? "none" : "1px solid rgba(255, 255, 255, 0.08)",
            display: isMobileView && selectedInquiry ? "none" : "flex",
            flexDirection: "column",
            background: "rgba(15, 23, 42, 0.98)",
          }}
        >
          {/* Inbox Search & Filter Bar */}
          <div
            style={{
              padding: "16px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              background: "rgba(30, 41, 59, 0.3)",
            }}
          >
            {/* Search Box */}
            <div style={{ position: "relative", marginBottom: "12px" }}>
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
                placeholder="Search sender, email, subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 34px 9px 38px",
                  background: "rgba(30, 41, 59, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "10px",
                  color: "#ffffff",
                  fontSize: "0.84rem",
                  outline: "none",
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* List Toolbar / Count & Sort */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "0.76rem",
                color: "#94a3b8",
              }}
            >
              <span>
                <strong>{filteredInquiries.length}</strong> {filteredInquiries.length === 1 ? "message" : "messages"}
                {statusFilter !== "all" && ` in ${statusFilter.replace("_", " ")}`}
              </span>
              <button
                type="button"
                onClick={() => setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  fontSize: "0.76rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <i className={`fas fa-sort-amount-${sortOrder === "desc" ? "down" : "up"}`} />
                <span>{sortOrder === "desc" ? "Newest First" : "Oldest First"}</span>
              </button>
            </div>
          </div>

          {/* Messages Scrollable List */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              position: "relative",
            }}
          >
            {loading ? (
              <div className="text-center py-5" style={{ color: "#94a3b8" }}>
                <i className="fas fa-spinner fa-spin fa-2x mb-3 d-block" style={{ color: "var(--pt-primary)" }} />
                <span>Loading mailbox...</span>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "#64748b" }}>
                <i className="fas fa-inbox fa-3x mb-3" style={{ opacity: 0.5 }} />
                <h5 style={{ color: "#94a3b8", fontSize: "0.95rem", fontWeight: "600" }}>No messages found</h5>
                <p style={{ fontSize: "0.8rem", margin: "6px 0 0 0" }}>
                  {search ? "No inquiries match your search." : "No inquiries in this folder."}
                </p>
              </div>
            ) : (
              <div>
                {filteredInquiries.map((inq) => {
                  const isSelected = selectedInquiry?.id === inq.id;
                  const isNew = inq.status === "new";
                  const badge = STATUS_CONFIG[inq.status] || STATUS_CONFIG.new;

                  return (
                    <div
                      key={inq.id}
                      onClick={() => {
                        setSelectedInquiry(inq);
                        setNotesUpdate(inq.notes || "");
                      }}
                      style={{
                        padding: "14px 16px",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                        background: isSelected
                          ? "rgba(59, 130, 246, 0.12)"
                          : isNew
                          ? "rgba(245, 158, 11, 0.03)"
                          : "transparent",
                        borderLeft: isSelected
                          ? "4px solid var(--pt-primary)"
                          : isNew
                          ? "4px solid #fbbf24"
                          : "4px solid transparent",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = isNew
                            ? "rgba(245, 158, 11, 0.03)"
                            : "transparent";
                        }
                      }}
                    >
                      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                        {/* Avatar */}
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "10px",
                            background: getAvatarBg(inq.name),
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "700",
                            fontSize: "0.85rem",
                            flexShrink: 0,
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                          }}
                        >
                          {getInitials(inq.name)}
                        </div>

                        {/* Content Header & Snippet */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {/* Sender name & Date */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "3px",
                            }}
                          >
                            <span
                              style={{
                                color: isNew ? "#ffffff" : "#cbd5e1",
                                fontWeight: isNew ? "700" : "600",
                                fontSize: "0.88rem",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {inq.name}
                            </span>
                            <span
                              style={{
                                fontSize: "0.72rem",
                                color: isNew ? "#fbbf24" : "#64748b",
                                fontWeight: isNew ? "600" : "500",
                                flexShrink: 0,
                                marginLeft: "8px",
                              }}
                            >
                              {formatShortDate(inq.createdAt)}
                            </span>
                          </div>

                          {/* Subject */}
                          <div
                            style={{
                              color: isSelected ? "#ffffff" : "#94a3b8",
                              fontWeight: isNew ? "600" : "500",
                              fontSize: "0.82rem",
                              marginBottom: "4px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {inq.subject || "No Subject"}
                          </div>

                          {/* Message Excerpt */}
                          <div
                            style={{
                              color: "#64748b",
                              fontSize: "0.78rem",
                              lineHeight: "1.35",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              marginBottom: "8px",
                            }}
                          >
                            {inq.contents}
                          </div>

                          {/* Status Chip & Indicators */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span
                              style={{
                                background: badge.bg,
                                color: badge.color,
                                border: `1px solid ${badge.border}`,
                                padding: "2px 8px",
                                borderRadius: "12px",
                                fontSize: "0.7rem",
                                fontWeight: "600",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <i className={badge.icon} style={{ fontSize: "0.65rem" }} />
                              <span>{badge.label}</span>
                            </span>

                            {inq.phone && (
                              <span
                                title={`Phone: ${inq.phone}`}
                                style={{ color: "#64748b", fontSize: "0.72rem" }}
                              >
                                <i className="fas fa-phone me-1" />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            RIGHT COLUMN: READING PANE & LETTERHEAD
           ══════════════════════════════════════════════════ */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: isMobileView && !selectedInquiry ? "none" : "flex",
            flexDirection: "column",
            background: "#0b0f19",
            overflow: "hidden",
          }}
        >
          {selectedInquiry ? (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>
              {/* ── Email Action Bar ── */}
              <div
                style={{
                  padding: "14px 20px",
                  background: "rgba(15, 23, 42, 0.8)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                }}
              >
                {/* Mobile Back Button & Navigation */}
                <div className="d-flex align-items-center gap-2">
                  {isMobileView && (
                    <button
                      type="button"
                      onClick={() => setSelectedInquiry(null)}
                      style={{
                        background: "rgba(30, 41, 59, 0.8)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "#cbd5e1",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "0.82rem",
                        cursor: "pointer",
                      }}
                    >
                      <i className="fas fa-arrow-left me-1" /> Back
                    </button>
                  )}

                  {/* Status Dropdown Picker */}
                  <div className="d-flex align-items-center gap-1">
                    <span style={{ fontSize: "0.75rem", color: "#64748b", marginRight: "4px" }}>Status:</span>
                    {Object.keys(STATUS_CONFIG).map((statusKey) => {
                      const cfg = STATUS_CONFIG[statusKey];
                      const isCurrent = selectedInquiry.status === statusKey;
                      return (
                        <button
                          key={statusKey}
                          type="button"
                          onClick={() => handleUpdateStatus(selectedInquiry.id, statusKey)}
                          style={{
                            background: isCurrent ? cfg.bg : "rgba(30, 41, 59, 0.6)",
                            border: isCurrent
                              ? `1.5px solid ${cfg.border}`
                              : "1px solid rgba(255, 255, 255, 0.06)",
                            color: isCurrent ? cfg.color : "#94a3b8",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: isCurrent ? "700" : "500",
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                        >
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Email Actions: Reply, Delete, Copy, Print */}
                <div className="d-flex align-items-center gap-2">
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(
                      selectedInquiry.subject || "Your Inquiry with Paraksh Technologies"
                    )}`}
                    style={{
                      background: "linear-gradient(135deg, var(--pt-primary) 0%, #b8141b 100%)",
                      color: "#ffffff",
                      textDecoration: "none",
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                      fontWeight: "700",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <i className="fas fa-reply" />
                    <span>Reply</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopyEmail(selectedInquiry.email)}
                    title="Copy sender email address"
                    style={{
                      background: "rgba(30, 41, 59, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      color: copiedEmail ? "#34d399" : "#cbd5e1",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                    }}
                  >
                    <i className={copiedEmail ? "fas fa-check me-1" : "fas fa-copy me-1"} />
                    <span>{copiedEmail ? "Copied" : "Copy Email"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    title="Print message letterhead"
                    style={{
                      background: "rgba(30, 41, 59, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      color: "#cbd5e1",
                      padding: "6px 10px",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                    }}
                  >
                    <i className="fas fa-print" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(selectedInquiry.id)}
                    title="Delete message"
                    style={{
                      background: "rgba(239, 68, 68, 0.15)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      color: "#f87171",
                      padding: "6px 10px",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                    }}
                  >
                    <i className="fas fa-trash-alt" />
                  </button>
                </div>
              </div>

              {/* ── Letterhead Header ── */}
              <div
                style={{
                  padding: "24px",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  background: "rgba(15, 23, 42, 0.4)",
                }}
              >
                {/* Subject Line */}
                <h3
                  style={{
                    color: "#ffffff",
                    fontSize: "1.35rem",
                    fontWeight: "800",
                    margin: "0 0 16px 0",
                    lineHeight: "1.3",
                  }}
                >
                  {selectedInquiry.subject || "Project Inquiry"}
                </h3>

                {/* Sender Banner */}
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "14px",
                      background: getAvatarBg(selectedInquiry.name),
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(selectedInquiry.name)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ color: "#ffffff", fontWeight: "700", fontSize: "1.05rem" }}>
                        {selectedInquiry.name}
                      </span>
                      <span
                        style={{
                          background: STATUS_CONFIG[selectedInquiry.status]?.bg || "rgba(245, 158, 11, 0.15)",
                          color: STATUS_CONFIG[selectedInquiry.status]?.color || "#fbbf24",
                          border: `1px solid ${STATUS_CONFIG[selectedInquiry.status]?.border || "transparent"}`,
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "0.72rem",
                          fontWeight: "600",
                        }}
                      >
                        {STATUS_CONFIG[selectedInquiry.status]?.label || selectedInquiry.status}
                      </span>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "0.82rem", color: "#94a3b8" }}>
                      {/* Email */}
                      <div>
                        <span style={{ color: "#64748b" }}>From: </span>
                        <a
                          href={`mailto:${selectedInquiry.email}`}
                          style={{ color: "#60a5fa", textDecoration: "none", fontWeight: "600" }}
                        >
                          {selectedInquiry.email}
                        </a>
                      </div>

                      {/* Phone */}
                      {selectedInquiry.phone && (
                        <div>
                          <span style={{ color: "#64748b" }}>Phone: </span>
                          <a
                            href={`tel:${selectedInquiry.phone}`}
                            style={{ color: "#34d399", textDecoration: "none", fontWeight: "600" }}
                          >
                            {selectedInquiry.phone}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopyPhone(selectedInquiry.phone)}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: copiedPhone ? "#34d399" : "#64748b",
                              cursor: "pointer",
                              padding: "0 4px",
                              fontSize: "0.75rem",
                            }}
                            title="Copy phone"
                          >
                            <i className={copiedPhone ? "fas fa-check" : "fas fa-copy"} />
                          </button>
                          <a
                            href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              background: "rgba(16, 185, 129, 0.15)",
                              color: "#34d399",
                              border: "1px solid rgba(16, 185, 129, 0.3)",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              textDecoration: "none",
                              fontSize: "0.72rem",
                              fontWeight: "600",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px",
                              marginLeft: "6px",
                            }}
                            title="Chat on WhatsApp"
                          >
                            <i className="fab fa-whatsapp" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      )}

                      {/* Recipient */}
                      <div>
                        <span style={{ color: "#64748b" }}>To: </span>
                        <span style={{ color: "#cbd5e1" }}>Paraksh Technologies Admin &lt;support@parakshtech.com&gt;</span>
                      </div>
                    </div>

                    {/* Date Received */}
                    <div style={{ marginTop: "6px", fontSize: "0.76rem", color: "#64748b" }}>
                      <i className="far fa-clock me-1" />
                      <span>{formatFullDate(selectedInquiry.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Letter Body Container ── */}
              <div style={{ padding: "28px 24px", flex: 1 }}>
                <div
                  style={{
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: "14px",
                    padding: "24px",
                    color: "#f1f5f9",
                    fontSize: "0.94rem",
                    lineHeight: "1.7",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {selectedInquiry.contents}
                </div>

                {/* ── Fast Reply Templates ── */}
                <div style={{ marginTop: "24px" }}>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: "700",
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <i className="fas fa-bolt" style={{ color: "var(--pt-primary)" }} />
                    <span>Quick Email Templates (One-Click Reply)</span>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {REPLY_TEMPLATES.map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => handleReplyTemplate(tpl)}
                        style={{
                          background: "rgba(30, 41, 59, 0.7)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          color: "#cbd5e1",
                          padding: "8px 14px",
                          borderRadius: "8px",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(59, 130, 246, 0.15)";
                          e.currentTarget.style.color = "#60a5fa";
                          e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(30, 41, 59, 0.7)";
                          e.currentTarget.style.color = "#cbd5e1";
                          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                        }}
                      >
                        <i className="fas fa-envelope-open-text" style={{ fontSize: "0.75rem" }} />
                        <span>{tpl.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Internal Staff Notes Section ── */}
                <div
                  style={{
                    marginTop: "24px",
                    background: "rgba(15, 23, 42, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "14px",
                    padding: "18px 20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: "700",
                        color: "#cbd5e1",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <i className="fas fa-sticky-note" style={{ color: "#fbbf24" }} />
                      <span>Internal CRM Notes (Staff Only)</span>
                    </div>
                    <span style={{ fontSize: "0.74rem", color: "#64748b" }}>
                      Private notes regarding proposals, phone calls, or quotes
                    </span>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="e.g. Called client on Wednesday. Sent initial estimate PDF via email. Awaiting approval..."
                    value={notesUpdate}
                    onChange={(e) => setNotesUpdate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      background: "rgba(30, 41, 59, 0.5)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "10px",
                      color: "#ffffff",
                      fontSize: "0.85rem",
                      outline: "none",
                      resize: "vertical",
                    }}
                  />

                  <div style={{ marginTop: "10px", textAlign: "right" }}>
                    <button
                      type="button"
                      disabled={savingNote}
                      onClick={handleSaveNotes}
                      style={{
                        background: "var(--pt-primary)",
                        color: "#ffffff",
                        border: "none",
                        padding: "7px 18px",
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
                      <span>Save Notes</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Empty Reader State */
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px",
                textAlign: "center",
                color: "#64748b",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "20px",
                  background: "rgba(30, 41, 59, 0.5)",
                  color: "#475569",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.4rem",
                  marginBottom: "18px",
                }}
              >
                <i className="fas fa-envelope-open-text" />
              </div>
              <h4 style={{ color: "#ffffff", fontWeight: "700", fontSize: "1.2rem", marginBottom: "8px" }}>
                Select a message to read
              </h4>
              <p style={{ maxWidth: "380px", fontSize: "0.88rem", margin: "0 auto", lineHeight: "1.5" }}>
                Choose an inquiry from the inbox on the left to inspect customer details, reply directly, update status, and manage notes.
              </p>
            </div>
          )}
        </div>
      </div>

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
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.6)",
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
              Delete Inquiry Message?
            </h4>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", marginBottom: "20px" }}>
              Are you sure you want to permanently delete this client inquiry? This action cannot be undone.
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
