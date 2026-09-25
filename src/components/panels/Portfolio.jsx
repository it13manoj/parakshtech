import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import API from "../../Config/API";
import SpotlightCard from "../common/SpotlightCard";

// Comprehensive default portfolio items demonstrating both Multi-Image & Single-Image setups with rich details
const defaultProjects = [
  {
    id: 1,
    category: "webapp",
    title: "Enterprise Resource Management (ERP Suite)",
    sub_heading: "Cloud-Native ERP & Telemetry System",
    description:
      "A complete enterprise-grade ERP platform engineered for multi-tier procurement, real-time inventory telemetry, role-based governance, and unified ledger reconciliation.",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    ],
    client: "Acuity Logistics Corp",
    year: "2024",
    status: "Live",
    industry: "Enterprise Logistics",
    platform: "Web Application / Cloud",
    tech: ["React 19", "Node.js", "PostgreSQL", "Docker", "AWS", "Redis"],
    features: [
      "Executive KPI analytics with sub-second WebSocket updates",
      "Granular role-based access control (RBAC) with immutable audit trail",
      "Automated vendor procurement pipelines with multi-tier approval workflows",
      "High-throughput RESTful & GraphQL microservices architecture",
    ],
    impact: "42% reduction in supply chain turnaround time",
    link: "https://demo.parakshtech.com/erp",
  },
  {
    id: 2,
    category: "website",
    title: "Corporate Brand & Investor Relations Portal",
    sub_heading: "Ultra-Fast Headless Web Ecosystem",
    description:
      "A pixel-perfect, SEO-optimized digital presence crafted for international capital markets, featuring live financial metrics, interactive ESG timelines, and headless dynamic content publishing.",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    ],
    client: "Vanguard Global Capital",
    year: "2024",
    status: "Live",
    industry: "Financial Services",
    platform: "Modern Web / CMS",
    tech: ["Next.js 14", "TypeScript", "Tailwind CSS", "Strapi CMS", "Vercel"],
    features: [
      "100/100 Google Lighthouse Core Web Vitals score",
      "Headless CMS integration with multi-lingual internationalization",
      "Interactive investor relations timeline and stock ticker widgets",
      "WCAG 2.1 AA accessibility compliance across all page layouts",
    ],
    impact: "3.2x faster page load and +140% organic search traffic",
    link: "https://demo.parakshtech.com/corp",
  },
  {
    id: 3,
    category: "android",
    title: "PulseHealth Telemedicine & Wearable IoT",
    sub_heading: "HIPAA-Compliant Android & BLE App",
    description:
      "A cross-platform mobile health ecosystem with low-latency WebRTC video consultations, continuous Bluetooth vitals telemetry, encrypted e-prescriptions, and offline sync.",
    images: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
    ],
    client: "BioSyn Health Systems",
    year: "2024",
    status: "Live",
    industry: "Healthcare & MedTech",
    platform: "Android (Kotlin / Compose)",
    tech: ["Kotlin", "Jetpack Compose", "WebRTC", "BLE 5.2", "Firebase", "Node.js"],
    features: [
      "Encrypted HD video consultation with real-time in-call vitals display",
      "Seamless Bluetooth Low Energy (BLE) pairing with smart pulse oximeters",
      "End-to-end encrypted e-prescriptions with pharmacy fulfillment",
      "Offline-first sync engine ensuring accessibility in remote clinics",
    ],
    impact: "Over 85,000 active remote consultations successfully conducted",
    link: "https://demo.parakshtech.com/pulsehealth",
  },
  {
    id: 4,
    category: "webapp",
    title: "FinFlow Multi-Currency Payment Gateway",
    sub_heading: "High-Frequency Transaction Platform",
    description:
      "A financial gateway infrastructure supporting instant multi-currency settlement, AI fraud scoring, automated compliance ledgering, and bank-grade cryptographic protocols.",
    images: [
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    ],
    client: "PayApex International",
    year: "2024",
    status: "Live",
    industry: "FinTech & Banking",
    platform: "Web Application / API",
    tech: ["React", "Python FastAPI", "PostgreSQL", "Kafka", "Stripe API", "AWS"],
    features: [
      "Sub-200ms transaction execution with automated FX hedging",
      "Machine learning fraud detection scoring with zero false-positives",
      "PCI-DSS Level 1 compliant tokenization and vault architecture",
      "Real-time webhook dispatcher supporting 10,000+ events per second",
    ],
    impact: "$14M+ monthly transaction volume processed safely",
    link: "https://demo.parakshtech.com/finflow",
  },
  {
    id: 5,
    category: "website",
    title: "LuxeCart Global Omnichannel Store",
    sub_heading: "Headless E-Commerce & Retail Experience",
    description:
      "A high-conversion headless e-commerce platform with AI visual recommendations, instant multi-country checkout, dynamic inventory sync across 45 physical stores, and 0.8s load times.",
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    ],
    client: "Maison & Style Retail",
    year: "2023",
    status: "Live",
    industry: "E-Commerce & Retail",
    platform: "Headless E-Commerce",
    tech: ["Shopify Plus", "React", "GraphQL", "Algolia Search", "Tailwind CSS"],
    features: [
      "AI-driven visual search and personalized recommendation carousels",
      "Instant checkout integration with Apple Pay and Google Pay",
      "Dynamic inventory synchronization across 45 physical retail outlets",
      "Optimized 0.8s time-to-interactive for peak promotional traffic",
    ],
    impact: "+68% increase in mobile checkout conversion rate",
    link: "https://demo.parakshtech.com/luxecart",
  },
  {
    id: 6,
    category: "android",
    title: "LogiTrack Smart Fleet Dispatcher",
    sub_heading: "Live GPS & Autonomous Telematics App",
    description:
      "An enterprise heavy-vehicle logistics app offering turn-by-turn routing, live millimeter GPS telemetry over satellite & cellular, geofenced proof of delivery, and fuel burn diagnostics.",
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=1200&q=80",
    ],
    client: "TransCargo Express",
    year: "2023",
    status: "Live",
    industry: "Transport & Logistics",
    platform: "Android (Flutter / Native SDKs)",
    tech: ["Flutter", "Dart", "Google Maps SDK", "WebSockets", "GoLang", "PostGIS"],
    features: [
      "Turn-by-turn truck-specific route planning avoiding low bridges",
      "Live millisecond GPS tracking over low-bandwidth cellular networks",
      "Automated geofencing with electronic proof of delivery (e-POD)",
      "Engine diagnostics telemetry monitoring fuel burn and idle times",
    ],
    impact: "Saved over 18,000 gallons of fuel in 6 months",
    link: "https://demo.parakshtech.com/logitrack",
  },
  {
    id: 7,
    category: "webapp",
    title: "CloudOps Kubernetes Control Plane",
    sub_heading: "Multi-Cloud Infrastructure Automation",
    description:
      "A centralized DevOps platform empowering software engineering teams to manage Kubernetes clusters across AWS, Azure, and GCP with automated canary rollouts and predictive autoscaling.",
    images: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    ],
    client: "ScaleWave Cloud Services",
    year: "2024",
    status: "Live",
    industry: "Cloud & DevOps",
    platform: "Web Application / Cloud Native",
    tech: ["React", "GoLang", "Kubernetes", "Prometheus", "Terraform", "gRPC"],
    features: [
      "One-click multi-cluster provisioning across AWS, GCP, and Azure",
      "Automated zero-downtime rolling canary deployments",
      "Real-time visual node mesh with CPU, memory, and ingress analytics",
      "Self-healing cluster daemon with automated incident remediation",
    ],
    impact: "99.999% SLA achieved with 65% faster incident turnaround",
    link: "https://demo.parakshtech.com/cloudops",
  },
  {
    id: 8,
    category: "webapp",
    title: "Aura AI Generative Studio",
    sub_heading: "Multi-Modal AI Creative Workbench",
    description:
      "An enterprise generative AI platform offering streaming text generation, high-fidelity media synthesis, custom vector document embeddings, and enterprise compliance guardrails.",
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    ],
    client: "Studio Synthetics",
    year: "2024",
    status: "Live",
    industry: "Artificial Intelligence",
    platform: "Web Application / AI",
    tech: ["Next.js", "Python FastAPI", "PyTorch", "OpenAI API", "Pinecone"],
    features: [
      "Real-time streaming text and multi-modal asset generation",
      "Custom vector embeddings with semantic document retrieval",
      "Enterprise brand voice guardrails and content safety checks",
      "Collaborative shared workspace with multi-user prompt branching",
    ],
    impact: "Over 500,000 synthetic assets generated monthly",
    link: "https://demo.parakshtech.com/aura",
  },
];

// Category filter configuration
const categoryConfig = {
  all: { label: "All Projects", icon: "fas fa-th" },
  webapp: { label: "Web Apps", icon: "fas fa-laptop-code" },
  website: { label: "Websites", icon: "fas fa-globe" },
  android: { label: "Android Apps", icon: "fas fa-mobile-alt" },
  multi: { label: "Multi-Image", icon: "fas fa-images" },
  single: { label: "Single View", icon: "fas fa-image" },
};

/**
 * Normalizes project image fields into a clean array of full URLs.
 * Handles: arrays, comma-separated strings, JSON strings, single image fields.
 */
const normalizeProjectImages = (project) => {
  if (!project) return [];
  const list = [];

  // 1. Array or string in gallery
  if (Array.isArray(project.gallery)) {
    list.push(...project.gallery);
  } else if (typeof project.gallery === "string" && project.gallery.trim()) {
    try {
      const parsed = JSON.parse(project.gallery);
      if (Array.isArray(parsed)) list.push(...parsed);
      else list.push(project.gallery);
    } catch {
      list.push(...project.gallery.split(",").map((s) => s.trim()));
    }
  }

  // 2. Array or string in images
  if (Array.isArray(project.images)) {
    list.push(...project.images);
  } else if (typeof project.images === "string" && project.images.trim()) {
    try {
      const parsed = JSON.parse(project.images);
      if (Array.isArray(parsed)) list.push(...parsed);
      else list.push(project.images.split(",").map((s) => s.trim()));
    } catch {
      list.push(...project.images.split(",").map((s) => s.trim()));
    }
  }

  // 3. Single image fields
  if (typeof project.image === "string" && project.image.trim()) {
    list.push(project.image.trim());
  }
  if (typeof project.img === "string" && project.img.trim()) {
    list.push(project.img.trim());
  }

  // 4. Resolve URLs, filter and deduplicate
  const cleanList = [...new Set(list)]
    .filter((img) => img && typeof img === "string" && img.length > 3)
    .map((img) => {
      if (
        img.startsWith("http://") ||
        img.startsWith("https://") ||
        img.startsWith("data:") ||
        img.startsWith("/")
      ) {
        return img;
      }
      return `${API.BASE_URL_IMAGES}${img}`;
    });

  // Fallback to high-res placeholder if none found
  if (cleanList.length === 0) {
    cleanList.push(
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
    );
  }

  return cleanList;
};

/**
 * Normalizes full project structure with robust fallbacks
 */
const normalizeProject = (p, idx) => {
  const images = normalizeProjectImages(p);
  return {
    id: p.id || idx + 1,
    title: p.title || p.heading || "Digital Solution Showcase",
    sub_heading: p.sub_heading || p.sub_content || "Enterprise Project",
    category: (p.category || "webapp").toLowerCase(),
    description:
      p.description ||
      p.contents ||
      p.sub_content ||
      "Cutting-edge enterprise software engineered by ParakshTech delivering reliability, modern user experience, and measurable business growth.",
    images,
    hasMultipleImages: images.length > 1,
    client: p.client || "Enterprise Partner",
    year: p.year || "2024",
    industry: p.industry || "Software & Technology",
    platform: p.platform || (p.category === "android" ? "Android Application" : "Web Platform"),
    status: p.status || "Live",
    tech: Array.isArray(p.tech) ? p.tech : ["React", "Node.js", "Cloud"],
    features: Array.isArray(p.features)
      ? p.features
      : [
          "Optimized architecture with high-availability uptime",
          "Intuitive responsive design for desktop & mobile",
          "Automated security auditing & strict data governance",
        ],
    impact: p.impact || "Elevated performance & workflow automation",
    link: p.link || null,
  };
};

export const Portfolio = () => {
  const [portfolioHeader, setPortfolioHeader] = useState(null);
  const [apiProjects, setApiProjects] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'showcase'

  // Card-level active preview index for multi-image cards
  const [cardPreviewIndices, setCardPreviewIndices] = useState({});

  // Lightbox / Modal State
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalImageIdx, setModalImageIdx] = useState(0);

  // Fetch API data
  useEffect(() => {
    let isMounted = true;
    axios
      .get(`${API.BASE_URL}home-hero/Portfolio`)
      .then((res) => {
        if (isMounted && res?.data?.data?.length) {
          setPortfolioHeader(res.data.data[0]);
          if (res.data.data.length > 1) {
            setApiProjects(res.data.data.slice(1));
          }
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Compute normalized projects list
  const allProjects = useMemo(() => {
    const rawList =
      apiProjects && apiProjects.length > 0 ? apiProjects : defaultProjects;
    return rawList.map((p, idx) => normalizeProject(p, idx));
  }, [apiProjects]);

  // Filter projects by category and search term
  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      // Category match
      let matchesCat = true;
      if (activeCategory === "multi") {
        matchesCat = p.hasMultipleImages;
      } else if (activeCategory === "single") {
        matchesCat = !p.hasMultipleImages;
      } else if (activeCategory !== "all") {
        matchesCat = p.category === activeCategory;
      }

      if (!matchesCat) return false;

      // Search match
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const inTitle = p.title.toLowerCase().includes(q);
      const inSub = p.sub_heading.toLowerCase().includes(q);
      const inDesc = p.description.toLowerCase().includes(q);
      const inClient = p.client.toLowerCase().includes(q);
      const inTech = p.tech.some((t) => t.toLowerCase().includes(q));

      return inTitle || inSub || inDesc || inClient || inTech;
    });
  }, [allProjects, activeCategory, searchQuery]);

  // On-card image switching
  const handleCardImageNext = (e, projectId, totalImages) => {
    e.stopPropagation();
    setCardPreviewIndices((prev) => ({
      ...prev,
      [projectId]: ((prev[projectId] || 0) + 1) % totalImages,
    }));
  };

  const handleCardImagePrev = (e, projectId, totalImages) => {
    e.stopPropagation();
    setCardPreviewIndices((prev) => ({
      ...prev,
      [projectId]: ((prev[projectId] || 0) - 1 + totalImages) % totalImages,
    }));
  };

  const handleCardDotClick = (e, projectId, idx) => {
    e.stopPropagation();
    setCardPreviewIndices((prev) => ({
      ...prev,
      [projectId]: idx,
    }));
  };

  // Open modal
  const openProjectModal = useCallback((project, initialImgIdx = 0) => {
    setSelectedProject(project);
    setModalImageIdx(initialImgIdx);
    document.body.style.overflow = "hidden";
  }, []);

  // Close modal
  const closeProjectModal = useCallback(() => {
    setSelectedProject(null);
    setModalImageIdx(0);
    document.body.style.overflow = "auto";
  }, []);

  // Modal image navigation
  const nextModalImage = useCallback(() => {
    if (!selectedProject || !selectedProject.images.length) return;
    setModalImageIdx((prev) => (prev + 1) % selectedProject.images.length);
  }, [selectedProject]);

  const prevModalImage = useCallback(() => {
    if (!selectedProject || !selectedProject.images.length) return;
    setModalImageIdx(
      (prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length
    );
  }, [selectedProject]);

  // Keyboard navigation when modal is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedProject) return;
      if (e.key === "Escape") {
        closeProjectModal();
      } else if (e.key === "ArrowRight") {
        nextModalImage();
      } else if (e.key === "ArrowLeft") {
        prevModalImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject, closeProjectModal, nextModalImage, prevModalImage]);

  // Scroll to contact form from modal CTA
  const handleContactCTA = () => {
    closeProjectModal();
    const contactElem = document.getElementById("contact");
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="pt-gallery-section py-5" id="portfolio">
      {/* Decorative ambient gradients */}
      <div
        style={{
          position: "absolute",
          top: "-150px",
          right: "-150px",
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(245, 32, 41, 0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "-100px",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container py-lg-5 py-3" style={{ position: "relative", zIndex: 2 }}>
        {/* ── Section Header ── */}
        <div className="text-center mx-auto mb-4" style={{ maxWidth: "800px" }}>
          <span className="pt-badge-live">
            <span className="pt-live-dot" />
            {portfolioHeader?.title || "Portfolio & Creative Gallery"}
          </span>
          <h2
            className="fw-bold mb-3 display-6"
            style={{ color: "#0f172a", marginTop: "10px" }}
          >
            {portfolioHeader?.heading ||
              "Showcase of Impactful Digital Solutions & Engineering"}
          </h2>
          <p className="text-muted" style={{ fontSize: "1.05rem", lineHeight: "1.7" }}>
            Explore our curated gallery of web applications, mobile platforms, and high-performance
            digital systems. Click on any project to view its full photo gallery and deep technical details.
          </p>
        </div>

        {/* ── Interactive Gallery Toolbar ── */}
        <div className="pt-gallery-toolbar">
          {/* Search Box */}
          <div className="pt-gallery-search-box">
            <i className="fas fa-search" />
            <input
              type="text"
              className="pt-gallery-search-input"
              placeholder="Search projects by tech, title, or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="pt-gallery-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <i className="fas fa-times" />
              </button>
            )}
          </div>

          {/* Project Count Pill */}
          <div className="d-none d-md-flex align-items-center gap-2">
            <span
              style={{
                fontSize: "0.84rem",
                color: "#64748b",
                fontWeight: "500",
              }}
            >
              Showing{" "}
              <strong style={{ color: "var(--pt-primary)" }}>
                {filteredProjects.length}
              </strong>{" "}
              of {allProjects.length} Projects
            </span>
          </div>

          {/* View Mode Toggle (Grid vs Showcase) */}
          <div className="pt-gallery-view-mode">
            <button
              type="button"
              className={`pt-gallery-view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              <i className="fas fa-th-large" />
              <span>Grid</span>
            </button>
            <button
              type="button"
              className={`pt-gallery-view-btn ${viewMode === "showcase" ? "active" : ""}`}
              onClick={() => setViewMode("showcase")}
              title="Showcase View"
            >
              <i className="fas fa-columns" />
              <span>Showcase</span>
            </button>
          </div>
        </div>

        {/* ── Category Filter Pills ── */}
        <div className="pt-filter-tabs mb-4">
          {Object.entries(categoryConfig).map(([key, cfg]) => {
            let count = 0;
            if (key === "all") count = allProjects.length;
            else if (key === "multi")
              count = allProjects.filter((p) => p.hasMultipleImages).length;
            else if (key === "single")
              count = allProjects.filter((p) => !p.hasMultipleImages).length;
            else count = allProjects.filter((p) => p.category === key).length;

            return (
              <button
                key={key}
                className={`pt-filter-btn ${activeCategory === key ? "active" : ""}`}
                onClick={() => setActiveCategory(key)}
              >
                <i className={cfg.icon} style={{ marginRight: "6px", fontSize: "0.85rem" }} />
                <span>{cfg.label}</span>
                <span
                  style={{
                    marginLeft: "6px",
                    fontSize: "0.75rem",
                    opacity: activeCategory === key ? 1 : 0.7,
                    fontWeight: "700",
                    background:
                      activeCategory === key ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.06)",
                    padding: "1px 7px",
                    borderRadius: "99px",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Gallery Projects Grid ── */}
        {filteredProjects.length === 0 ? (
          <div
            className="text-center py-5 my-4 bg-white rounded-4 shadow-sm"
            style={{ border: "1px dashed #cbd5e1" }}
          >
            <i
              className="fas fa-search mb-3"
              style={{ fontSize: "2.5rem", color: "#94a3b8" }}
            />
            <h4 className="fw-bold text-dark">No matching projects found</h4>
            <p className="text-muted" style={{ maxWidth: "450px", margin: "0 auto" }}>
              Try adjusting your search criteria or switch to another category tab to view more work.
            </p>
            <button
              className="pt-btn-primary mt-3"
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={`pt-gallery-grid ${viewMode}`}>
            {filteredProjects.map((project) => {
              const currentImgIdx = cardPreviewIndices[project.id] || 0;
              const activeImgUrl =
                project.images[currentImgIdx] || project.images[0];

              return (
                <div key={project.id} className="pt-gallery-card-item">
                  <SpotlightCard
                    className="pt-gallery-card"
                    maxTilt={4}
                    style={{ overflow: "hidden" }}
                  >
                    {/* Media Area */}
                    <div className="pt-gallery-media-wrapper">
                      <img
                        src={activeImgUrl}
                        alt={project.title}
                        className="pt-gallery-media-img"
                        loading="lazy"
                      />

                      {/* Top Category Tag */}
                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          left: "12px",
                          background: "rgba(15, 23, 42, 0.75)",
                          backdropFilter: "blur(6px)",
                          color: "#ffffff",
                          fontSize: "0.68rem",
                          fontWeight: "700",
                          padding: "3px 10px",
                          borderRadius: "99px",
                          letterSpacing: "0.5px",
                          textTransform: "uppercase",
                          zIndex: 3,
                        }}
                      >
                        {categoryConfig[project.category]?.label || project.category}
                      </div>

                      {/* Top Status Badge */}
                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          background: "rgba(16, 185, 129, 0.9)",
                          backdropFilter: "blur(4px)",
                          color: "#ffffff",
                          fontSize: "0.7rem",
                          fontWeight: "700",
                          padding: "3px 9px",
                          borderRadius: "99px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          zIndex: 3,
                        }}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "#ffffff",
                          }}
                        />
                        {project.status}
                      </div>

                      {/* Multi-Image vs Single-Image Indicator Badge */}
                      {project.hasMultipleImages ? (
                        <div className="pt-gallery-badge-multi">
                          <i className="fas fa-images" />
                          <span>{project.images.length} Photos</span>
                        </div>
                      ) : (
                        <div className="pt-gallery-badge-single">
                          <i className="fas fa-image" />
                          <span>Single View</span>
                        </div>
                      )}

                      {/* On-Card Prev/Next Image Navigation Arrows (for multi-image projects) */}
                      {project.hasMultipleImages && (
                        <>
                          <button
                            type="button"
                            className="pt-gallery-card-arrow prev"
                            onClick={(e) =>
                              handleCardImagePrev(e, project.id, project.images.length)
                            }
                            aria-label="Previous image"
                          >
                            <i className="fas fa-chevron-left" />
                          </button>
                          <button
                            type="button"
                            className="pt-gallery-card-arrow next"
                            onClick={(e) =>
                              handleCardImageNext(e, project.id, project.images.length)
                            }
                            aria-label="Next image"
                          >
                            <i className="fas fa-chevron-right" />
                          </button>
                        </>
                      )}

                      {/* Dots Indicator at bottom left for multi-image projects */}
                      {project.hasMultipleImages && (
                        <div className="pt-gallery-card-dots">
                          {project.images.map((_, dotIdx) => (
                            <span
                              key={dotIdx}
                              className={`pt-gallery-dot ${
                                dotIdx === currentImgIdx ? "active" : ""
                              }`}
                              onClick={(e) => handleCardDotClick(e, project.id, dotIdx)}
                              title={`Image ${dotIdx + 1} of ${project.images.length}`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Hover Overlay with Quick Actions */}
                      <div className="pt-gallery-hover-overlay">
                        <button
                          type="button"
                          className="pt-gallery-overlay-btn primary"
                          onClick={() => openProjectModal(project, currentImgIdx)}
                        >
                          <i className="fas fa-expand-arrows-alt" />
                          <span>
                            {project.hasMultipleImages ? "View Gallery" : "Enlarge Image"}
                          </span>
                        </button>
                        <button
                          type="button"
                          className="pt-gallery-overlay-btn glass"
                          onClick={() => openProjectModal(project, currentImgIdx)}
                        >
                          <i className="fas fa-info-circle" />
                          <span>Details</span>
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="pt-gallery-card-body">
                      {/* Meta chips */}
                      <div className="pt-gallery-card-meta">
                        <span className="pt-gallery-category-chip">
                          {project.sub_heading}
                        </span>
                        <span className="pt-gallery-year-chip">
                          <i className="far fa-calendar-alt me-1" />
                          {project.year}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        className="pt-gallery-card-title"
                        onClick={() => openProjectModal(project, currentImgIdx)}
                      >
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p
                        className="pt-gallery-card-desc"
                        dangerouslySetInnerHTML={{ __html: project.description }}
                      />

                      {/* Tech Stack Tags */}
                      <div className="pt-gallery-tags">
                        {project.tech.slice(0, 4).map((t, tIdx) => (
                          <span key={tIdx} className="pt-gallery-tag">
                            {t}
                          </span>
                        ))}
                        {project.tech.length > 4 && (
                          <span className="pt-gallery-tag" style={{ background: "#e2e8f0" }}>
                            +{project.tech.length - 4} more
                          </span>
                        )}
                      </div>

                      {/* Footer Info & Action */}
                      <div className="pt-gallery-card-footer">
                        <div className="pt-gallery-client-info">
                          <i className="far fa-building" />
                          <span>{project.client}</span>
                        </div>
                        <button
                          type="button"
                          className="pt-gallery-explore-btn"
                          onClick={() => openProjectModal(project, currentImgIdx)}
                        >
                          <span>Explore Project</span>
                          <i className="fas fa-arrow-right" />
                        </button>
                      </div>
                    </div>
                  </SpotlightCard>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Key Highlights & Performance Stats ── */}
        <div
          className="row g-4 mt-5"
          style={{
            borderTop: "1px solid rgba(0, 0, 0, 0.08)",
            paddingTop: "40px",
          }}
        >
          {[
            {
              icon: "fas fa-laptop-code",
              value: "10+",
              label: "Web Applications",
              color: "var(--pt-primary)",
            },
            {
              icon: "fas fa-globe",
              value: "14+",
              label: "High-Speed Websites",
              color: "var(--pt-secondary)",
            },
            {
              icon: "fas fa-mobile-alt",
              value: "8+",
              label: "Android & Mobile Apps",
              color: "#10b981",
            },
            {
              icon: "fas fa-users",
              value: "95K+",
              label: "Daily Active Users",
              color: "#f59e0b",
            },
          ].map((stat, i) => (
            <div key={i} className="col-6 col-lg-3">
              <div className="text-center">
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "14px",
                    background: `${stat.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 12px",
                    fontSize: "1.25rem",
                    color: stat.color,
                  }}
                >
                  <i className={stat.icon} />
                </div>
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "800",
                    color: "#0f172a",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    marginTop: "4px",
                    fontWeight: "500",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================================
          Interactive Lightbox & Project Details Modal
          ====================================================================== */}
      {selectedProject && (
        <div
          className="pt-gallery-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeProjectModal();
          }}
        >
          <div className="pt-gallery-modal-dialog">
            {/* Top Bar */}
            <div className="pt-gallery-modal-topbar">
              <div className="pt-gallery-modal-topbar-left">
                <span
                  style={{
                    background: "var(--pt-primary)",
                    color: "#ffffff",
                    fontSize: "0.72rem",
                    fontWeight: "700",
                    padding: "3px 10px",
                    borderRadius: "99px",
                    textTransform: "uppercase",
                  }}
                >
                  {categoryConfig[selectedProject.category]?.label || selectedProject.category}
                </span>

                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "#94a3b8",
                    fontWeight: "500",
                  }}
                >
                  {selectedProject.hasMultipleImages ? (
                    <>
                      <i className="fas fa-images me-1" />
                      Image {modalImageIdx + 1} of {selectedProject.images.length}
                    </>
                  ) : (
                    <>
                      <i className="fas fa-image me-1" />
                      Single Image Showcase
                    </>
                  )}
                </span>
              </div>

              <div className="d-flex align-items-center gap-3">
                <span
                  className="d-none d-md-inline"
                  style={{ fontSize: "0.78rem", color: "#64748b" }}
                >
                  [← / → Navigate • ESC Close]
                </span>
                <button
                  type="button"
                  className="pt-gallery-modal-close-btn"
                  onClick={closeProjectModal}
                  aria-label="Close modal"
                >
                  <i className="fas fa-times" />
                </button>
              </div>
            </div>

            {/* Modal Content: Visual Theater (Left) + Details Sheet (Right) */}
            <div className="pt-gallery-modal-content">
              {/* Media Theater */}
              <div className="pt-gallery-theater">
                <div className="pt-gallery-theater-viewport">
                  <img
                    src={selectedProject.images[modalImageIdx] || selectedProject.images[0]}
                    alt={selectedProject.title}
                    className="pt-gallery-theater-img"
                  />

                  {/* Navigation Arrows (for multi-image projects) */}
                  {selectedProject.hasMultipleImages && (
                    <>
                      <button
                        type="button"
                        className="pt-theater-arrow left"
                        onClick={prevModalImage}
                        aria-label="Previous image"
                      >
                        <i className="fas fa-chevron-left" />
                      </button>
                      <button
                        type="button"
                        className="pt-theater-arrow right"
                        onClick={nextModalImage}
                        aria-label="Next image"
                      >
                        <i className="fas fa-chevron-right" />
                      </button>
                    </>
                  )}
                </div>

                {/* Bottom Thumbnail Strip (for multi-image projects) */}
                {selectedProject.hasMultipleImages && (
                  <div className="pt-gallery-thumb-strip">
                    {selectedProject.images.map((imgUrl, thumbIdx) => (
                      <div
                        key={thumbIdx}
                        className={`pt-gallery-thumb-item ${
                          thumbIdx === modalImageIdx ? "active" : ""
                        }`}
                        onClick={() => setModalImageIdx(thumbIdx)}
                      >
                        <img
                          src={imgUrl}
                          alt={`${selectedProject.title} thumb ${thumbIdx + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Details Sheet */}
              <div className="pt-gallery-details-panel">
                {/* Title & Subheading */}
                <h3
                  className="fw-bold mb-1"
                  style={{ fontSize: "1.45rem", color: "#0f172a" }}
                >
                  {selectedProject.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.92rem",
                    color: "var(--pt-primary)",
                    fontWeight: "600",
                    marginBottom: "16px",
                  }}
                >
                  {selectedProject.sub_heading}
                </p>

                {/* Impact Highlight Card */}
                {selectedProject.impact && (
                  <div className="pt-gallery-impact-box">
                    <div className="pt-gallery-impact-icon">
                      <i className="fas fa-chart-line" />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          color: "var(--pt-primary)",
                        }}
                      >
                        Key Accomplishment & Impact
                      </div>
                      <div
                        style={{
                          fontSize: "0.92rem",
                          fontWeight: "700",
                          color: "#0f172a",
                        }}
                      >
                        {selectedProject.impact}
                      </div>
                    </div>
                  </div>
                )}

                {/* Project Metadata Grid */}
                <div className="pt-gallery-detail-meta-grid">
                  <div className="pt-gallery-meta-item">
                    <span className="pt-gallery-meta-label">Client</span>
                    <span className="pt-gallery-meta-value">{selectedProject.client}</span>
                  </div>
                  <div className="pt-gallery-meta-item">
                    <span className="pt-gallery-meta-label">Completion</span>
                    <span className="pt-gallery-meta-value">{selectedProject.year}</span>
                  </div>
                  <div className="pt-gallery-meta-item">
                    <span className="pt-gallery-meta-label">Platform</span>
                    <span className="pt-gallery-meta-value">{selectedProject.platform}</span>
                  </div>
                  <div className="pt-gallery-meta-item">
                    <span className="pt-gallery-meta-label">Status</span>
                    <span
                      className="pt-gallery-meta-value"
                      style={{ color: "#10b981", fontWeight: "700" }}
                    >
                      ● {selectedProject.status}
                    </span>
                  </div>
                </div>

                {/* Narrative Overview */}
                <div className="mb-3">
                  <h5
                    className="fw-bold mb-2"
                    style={{ fontSize: "0.95rem", color: "#0f172a" }}
                  >
                    Project Overview
                  </h5>
                  <p
                    style={{
                      fontSize: "0.88rem",
                      color: "#475569",
                      lineHeight: "1.7",
                    }}
                    dangerouslySetInnerHTML={{ __html: selectedProject.description }}
                  />
                </div>

                {/* Key Features List */}
                {selectedProject.features && selectedProject.features.length > 0 && (
                  <div className="mb-3">
                    <h5
                      className="fw-bold mb-2"
                      style={{ fontSize: "0.95rem", color: "#0f172a" }}
                    >
                      Core Architecture & Capabilities
                    </h5>
                    <div>
                      {selectedProject.features.map((feat, fIdx) => (
                        <div key={fIdx} className="pt-gallery-feature-item">
                          <i className="fas fa-check-circle" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technologies Tag Cloud */}
                <div className="mb-4">
                  <h5
                    className="fw-bold mb-2"
                    style={{ fontSize: "0.95rem", color: "#0f172a" }}
                  >
                    Tech Stack & Frameworks
                  </h5>
                  <div className="d-flex flex-wrap gap-2">
                    {selectedProject.tech.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: "600",
                          color: "#1e293b",
                          background: "#f1f5f9",
                          padding: "4px 10px",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action CTA Buttons */}
                <div className="pt-gallery-modal-actions">
                  {selectedProject.link && (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pt-btn-primary"
                      style={{ fontSize: "0.88rem", padding: "10px 18px" }}
                    >
                      <span>Visit Live Demo</span>
                      <i className="fas fa-external-link-alt" style={{ fontSize: "0.75rem" }} />
                    </a>
                  )}
                  <button
                    type="button"
                    className="pt-btn-outline"
                    style={{ fontSize: "0.88rem", padding: "10px 18px" }}
                    onClick={handleContactCTA}
                  >
                    <span>Request Similar Project</span>
                    <i className="fas fa-arrow-right" style={{ fontSize: "0.75rem" }} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;
