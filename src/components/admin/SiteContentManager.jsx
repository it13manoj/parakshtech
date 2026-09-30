import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import API from "../../Config/API";

export const SiteContentManager = () => {
  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const token = localStorage.getItem("pt_admin_token");
  const authHeaders = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  // Hero state
  const [heroForm, setHeroForm] = useState({
    badge: "Next-Gen IT & Digital Engineering Solutions",
    title: "Architecting Intelligent Digital Systems That Scale.",
    heading:
      "We engineer enterprise software, cloud-native architectures, high-impact web applications, and AI integrations engineered for velocity, resilience, and exponential growth.",
    ctaPrimaryText: "Explore Solutions",
    ctaPrimaryLink: "/services",
    ctaSecondaryText: "Schedule a Call",
    ctaSecondaryLink: "/contact",
    metric1: "5+ Projects Delivered",
    metric2: "99.9% Uptime Guarantee",
    metric3: "24/7 Expert Support",
  });

  // About state
  const [aboutForm, setAboutForm] = useState({
    title: "About Paraksh Technologies",
    sub_heading: "Next-Gen Software Engineering & Scalable Systems",
    contents:
      "At Paraksh Technologies, we bridge business strategy with modern software engineering. Our team delivers enterprise-grade cloud systems, modern web portals, cross-platform mobile apps, and robust AI integrations built for high performance and continuous scalability.",
    experienceYears: "5+",
    projectsCompleted: "50+",
    clientSatisfaction: "99.8%",
    activeClients: "25+",
  });

  // Contact & Social state
  const [contactForm, setContactForm] = useState({
    phone: "+91 9296454675",
    email: "contact@parakshtech.com",
    address: "Pustakalaya Road, Buxar, Bihar, India",
    workingHours: "Mon - Sat: 9:00 AM - 7:00 PM IST",
    linkedin: "https://www.linkedin.com/company/parakshtech",
    facebook: "https://www.facebook.com/profile.php?id=61579256180141",
    instagram: "https://www.instagram.com/parakshtech/",
    twitter: "https://twitter.com/parakshtech",
  });

  // Load section content
  const loadContent = async () => {
    try {
      setLoading(true);
      // Hero
      try {
        const heroRes = await axios.get(`${API.BASE_URL}content/hero`);
        if (heroRes.data?.data) {
          const d = heroRes.data.data;
          const meta = typeof d.metadata === "string" ? JSON.parse(d.metadata || "{}") : d.metadata || {};
          setHeroForm((prev) => ({
            ...prev,
            title: d.title || prev.title,
            heading: d.heading || prev.heading,
            badge: d.sub_heading || prev.badge,
            ...meta,
          }));
        }
      } catch {}

      // About
      try {
        const aboutRes = await axios.get(`${API.BASE_URL}content/about`);
        if (aboutRes.data?.data) {
          const d = aboutRes.data.data;
          const meta = typeof d.metadata === "string" ? JSON.parse(d.metadata || "{}") : d.metadata || {};
          setAboutForm((prev) => ({
            ...prev,
            title: d.title || prev.title,
            sub_heading: d.sub_heading || prev.sub_heading,
            contents: d.contents || prev.contents,
            ...meta,
          }));
        }
      } catch {}

      // Contact info
      try {
        const contactRes = await axios.get(`${API.BASE_URL}content/contact_info`);
        if (contactRes.data?.data) {
          const d = contactRes.data.data;
          const meta = typeof d.metadata === "string" ? JSON.parse(d.metadata || "{}") : d.metadata || {};
          setContactForm((prev) => ({
            ...prev,
            ...meta,
          }));
        }
      } catch {}
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save Hero Section
  const handleSaveHero = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setToastMsg("");

    try {
      const payload = {
        title: heroForm.title,
        heading: heroForm.heading,
        sub_heading: heroForm.badge,
        metadata: {
          ctaPrimaryText: heroForm.ctaPrimaryText,
          ctaPrimaryLink: heroForm.ctaPrimaryLink,
          ctaSecondaryText: heroForm.ctaSecondaryText,
          ctaSecondaryLink: heroForm.ctaSecondaryLink,
          metric1: heroForm.metric1,
          metric2: heroForm.metric2,
          metric3: heroForm.metric3,
        },
      };

      await axios.post(`${API.BASE_URL}admin/content/hero`, payload, authHeaders);
      setToastMsg("Hero Section updated successfully!");
      setTimeout(() => setToastMsg(""), 3500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update Hero section");
    } finally {
      setSaving(false);
    }
  };

  // Save About Section
  const handleSaveAbout = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setToastMsg("");

    try {
      const payload = {
        title: aboutForm.title,
        sub_heading: aboutForm.sub_heading,
        contents: aboutForm.contents,
        metadata: {
          experienceYears: aboutForm.experienceYears,
          projectsCompleted: aboutForm.projectsCompleted,
          clientSatisfaction: aboutForm.clientSatisfaction,
          activeClients: aboutForm.activeClients,
        },
      };

      await axios.post(`${API.BASE_URL}admin/content/about`, payload, authHeaders);
      setToastMsg("About Us Section updated successfully!");
      setTimeout(() => setToastMsg(""), 3500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update About section");
    } finally {
      setSaving(false);
    }
  };

  // Save Contact & Footer Section
  const handleSaveContact = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setToastMsg("");

    try {
      const payload = {
        title: "Company Contact & Brand Coordinates",
        contents: contactForm.address,
        metadata: contactForm,
      };

      await axios.post(`${API.BASE_URL}admin/content/contact_info`, payload, authHeaders);
      setToastMsg("Contact details and Footer settings updated successfully!");
      setTimeout(() => setToastMsg(""), 3500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update contact info");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Top Action Bar */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#ffffff", margin: 0 }}>
            Site Content & Global Settings
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: "4px 0 0 0" }}>
            Customize homepage hero headlines, about narrative, trust metrics, company coordinates, and social channels.
          </p>
        </div>
      </div>

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
          }}
        >
          <i className="fas fa-check-circle" />
          <span>{toastMsg}</span>
        </div>
      )}

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
          <i className="fas fa-exclamation-circle" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tabs Row */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          paddingBottom: "14px",
          marginBottom: "24px",
        }}
      >
        {[
          { id: "hero", label: "Home Hero & Headlines", icon: "fas fa-bullhorn" },
          { id: "about", label: "About Us & Milestones", icon: "fas fa-info-circle" },
          { id: "contact", label: "Contact Info & Channels", icon: "fas fa-address-card" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px 18px",
              borderRadius: "10px",
              fontSize: "0.88rem",
              fontWeight: "600",
              cursor: "pointer",
              border: "none",
              background: activeTab === tab.id ? "var(--pt-primary)" : "rgba(15, 23, 42, 0.7)",
              color: activeTab === tab.id ? "#ffffff" : "#94a3b8",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s ease",
            }}
          >
            <i className={tab.icon} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5" style={{ color: "#94a3b8" }}>
          <i className="fas fa-spinner fa-spin fa-2x mb-3 d-block" style={{ color: "var(--pt-primary)" }} />
          Loading content settings...
        </div>
      ) : (
        <>
          {/* ── TAB 1: HERO SECTION ── */}
          {activeTab === "hero" && (
            <div
              style={{
                background: "rgba(30, 41, 59, 0.45)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "18px",
                padding: "28px",
              }}
            >
              <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#ffffff", marginBottom: "8px" }}>
                Homepage Hero Section
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "24px" }}>
                These texts appear prominently at the very top of your homepage above the interactive physics canvas.
              </p>

              <form onSubmit={handleSaveHero}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Top Pulsing Live Badge Text
                    </label>
                    <input
                      type="text"
                      value={heroForm.badge}
                      onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
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
                      Main Hero Headline
                    </label>
                    <input
                      type="text"
                      value={heroForm.title}
                      onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
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

                  <div className="col-12">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Hero Narrative Summary (Paragraph)
                    </label>
                    <textarea
                      rows={3}
                      value={heroForm.heading}
                      onChange={(e) => setHeroForm({ ...heroForm, heading: e.target.value })}
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

                  {/* CTAs */}
                  <div className="col-12 col-md-6">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Primary CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={heroForm.ctaPrimaryText}
                      onChange={(e) => setHeroForm({ ...heroForm, ctaPrimaryText: e.target.value })}
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
                      Primary CTA Destination URL
                    </label>
                    <input
                      type="text"
                      value={heroForm.ctaPrimaryLink}
                      onChange={(e) => setHeroForm({ ...heroForm, ctaPrimaryLink: e.target.value })}
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
                      Secondary CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={heroForm.ctaSecondaryText}
                      onChange={(e) => setHeroForm({ ...heroForm, ctaSecondaryText: e.target.value })}
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
                      Secondary CTA Destination URL
                    </label>
                    <input
                      type="text"
                      value={heroForm.ctaSecondaryLink}
                      onChange={(e) => setHeroForm({ ...heroForm, ctaSecondaryLink: e.target.value })}
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

                  {/* Trust Badges */}
                  <div className="col-12 col-md-4">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Trust Badge 1
                    </label>
                    <input
                      type="text"
                      value={heroForm.metric1}
                      onChange={(e) => setHeroForm({ ...heroForm, metric1: e.target.value })}
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
                      Trust Badge 2
                    </label>
                    <input
                      type="text"
                      value={heroForm.metric2}
                      onChange={(e) => setHeroForm({ ...heroForm, metric2: e.target.value })}
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
                      Trust Badge 3
                    </label>
                    <input
                      type="text"
                      value={heroForm.metric3}
                      onChange={(e) => setHeroForm({ ...heroForm, metric3: e.target.value })}
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
                </div>

                <div style={{ marginTop: "24px", textAlign: "right" }}>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      background: "linear-gradient(135deg, var(--pt-primary) 0%, #b8141b 100%)",
                      color: "#ffffff",
                      border: "none",
                      padding: "10px 24px",
                      borderRadius: "10px",
                      fontWeight: "700",
                      fontSize: "0.88rem",
                      cursor: saving ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {saving && <i className="fas fa-spinner fa-spin" />}
                    <span>Save Hero Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── TAB 2: ABOUT US ── */}
          {activeTab === "about" && (
            <div
              style={{
                background: "rgba(30, 41, 59, 0.45)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "18px",
                padding: "28px",
              }}
            >
              <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#ffffff", marginBottom: "8px" }}>
                About Us & Key Metrics
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "24px" }}>
                Configure the primary About section statement, years in business, and client satisfaction metrics.
              </p>

              <form onSubmit={handleSaveAbout}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      About Section Title
                    </label>
                    <input
                      type="text"
                      value={aboutForm.title}
                      onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
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
                      Sub Heading / Mission Slogan
                    </label>
                    <input
                      type="text"
                      value={aboutForm.sub_heading}
                      onChange={(e) => setAboutForm({ ...aboutForm, sub_heading: e.target.value })}
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

                  <div className="col-12">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Detailed About Narrative
                    </label>
                    <textarea
                      rows={4}
                      value={aboutForm.contents}
                      onChange={(e) => setAboutForm({ ...aboutForm, contents: e.target.value })}
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

                  {/* Numerical counters */}
                  <div className="col-12 col-sm-6 col-md-3">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Years Experience
                    </label>
                    <input
                      type="text"
                      value={aboutForm.experienceYears}
                      onChange={(e) => setAboutForm({ ...aboutForm, experienceYears: e.target.value })}
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

                  <div className="col-12 col-sm-6 col-md-3">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Projects Completed
                    </label>
                    <input
                      type="text"
                      value={aboutForm.projectsCompleted}
                      onChange={(e) => setAboutForm({ ...aboutForm, projectsCompleted: e.target.value })}
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

                  <div className="col-12 col-sm-6 col-md-3">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Client Satisfaction
                    </label>
                    <input
                      type="text"
                      value={aboutForm.clientSatisfaction}
                      onChange={(e) => setAboutForm({ ...aboutForm, clientSatisfaction: e.target.value })}
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

                  <div className="col-12 col-sm-6 col-md-3">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Active Global Clients
                    </label>
                    <input
                      type="text"
                      value={aboutForm.activeClients}
                      onChange={(e) => setAboutForm({ ...aboutForm, activeClients: e.target.value })}
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
                </div>

                <div style={{ marginTop: "24px", textAlign: "right" }}>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      background: "linear-gradient(135deg, var(--pt-primary) 0%, #b8141b 100%)",
                      color: "#ffffff",
                      border: "none",
                      padding: "10px 24px",
                      borderRadius: "10px",
                      fontWeight: "700",
                      fontSize: "0.88rem",
                      cursor: saving ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {saving && <i className="fas fa-spinner fa-spin" />}
                    <span>Save About Us</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── TAB 3: CONTACT & FOOTER ── */}
          {activeTab === "contact" && (
            <div
              style={{
                background: "rgba(30, 41, 59, 0.45)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "18px",
                padding: "28px",
              }}
            >
              <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#ffffff", marginBottom: "8px" }}>
                Company Contact & Social Channels
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "24px" }}>
                These phone numbers, addresses, and social links update across the header, footer, and Contact page.
              </p>

              <form onSubmit={handleSaveContact}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Main Phone Number
                    </label>
                    <input
                      type="text"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
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
                      Official Support Email
                    </label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
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

                  <div className="col-12 col-md-8">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      Physical Office Address
                    </label>
                    <input
                      type="text"
                      value={contactForm.address}
                      onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
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
                      Working Hours
                    </label>
                    <input
                      type="text"
                      value={contactForm.workingHours}
                      onChange={(e) => setContactForm({ ...contactForm, workingHours: e.target.value })}
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

                  {/* Social links */}
                  <div className="col-12 col-md-6">
                    <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px", display: "block" }}>
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={contactForm.linkedin}
                      onChange={(e) => setContactForm({ ...contactForm, linkedin: e.target.value })}
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
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      value={contactForm.facebook}
                      onChange={(e) => setContactForm({ ...contactForm, facebook: e.target.value })}
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
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={contactForm.instagram}
                      onChange={(e) => setContactForm({ ...contactForm, instagram: e.target.value })}
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
                      Twitter / X URL
                    </label>
                    <input
                      type="url"
                      value={contactForm.twitter}
                      onChange={(e) => setContactForm({ ...contactForm, twitter: e.target.value })}
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
                </div>

                <div style={{ marginTop: "24px", textAlign: "right" }}>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      background: "linear-gradient(135deg, var(--pt-primary) 0%, #b8141b 100%)",
                      color: "#ffffff",
                      border: "none",
                      padding: "10px 24px",
                      borderRadius: "10px",
                      fontWeight: "700",
                      fontSize: "0.88rem",
                      cursor: saving ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {saving && <i className="fas fa-spinner fa-spin" />}
                    <span>Save Contact & Social Details</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default SiteContentManager;
