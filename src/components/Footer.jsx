import axios from "axios";
import { useEffect, useState } from "react";
import API from "../Config/API";
import { Link } from "react-router-dom";


export const Footer = () => {
    const [templates, setTemplates] = useState();

    const getAboutTemplates = () => {
        try {
            axios.get(`${API.BASE_URL}home-hero/AboutUs`).then(res => {
                setTemplates(res?.data?.data?.[0]);

            })
        } catch {

        }
    }

    useEffect(() => {
        getAboutTemplates()
    }, [0])


    function topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
    return (
        <>
            <footer className="w3l-footer py-5">
                <div className="container pt-4">
                    <div className="row">
                        <div className="col-lg-4 sub-one-left">
                            <h6>About </h6>
                            <p dangerouslySetInnerHTML={{ __html: templates?.contents }} ></p>
                            <ul className="social mt-4 pt-lg-1">
                                <li><Link to="https://www.facebook.com/profile.php?id=61579256180141" target="_blank"><span className="fab fa-facebook-f"></span></Link></li>
                                {/* <li><Link to="#twitter"><span className="fab fa-twitter"></span></Link></li> */}
                                <li><Link to="https://www.linkedin.com/company/parakshtech" target="_blank"><span className="fab fa-linkedin-in"></span></Link></li>
                                {/* <li><Link to="#google-plus"><span className="fab fa-google-plus-g"></span></Link></li> */}
                                <li><Link to="https://www.instagram.com/parakshtech/" target="_blank"><span className="fab fa-instagram"></span></Link></li>
                            </ul>
                        </div>
                        <div className="col-lg-3 col-md-6 mt-lg-0 mt-5 sub-two-right">
                            <h6>Services</h6>
                            <div className="">
                                <ul>
                                    <li><Link to="#">Web Development</Link></li>
                                    <li ><Link to="#">Software Development</Link></li>
                                    <li><Link to="#">App Development</Link></li>
                                    <li><Link to="#">Web Designing</Link></li>
                                    <li><Link to="#">Digital Marketing</Link></li>
                                    {/* <li><Link to="#post">SEO</Link></li> */}
                                </ul>
                            </div>

                        </div>
                        <div className="col-lg-2 col-md-6 mt-lg-0 mt-5 sub-two-right">
                            <h6>Quick Link</h6>
                            <div className="">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/about">About Us</Link></li>
                                    <li><Link to="/services">Services</Link></li>
                                    <li><Link to="/careers">Careers</Link></li>
                                    <li><Link to="/contact">Contact Us</Link></li>
                                </ul>
                            </div>

                        </div>
                        <div className="col-lg-3 col-md-6 mt-lg-0 mt-5 sub-one-left">
                            <h6>Contact </h6>
                            <div className="column2">
                                <div className="href1"><span className="fas fa-envelope-open"></span><Link
                                    to="mailto:support@parakshtech.com">support@parakshtech.com</Link>
                                </div>
                                <div className="href2 my-3"><span className="fas fa-phone-alt"></span><Link
                                    to="tel:+91 9296454675">+91 9296454675</Link>
                                </div>
                                <div>
                                    <p className="contact-para mb-3"><span className="fas fa-map-marker-alt"></span>Pustakalaya Road Buxar</p>
                                </div>
                                <div>
                                    <p className="contact-para"><span className="fas fa-clock"></span>Office Hours: 9:30AM - 6:30PM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="copyright-footer text-center mt-5 pt-sm-4 pt-2">
                        <p>All rights reserved | Design by <Link to="https://parakshtech.com/">ParakshTech</Link>
                        </p>
                    </div>
                </div>
            </footer>

            <button onClick={topFunction} id="movetop" title="Go to top">
                <span className="fas fa-level-up-alt" aria-hidden="true"></span>
            </button>
        </>
    );
};
