
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home/Home';
import About from './About/About';
import Career from './Carrer/Carrer';
import Service from './Service/Service';
import Contact from './Contact/Contact';
import { Hero, Navbar } from './Components/Header';
import { Feature, Newsletter } from './Components/Index';
import Footer from './Components/Footer';
import { Team } from './Components/Index';

function App() {

  return (
    <Router>
      <Navbar></Navbar>
      <Hero></Hero>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/service" element={<Service />} />
        <Route path="/career" element={<Career />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/feature" element={<Feature />} />
         <Route path="/teams" element={<Team />} />
      </Routes>
      <Newsletter />
      <Footer />
    </Router>
  );
}

export default App;
