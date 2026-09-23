import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import "./assets/css/modern-creative.css";
import "./App.css";

// Helper component that scrolls to top on route change
function ScrollToTopOnRoute() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTopOnRoute />
      <CursorGlow />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/careers" element={<Career />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/services/:data" element={<ServicesDetails />} />
          <Route path="/careers/job-detail/:id" element={<JobsDetails />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
