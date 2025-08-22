import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../img/hero-img.png"
import logo from "../img/1.png"
// Named export for Navbar component
export const Navbar = () => {
    return (
        <div className="container-fluid sticky-top">
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-dark p-0">
                    <Link to="index.html" className="navbar-brand"  >
                  
                        <h1 className="text-white">Paraksh Tech</h1>

                    </Link>
                    <button type="button" className="navbar-toggler ms-auto me-0" data-bs-toggle="collapse"
                        data-bs-target="#navbarCollapse">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <div className="navbar-nav ms-auto">
                            <Link to="/" className="nav-item nav-Link active">Home</Link>
                            <Link to="/about" className="nav-item nav-Link">About</Link>
                            <Link to="/service" className="nav-item nav-Link">Services</Link>
                            <Link to="/career" className="nav-item nav-Link">Career</Link>
                             <Link to="/feature" className="nav-item nav-Link">Features</Link>
                              <Link to="/teams" className="nav-item nav-Link">Our Team</Link>
                            {/* <div className="nav-item dropdown">
                                <Link to="#" className="nav-Link dropdown-toggle" data-bs-toggle="dropdown">Pages</Link>
                                <div className="dropdown-menu bg-light mt-2">
                                   
                                    <Link to="team" className="dropdown-item">Our Team</Link>
                                    <Link to="faq" className="dropdown-item">FAQs</Link>
                                    <Link to="testimonial" className="dropdown-item">Testimonial</Link>
                          
                                </div>
                            </div> */}
                            <Link to="/contact" className="nav-item nav-Link">Contact</Link>
                        </div>
                        {/* <button type="button" className="btn text-white p-0 d-none d-lg-block" data-bs-toggle="modal"
                            data-bs-target="#searchModal"><i className="fa fa-search"></i></button> */}
                    </div>
                </nav>
            </div>
        </div>
    );
};

// Named export for Hero component
export const Hero = ({getHero}) => {
    return (
        <div className="container-fluid pt-5 bg-primary hero-header mb-5">
            <div className="container pt-5">
                <div className="row g-5 pt-5">
                    <div className="col-lg-6 align-self-center text-center text-lg-start mb-lg-5">
                       
                         <div className="btn btn-sm border rounded-pill text-white px-3 mb-3 animated slideInRight">Paraksh Tech</div>
                        <h1 className="display-4 text-white mb-4 animated slideInRight">Artificial Intelligence for Your Business</h1>
                        <p className="text-white mb-4 animated slideInRight">ParakshTech is a forward-thinking software company dedicated to helping businesses harness the power of technology and Artificial Intelligence. We focus on creating smart, reliable, and scalable solutions that simplify operations, enhance customer experiences, and drive business growth.</p>
                       
                       
                        {/* <Link to="/" className="btn btn-light py-sm-3 px-sm-5 rounded-pill me-3 animated slideInRight">Read More</Link>
                        <Link to="/contact" className="btn btn-outline-light py-sm-3 px-sm-5 rounded-pill animated slideInRight">Contact Us</Link> */}
                    </div>
                    <div className="col-lg-6 align-self-end text-center text-lg-end">
                        <img className="img-fluid" src={heroImg} alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
};
