import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Outlet } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./components/Home";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Career } from "./components/Career";
import { ContactUs } from "./components/Contact";
import { ServicesDetails } from "./components/ServicesDetails";
import JobsDetails from "./components/panels/JobsDetails";
import CursorGlow from "./components/common/CursorGlow";
import SmoothScroll from "./components/common/SmoothScroll";

// Admin Management Components
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLogin from "./components/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import PortfolioManager from "./components/admin/PortfolioManager";
import ServicesManager from "./components/admin/ServicesManager";
import JobsManager from "./components/admin/JobsManager";
import TeamManager from "./components/admin/TeamManager";
import ContactsManager from "./components/admin/ContactsManager";
import SiteContentManager from "./components/admin/SiteContentManager";
import AdminSettings from "./components/admin/AdminSettings";

import "./assets/css/modern-creative.css";
import "./App.css";

// Helper component that scrolls to top on route change and guarantees free scrolling
function ScrollToTopOnRoute() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Safeguard: Always ensure body scroll is unlocked on route transition
    document.body.style.overflow = "";
    document.body.classList.remove("noscroll");

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}

// Public layout with Header, Footer, and Lenis Smooth Scroll
function PublicLayout() {
  return (
    <SmoothScroll>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </SmoothScroll>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTopOnRoute />
      <CursorGlow />
      <Routes>
        {/* ── Public Website Routes ── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/careers" element={<Career />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/services/:data" element={<ServicesDetails />} />
          <Route path="/careers/job-detail/:id" element={<JobsDetails />} />
        </Route>

        {/* ── Admin Authentication ── */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ── Protected Admin Console ── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="portfolio" element={<PortfolioManager />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="jobs" element={<JobsManager />} />
          <Route path="team" element={<TeamManager />} />
          <Route path="contacts" element={<ContactsManager />} />
          <Route path="content" element={<SiteContentManager />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

