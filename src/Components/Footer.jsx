import React from "react";
import { Link } from "react-router-dom";

function Footer() {


    return (
        <div className="container-fluid bg-dark text-white-50 footer pt-5">
            <div className="container py-5">
                <div className="row g-5">
                    <div className="col-md-5 wow fadeIn" data-wow-delay="0.1s">
                        <Link to="index.html" className="d-inline-block mb-3">
                            <h1 className="text-white">
                                Paraksh Tech
                            </h1>
                        </Link>
                        <p className="mb-0">
                           At Paraksh Tech, we are passionate about building innovative software solutions powered by Artificial Intelligence and modern technologies. Our mission is to help businesses automate processes, enhance decision-making, and accelerate digital growth with smart, scalable, and secure solutions.

We believe in combining technology, creativity, and expertise to deliver meaningful results for our clients across industries. Whether it’s AI, Machine Learning, Web Development, Cloud Solutions, or Automation, we make technology work for your success.
                        </p>
                    </div>

                    <div className="col-md-6 col-lg-3 wow fadeIn" data-wow-delay="0.3s">
                        <h5 className="text-white mb-4">Get In Touch</h5>
                        <p><i className="fa fa-map-marker-alt me-3"></i>Pustakalya Road, Buxar</p>
                        <p><i className="fa fa-phone-alt me-3"></i>+9 19296454675</p>
                        <p><i className="fa fa-envelope me-3"></i>support@parakshtech.com</p>
                        <div className="d-flex pt-2">
                            {/* <Link className="btn btn-outline-light btn-social" to=""><i className="fab fa-twitter"></i></Link> */}
                            <Link className="btn btn-outline-light btn-social" target="_blank" to="https://www.facebook.com/profile.php?id=61579256180141"><i className="fab fa-facebook-f"></i></Link>
                            {/* <Link className="btn btn-outline-light btn-social" target="_blank" to=""><i className="fab fa-youtube"></i></Link> */}
                            <Link className="btn btn-outline-light btn-social" target="_blank" to="https://www.instagram.com/parakshtech/"><i className="fab fa-instagram"></i></Link>
                            <Link className="btn btn-outline-light btn-social" target="_blank" to="https://www.linkedin.com/in/paraksh-tech-solutions-2369b6378/"><i className="fab fa-linkedin-in"></i></Link>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-2 wow fadeIn" data-wow-delay="0.5s">
                        <h5 className="text-white mb-4">Popular Link</h5>
                        <Link className="btn btn-link" to="">About Us</Link>
                        <Link className="btn btn-link" to="">Contact Us</Link>
                        <Link className="btn btn-link" to="">Privacy Policy</Link>
                        <Link className="btn btn-link" to="">Terms &amp; Condition</Link>
                        <Link className="btn btn-link" to="">Career</Link>
                    </div>

                    <div className="col-md-6 col-lg-2 wow fadeIn" data-wow-delay="0.7s">
                        <h5 className="text-white mb-4">Our Services</h5>
                        <Link className="btn btn-link" to="">Robotic Automation</Link>
                        <Link className="btn btn-link" to="">Machine learning</Link>
                        <Link className="btn btn-link" to="">Predictive Analysis</Link>
                        <Link className="btn btn-link" to="">Data Science</Link>
                        <Link className="btn btn-link" to="">Robot Technology</Link>
                    </div>
                </div>
            </div>

        </div>

    )
}

export default Footer;