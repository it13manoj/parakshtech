
import { Header } from './components/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { About } from './components/About';
import { Services } from './components/Services';
import { Career } from './components/Career';
import { ContactUs } from './components/Contact';
import { ServicesDetails } from './components/ServicesDetails';
import "./App.css";
import JobsDetails from './components/panels/JobsDetails';


function App() {
  return (
    <>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/careers" element={<Career />} />
          <Route path='/contact' element={<ContactUs />} />
          <Route path="/services/:data" element={<ServicesDetails />} />
          <Route path="/careers/job-detail/:id" element={<JobsDetails />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
