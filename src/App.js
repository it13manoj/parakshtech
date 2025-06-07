
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home/Home';
import About from './About/About';
import Career from './Carrer/Carrer';
import Service from './Service/Service';
import Contact from './Contact/Contact';
import { Navbar } from './Components/Header';

function App() {

  return (
    <Router>
       <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/service" element={<Service />} />
        <Route path="/career" element={<Career />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
