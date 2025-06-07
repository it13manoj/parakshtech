import React from "react";
import { Link } from "react-router-dom";

function Footer() {


    return (
        <div className="container-fluid bg-dark text-white-50 footer pt-5">
            <div className="container py-5">
                <div className="row g-5">
                    <div className="col-md-6 col-lg-3 wow fadeIn" data-wow-delay="0.1s">
                        <Link to="index.html" className="d-inline-block mb-3">
                            <h1 className="text-white">
                                Paraksh Tech
                            </h1>
                        </Link>
                        <p className="mb-0">
                            Tempor erat elitr rebum at clita. Diam dolor diam ipsum et tempor sit. Aliqu diam
                            amet diam et eos labore. Clita erat ipsum et lorem et sit, sed stet no labore lorem
                            sit. Sanctus clita duo justo et tempor
                        </p>
                    </div>

                    <div className="col-md-6 col-lg-3 wow fadeIn" data-wow-delay="0.3s">
                        <h5 className="text-white mb-4">Get In Touch</h5>
                        <p><i className="fa fa-map-marker-alt me-3"></i>123 Street, New York, USA</p>
                        <p><i className="fa fa-phone-alt me-3"></i>+012 345 67890</p>
                        <p><i className="fa fa-envelope me-3"></i>info@example.com</p>
                        <div className="d-flex pt-2">
                            <Link className="btn btn-outline-light btn-social" to=""><i className="fab fa-twitter"></i></Link>
                            <Link className="btn btn-outline-light btn-social" to=""><i className="fab fa-facebook-f"></i></Link>
                            <Link className="btn btn-outline-light btn-social" to=""><i className="fab fa-youtube"></i></Link>
                            <Link className="btn btn-outline-light btn-social" to=""><i className="fab fa-instagram"></i></Link>
                            <Link className="btn btn-outline-light btn-social" to=""><i className="fab fa-linkedin-in"></i></Link>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-3 wow fadeIn" data-wow-delay="0.5s">
                        <h5 className="text-white mb-4">Popular Link</h5>
                        <Link className="btn btn-link" to="">About Us</Link>
                        <Link className="btn btn-link" to="">Contact Us</Link>
                        <Link className="btn btn-link" to="">Privacy Policy</Link>
                        <Link className="btn btn-link" to="">Terms &amp; Condition</Link>
                        <Link className="btn btn-link" to="">Career</Link>
                    </div>

                    <div className="col-md-6 col-lg-3 wow fadeIn" data-wow-delay="0.7s">
                        <h5 className="text-white mb-4">Our Services</h5>
                        <Link className="btn btn-link" to="">Robotic Automation</Link>
                        <Link className="btn btn-link" to="">Machine learning</Link>
                        <Link className="btn btn-link" to="">Predictive Analysis</Link>
                        <Link className="btn btn-link" to="">Data Science</Link>
                        <Link className="btn btn-link" to="">Robot Technology</Link>
                    </div>
                </div>
            </div>

            <div className="container wow fadeIn" data-wow-delay="0.1s">
                <div className="copyright">
                    <div className="row">
                        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                            &copy; <Link className="border-bottom" to="#">Your Site Name</Link>, All Right Reserved.
                            <br />
                            Designed By <Link className="border-bottom" to="https://htmlcodex.com">HTML Codex</Link>
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            <div className="footer-menu">
                                <Link to="">Home</Link>
                                <Link to="">Cookies</Link>
                                <Link to="">Help</Link>
                                <Link to="">FAQs</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Footer;