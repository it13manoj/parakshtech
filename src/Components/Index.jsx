import React, { useState } from "react";
import { Link } from "react-router-dom";
import aboutImg from "../img/about-img.jpg"
import feature from "../img/feature.png"
import project1 from "../img/project-1.jpg"
import project2 from "../img/project-2.jpg"
import project3 from "../img/project-3.jpg"
import team1 from "../img/team-1.jpg"
import team2 from "../img/team-2.jpg"
import team3 from "../img/team-3.jpg"
import team4 from "../img/team-4.jpg"
import testimonial1 from "../img/testimonial-1.jpg"
import testimonial2 from "../img/testimonial-2.jpg"
import testimonial3 from "../img/testimonial-3.jpg"
import newsletter from "../img/newsletter.png"
import { Hero } from "./Header";
import Footer from "./Footer";


export const Abouts = () => {
    return (
        <div className="container-fluid py-5">
            <div className="container">
                <div className="row g-5 align-items-center">

                    {/* Left Image */}
                    <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
                        <div className="about-img">
                            <img className="img-fluid" src={aboutImg} alt="About Us" />
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
                        <div className="btn btn-sm border rounded-pill text-primary px-3 mb-3">About Us</div>
                        <h1 className="mb-4">We Make Your Business Smarter with Artificial Intelligence</h1>
                        <p className="mb-4">
                            we specialize in delivering innovative software solutions that empower businesses to grow and succeed in the digital era. By combining advanced Artificial Intelligence, modern web development, and cloud technologies, we help organizations streamline operations, enhance decision-making, and improve customer engagement.


                        </p>
                        <p className="mb-4">
                            We are committed to providing scalable, secure, and cost-effective solutions tailored to meet your unique business needs.
                        </p>
                        <div className="row g-3">
                            <div className="col-sm-6">
                                <h6 className="mb-3"><i className="fa fa-check text-primary me-2"></i>Award-Winning Solutions</h6>
                                <h6 className="mb-0"><i className="fa fa-check text-primary me-2"></i>Professional & Experienced Team</h6>
                            </div>
                            <div className="col-sm-6">
                                <h6 className="mb-3"><i className="fa fa-check text-primary me-2"></i>24/7 Customer Support</h6>
                                <h6 className="mb-0"><i className="fa fa-check text-primary me-2"></i>Fair & Transparent Pricing</h6>
                            </div>
                        </div>

                        <div className="d-flex align-items-center mt-4">
                            <Link className="btn btn-primary rounded-pill px-4 me-3" to="">Read More</Link>
                            <Link className="btn btn-outline-primary btn-square me-3" to=""><i className="fab fa-facebook-f"></i></Link>
                            <Link className="btn btn-outline-primary btn-square me-3" to=""><i className="fab fa-twitter"></i></Link>
                            <Link className="btn btn-outline-primary btn-square me-3" to=""><i className="fab fa-instagram"></i></Link>
                            <Link className="btn btn-outline-primary btn-square" to=""><i className="fab fa-linkedin-in"></i></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



export const Search = () => {
    return (
        <div className="modal fade" id="searchModal" tabIndex="-1">
            <div className="modal-dialog modal-fullscreen">
                <div
                    className="modal-content"
                    style={{ background: "rgba(20, 24, 62, 0.7)" }}
                >
                    <div className="modal-header border-0">
                        <button
                            type="button"
                            className="btn btn-square bg-white btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body d-flex align-items-center justify-content-center">
                        <div className="input-group" style={{ maxWidth: "600px" }}>
                            <input
                                type="text"
                                className="form-control bg-transparent border-light p-3"
                                placeholder="Type search keyword"
                            />
                            <button className="btn btn-light px-4">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}



export const Services = () => {
    return (
        <div className="container-fluid bg-light mt-5 py-5">
            <div className="container py-5">
                <div className="row g-5 align-items-center">
                    <div className="col-lg-5 wow fadeIn" data-wow-delay="0.1s">
                        <div className="btn btn-sm border rounded-pill text-primary px-3 mb-3">
                            Our Services
                        </div>
                        <h1 className="mb-4">
                            Our Excellent AI Solutions for Your Business
                        </h1>
                        <p className="mb-4">
                            we design and deliver cutting-edge Artificial Intelligence solutions tailored to your business needs. From data-driven insights and predictive analytics to intelligent automation and customer experience enhancement, our AI-powered tools help you make smarter decisions, optimize workflows, and accelerate growth.
                        </p>
                        {/* <Link className="btn btn-primary rounded-pill px-4" to="">
                            Read More
                        </Link> */}
                    </div>
                    <div className="col-lg-7">
                        <div className="row g-4">
                            <div className="col-md-6">
                                <div className="row g-4">
                                    <div className="col-12 wow fadeIn" data-wow-delay="0.1s">
                                        <div className="service-item d-flex flex-column justify-content-center text-center rounded">
                                            <div className="service-icon btn-square">
                                                <i className="fa fa-robot fa-2x"></i>
                                            </div>
                                            <h5 className="mb-3">Robotic Automation</h5>
                                            <p>
                                                we harness the power of Robotic Process Automation (RPA) to streamline repetitive tasks, reduce errors, and improve efficiency. Our automation solutions help businesses save time, cut costs, and focus on innovation while routine operations run seamlessly in the background.
                                            </p>
                                            {/* <Link className="btn px-3 mt-auto mx-auto" to="">
                                                Read More
                                            </Link> */}
                                        </div>
                                    </div>
                                    <div className="col-12 wow fadeIn" data-wow-delay="0.5s">
                                        <div className="service-item d-flex flex-column justify-content-center text-center rounded">
                                            <div className="service-icon btn-square">
                                                <i className="fa fa-power-off fa-2x"></i>
                                            </div>
                                            <h5 className="mb-3">Machine Learning</h5>
                                            <p>
                                                we develop Machine Learning solutions that enable businesses to learn from data, predict outcomes, and make smarter decisions. Our ML models power everything from recommendation systems and fraud detection to process automation and customer behavior analysis, helping you stay ahead in a competitive digital world.
                                            </p>
                                            {/* <Link className="btn px-3 mt-auto mx-auto" to="">
                                                Read More
                                            </Link> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 pt-md-4">
                                <div className="row g-4">
                                    <div className="col-12 wow fadeIn" data-wow-delay="0.3s">
                                        <div className="service-item d-flex flex-column justify-content-center text-center rounded">
                                            <div className="service-icon btn-square">
                                                <i className="fa fa-graduation-cap fa-2x"></i>
                                            </div>
                                            <h5 className="mb-3">Education & Science</h5>
                                            <p>
                                                we leverage technology and Artificial Intelligence to transform learning and research. Our solutions empower educators, students, and researchers with smart tools that simplify complex tasks, enhance collaboration, and make knowledge more accessible. From e-learning platforms to data-driven research systems, we help shape the future of education and science through innovation.
                                            </p>
                                            {/* <Link className="btn px-3 mt-auto mx-auto" to="">
                                                Read More
                                            </Link> */}
                                        </div>
                                    </div>
                                    <div className="col-12 wow fadeIn" data-wow-delay="0.7s">
                                        <div className="service-item d-flex flex-column justify-content-center text-center rounded">
                                            <div className="service-icon btn-square">
                                                <i className="fa fa-brain fa-2x"></i>
                                            </div>
                                            <h5 className="mb-3">Predictive Analysis</h5>
                                            <p>
                                                we provide Predictive Analytics solutions that transform raw data into actionable insights. By analyzing patterns, trends, and historical data, our solutions help businesses forecast future outcomes, optimize decision-making, reduce risks, and identify new opportunities for growth.
                                            </p>
                                            {/* <Link className="btn px-3 mt-auto mx-auto" to="">
                                                Read More
                                            </Link> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



export const Feature = () => {

    return (
        <> 
      

            <div className="container-fluid  pt-5">
                <div className="container pt-5">
                    <div className="row g-5">
                        {/* Left Column */}
                        <div
                            className="col-lg-6 align-self-center mb-md-5 pb-md-5 wow fadeIn"
                            data-wow-delay="0.3s"
                        >
                            <div className="btn btn-sm border rounded-pill text-black px-3 mb-3">
                                Why Choose Us
                            </div>
                            <h1 className="text-black mb-4">
                                We're Best in AI Industry with Experience
                            </h1>
                            <p className="text-black mb-4">
                                we bring years of expertise in Artificial Intelligence and advanced software development. Our team is dedicated to delivering innovative, reliable, and scalable solutions that help businesses stay ahead in the digital age.
                            </p>

                            {/* Feature List */}
                            {["Deep expertise in Artificial Intelligence & Machine Learning", "Proven track record of successful projects across industries", "Commitment to innovation, quality, and long-term value", "Client-focused approach with transparent delivery"].map((item, index) => (
                                <div
                                    className="d-flex align-items-center text-black mb-3"
                                    key={index}
                                >
                                    <div className="btn-sm-square bg-black text-primary rounded-circle me-3">
                                        <i className="fa fa-check"></i>
                                    </div>
                                    <span>{item}</span>
                                </div>
                            ))}

                            {/* Counters */}
                            <div className="row g-4 pt-3">
                                <div className="col-sm-6">
                                    <div
                                        className="d-flex rounded p-3"
                                        style={{ background: "rgb(29 122 237)" }}
                                    >
                                        <i className="fa fa-users fa-3x text-white"></i>
                                        <div className="ms-3">
                                            <h2 className="text-white mb-0" data-toggle="counter-up">
                                                10
                                            </h2>
                                            <p className="text-white mb-0">Happy Clients</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div
                                        className="d-flex rounded p-3"
                                        style={{ background: "rgb(29 122 237)" }}
                                    >
                                        <i className="fa fa-check fa-3x text-white"></i>
                                        <div className="ms-3">
                                            <h2 className="text-white mb-0" data-toggle="counter-up">
                                                10
                                            </h2>
                                            <p className="text-white mb-0">Project Complete</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column (Image) */}
                        <div
                            className="col-lg-6 align-self-end text-center text-md-end wow fadeIn"
                            data-wow-delay="0.5s"
                        >
                            <img className="img-fluid" src={feature} alt="" />
                        </div>
                    </div>
                </div>
            </div>
             
        </>
    )
}


export const Case = () => {
    return (
        <></>
        // <div className="container-fluid bg-light py-5">
        //     <div className="container py-5">
        //         {/* Section Header */}
        //         <div
        //             className="mx-auto text-center wow fadeIn"
        //             data-wow-delay="0.1s"
        //             style={{ maxWidth: "500px" }}
        //         >
        //             <div className="btn btn-sm border rounded-pill text-primary px-3 mb-3">
        //                 Case Study
        //             </div>
        //             <h1 className="mb-4">Explore Our Recent AI Case Studies</h1>
        //         </div>

        //         {/* Case Items */}
        //         <div className="row g-4">
        //             {/* Case 1 */}
        //             <div className="col-lg-4 wow fadeIn" data-wow-delay="0.3s">
        //                 <div className="case-item position-relative overflow-hidden rounded mb-2">
        //                     <img className="img-fluid" src={project1} alt="" />
        //                     <Link className="case-overlay text-decoration-none" to="">
        //                         <small>Robotic Automation</small>
        //                         <h5 className="lh-base text-white mb-3">
        //                            Automate repetitive tasks and boost efficiency with our Robotic Process Automation (RPA) solutions. We help businesses save time, reduce errors, and focus on growth while routine operations run seamlessly.
        //                         </h5>
        //                         <span className="btn btn-square btn-primary">
        //                             <i className="fa fa-arrow-right"></i>
        //                         </span>
        //                     </Link>
        //                 </div>
        //             </div>

        //             {/* Case 2 */}
        //             <div className="col-lg-4 wow fadeIn" data-wow-delay="0.5s">
        //                 <div className="case-item position-relative overflow-hidden rounded mb-2">
        //                     <img className="img-fluid" src={project2} alt="" />
        //                     <Link className="case-overlay text-decoration-none" to="">
        //                         <small>Machine learning</small>
        //                         <h5 className="lh-base text-white mb-3">
        //                             Unlock the power of data with our Machine Learning solutions. From predictions to personalization, we help businesses make smarter decisions and stay ahead of the competition.
        //                         </h5>
        //                         <span className="btn btn-square btn-primary">
        //                             <i className="fa fa-arrow-right"></i>
        //                         </span>
        //                     </Link>
        //                 </div>
        //             </div>

        //             {/* Case 3 */}
        //             <div className="col-lg-4 wow fadeIn" data-wow-delay="0.7s">
        //                 <div className="case-item position-relative overflow-hidden rounded mb-2">
        //                     <img className="img-fluid" src={project3} alt="" />
        //                     <Link className="case-overlay text-decoration-none" to="">
        //                         <small>Predictive Analysis</small>
        //                         <h5 className="lh-base text-white mb-3">
        //                            Turn data into foresight with our Predictive Analytics solutions. We help businesses forecast trends, reduce risks, and make data-driven decisions for future growth.
        //                         </h5>
        //                         <span className="btn btn-square btn-primary">
        //                             <i className="fa fa-arrow-right"></i>
        //                         </span>
        //                     </Link>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    )
}


export const FAQs = () => {
    return (
        <></>
        // <div className="container-fluid py-5">
        //     <div className="container py-5">
        //         <div
        //             className="mx-auto text-center wow fadeIn"
        //             data-wow-delay="0.1s"
        //             style={{ maxWidth: "500px" }}
        //         >
        //             <div className="btn btn-sm border rounded-pill text-primary px-3 mb-3">
        //                 Popular FAQs
        //             </div>
        //             <h1 className="mb-4">Frequently Asked Questions</h1>
        //         </div>

        //         <div className="row">
        //             {/* Left Column */}
        //             <div className="col-lg-6">
        //                 <div className="accordion" id="accordionFAQ1">
        //                     {[
        //                         {
        //                             id: "One",
        //                             question: "How to build a website?",
        //                         },
        //                         {
        //                             id: "Two",
        //                             question: "How long will it take to get a new website?",
        //                         },
        //                         {
        //                             id: "Three",
        //                             question: "Do you only create HTML websites?",
        //                         },
        //                         {
        //                             id: "Four",
        //                             question: "Will my website be mobile-friendly?",
        //                         },
        //                     ].map((item, index) => (
        //                         <div
        //                             key={item.id}
        //                             className="accordion-item wow fadeIn"
        //                             data-wow-delay={`${0.1 + index * 0.1}s`}
        //                         >
        //                             <h2 className="accordion-header" id={`heading${item.id}`}>
        //                                 <button
        //                                     className="accordion-button collapsed"
        //                                     type="button"
        //                                     data-bs-toggle="collapse"
        //                                     data-bs-target={`#collapse${item.id}`}
        //                                     aria-expanded="false"
        //                                     aria-controls={`collapse${item.id}`}
        //                                 >
        //                                     {item.question}
        //                                 </button>
        //                             </h2>
        //                             <div
        //                                 id={`collapse${item.id}`}
        //                                 className="accordion-collapse collapse"
        //                                 aria-labelledby={`heading${item.id}`}
        //                                 data-bs-parent="#accordionFAQ1"
        //                             >
        //                                 <div className="accordion-body">
        //                                     Dolor nonumy tempor elitr et rebum ipsum sit duo duo. Diam sed
        //                                     sed magna et magna diam aliquyam amet dolore ipsum erat duo.
        //                                     Sit rebum magna duo labore no diam.
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     ))}
        //                 </div>
        //             </div>

        //             {/* Right Column */}
        //             <div className="col-lg-6">
        //                 <div className="accordion" id="accordionFAQ2">
        //                     {[
        //                         {
        //                             id: "Five",
        //                             question: "Will you maintain my site for me?",
        //                         },
        //                         {
        //                             id: "Six",
        //                             question:
        //                                 "I’m on a strict budget. Do you have any low cost options?",
        //                         },
        //                         {
        //                             id: "Seven",
        //                             question: "Will you maintain my site for me?",
        //                         },
        //                         {
        //                             id: "Eight",
        //                             question:
        //                                 "I’m on a strict budget. Do you have any low cost options?",
        //                         },
        //                     ].map((item, index) => (
        //                         <div
        //                             key={item.id}
        //                             className="accordion-item wow fadeIn"
        //                             data-wow-delay={`${0.5 + index * 0.1}s`}
        //                         >
        //                             <h2 className="accordion-header" id={`heading${item.id}`}>
        //                                 <button
        //                                     className="accordion-button collapsed"
        //                                     type="button"
        //                                     data-bs-toggle="collapse"
        //                                     data-bs-target={`#collapse${item.id}`}
        //                                     aria-expanded="false"
        //                                     aria-controls={`collapse${item.id}`}
        //                                 >
        //                                     {item.question}
        //                                 </button>
        //                             </h2>
        //                             <div
        //                                 id={`collapse${item.id}`}
        //                                 className="accordion-collapse collapse"
        //                                 aria-labelledby={`heading${item.id}`}
        //                                 data-bs-parent="#accordionFAQ2"
        //                             >
        //                                 <div className="accordion-body">
        //                                     Dolor nonumy tempor elitr et rebum ipsum sit duo duo. Diam sed
        //                                     sed magna et magna diam aliquyam amet dolore ipsum erat duo.
        //                                     Sit rebum magna duo labore no diam.
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     ))}
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    )
}



export const Team = () => {
    return (

        <div className="container-fluid bg-light py-5">
            <div className="container py-5">
                <div className="row g-5 align-items-center">
                    {/* Left Column */}
                    <div className="col-lg-5 wow fadeIn" data-wow-delay="0.1s">
                        <div className="btn btn-sm border rounded-pill text-primary px-3 mb-3">Our Team</div>
                        <h1 className="mb-4">Meet Our Experienced Team Members</h1>
                        <p className="mb-4">
                            At ParakshTech, our strength lies in our people. We are a team of skilled developers, AI experts, designers, and business professionals who bring passion and expertise to every project. With years of experience across multiple industries, our team is dedicated to delivering innovative solutions that help businesses succeed in the digital world.
                        </p>
                        <Link className="btn btn-primary rounded-pill px-4" to="">
                            Read More
                        </Link>
                    </div>

                    {/* Right Column */}
                    <div className="col-lg-7">
                        <div className="row g-4">
                            {/* First Column of Team Members */}
                            <div className="col-md-6">
                                <div className="row g-4">
                                    {[
                                        {
                                            img: team1,
                                            name: "Boris Johnson",
                                            role: "Founder & CEO",
                                            delay: "0.1s",
                                        },
                                        {
                                            img: team2,
                                            name: "Adam Crew",
                                            role: "Executive Manager",
                                            delay: "0.5s",
                                        },
                                    ].map((member, i) => (
                                        <div key={i} className="col-12 wow fadeIn" data-wow-delay={member.delay}>
                                            <div className="team-item bg-white text-center rounded p-4 pt-0">
                                                <img className="img-fluid rounded-circle p-4" src={member.img} alt={member.name} />
                                                <h5 className="mb-0">{member.name}</h5>
                                                <small>{member.role}</small>
                                                <div className="d-flex justify-content-center mt-3">
                                                    {["facebook-f", "twitter", "instagram", "linkedin-in"].map((icon, idx) => (
                                                        <Link key={idx} className="btn btn-square btn-primary m-1" to="">
                                                            <i className={`fab fa-${icon}`}></i>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Second Column of Team Members */}
                            <div className="col-md-6 pt-md-4">
                                <div className="row g-4">
                                    {[
                                        {
                                            img: team3,
                                            name: "Kate Winslet",
                                            role: "Co Founder",
                                            delay: "0.3s",
                                        },
                                        {
                                            img: team4,
                                            name: "Cody Gardner",
                                            role: "Project Manager",
                                            delay: "0.7s",
                                        },
                                    ].map((member, i) => (
                                        <div key={i} className="col-12 wow fadeIn" data-wow-delay={member.delay}>
                                            <div className="team-item bg-white text-center rounded p-4 pt-0">
                                                <img className="img-fluid rounded-circle p-4" src={member.img} alt={member.name} />
                                                <h5 className="mb-0">{member.name}</h5>
                                                <small>{member.role}</small>
                                                <div className="d-flex justify-content-center mt-3">
                                                    {["facebook-f", "twitter", "instagram", "linkedin-in"].map((icon, idx) => (
                                                        <Link key={idx} className="btn btn-square btn-primary m-1" to="">
                                                            <i className={`fab fa-${icon}`}></i>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



export const Testimonial = () => {
    return (

        <div className="container-xxl py-5">
            <div className="container py-5">
                <div className="row g-5">
                    <div className="col-lg-5 wow fadeIn" data-wow-delay="0.1s">
                        <div className="btn btn-sm border rounded-pill text-primary px-3 mb-3">Testimonial</div>
                        <h1 className="mb-4">What Say Our Clients!</h1>
                        <p className="mb-4">
                            Tempor erat elitr rebum at clita. Diam dolor diam ipsum et tempor sit. Aliqu diam amet diam et eos labore. Clita erat ipsum et lorem et sit, sed stet no labore lorem sit. Sanctus clita duo justo et tempor eirmod magna dolore erat amet
                        </p>
                        <Link className="btn btn-primary rounded-pill px-4" to="">Read More</Link>
                    </div>
                    <div className="col-lg-7 wow fadeIn" data-wow-delay="0.5s">
                        <div className="owl-carousel testimonial-carousel border-start border-primary">
                            <div className="testimonial-item ps-5">
                                <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                                <p className="fs-4">
                                    Aliqu diam amet diam et eos labore. Clita erat ipsum et lorem et sit, sed stet no labore lorem sit. Sanctus clita duo justo et tempor eirmod magna dolore erat amet
                                </p>
                                <div className="d-flex align-items-center">
                                    <img
                                        className="img-fluid flex-shrink-0 rounded-circle"
                                        src={testimonial1}
                                        alt="Client"
                                        style={{ width: '60px', height: '60px' }}
                                    />
                                    <div className="ps-3">
                                        <h5 className="mb-1">Client Name</h5>
                                        <span>Profession</span>
                                    </div>
                                </div>
                            </div>
                            <div className="testimonial-item ps-5">
                                <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                                <p className="fs-4">
                                    Aliqu diam amet diam et eos labore. Clita erat ipsum et lorem et sit, sed stet no labore lorem sit. Sanctus clita duo justo et tempor eirmod magna dolore erat amet
                                </p>
                                <div className="d-flex align-items-center">
                                    <img
                                        className="img-fluid flex-shrink-0 rounded-circle"
                                        src={testimonial2}
                                        alt="Client"
                                        style={{ width: '60px', height: '60px' }}
                                    />
                                    <div className="ps-3">
                                        <h5 className="mb-1">Client Name</h5>
                                        <span>Profession</span>
                                    </div>
                                </div>
                            </div>
                            <div className="testimonial-item ps-5">
                                <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                                <p className="fs-4">
                                    Aliqu diam amet diam et eos labore. Clita erat ipsum et lorem et sit, sed stet no labore lorem sit. Sanctus clita duo justo et tempor eirmod magna dolore erat amet
                                </p>
                                <div className="d-flex align-items-center">
                                    <img
                                        className="img-fluid flex-shrink-0 rounded-circle"
                                        src={testimonial3}
                                        alt="Client"
                                        style={{ width: '60px', height: '60px' }}
                                    />
                                    <div className="ps-3">
                                        <h5 className="mb-1">Client Name</h5>
                                        <span>Profession</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}



export const Newsletter = () => {
    return (

        <div className="container-fluid bg-primary newsletter py-5">
            <div className="container">
                <div className="row g-5 align-items-center">
                    {/* Left Image */}
                    <div className="col-md-5 ps-lg-0 pt-5 pt-md-0 text-start wow fadeIn" data-wow-delay="0.3s">
                        <img className="img-fluid" src={newsletter} alt="Newsletter" />
                    </div>

                    {/* Right Text and Form */}
                    <div className="col-md-7 py-5 newsletter-text wow fadeIn" data-wow-delay="0.5s">
                        <div className="btn btn-sm border rounded-pill text-white px-3 mb-3">Newsletter</div>
                        <h1 className="text-white mb-4">Let's subscribe the newsletter</h1>

                        <div className="position-relative w-100 mt-3 mb-2">
                            <input
                                className="form-control border-0 rounded-pill w-100 ps-4 pe-5"
                                type="text"
                                placeholder="Enter Your Email"
                                style={{ height: "48px" }}
                            />
                            <button
                                type="button"
                                className="btn shadow-none position-absolute top-0 end-0 mt-1 me-2"
                            >
                                <i className="fa fa-paper-plane text-primary fs-4"></i>
                            </button>
                        </div>
                        {/* <small className="text-white-50">Diam sed sed dolor stet amet eirmod</small> */}
                    </div>
                </div>
            </div>
        </div>
    )
}


