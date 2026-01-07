import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png"

export const Header = () => {
    const location = useLocation();

    const isActive = (path) =>
        location.pathname === path ? "nav-link active" : "nav-link";

    return (
        <header id="site-header" className="fixed-top">
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-light">
                    <Link className="navbar-brand" to="/">
                        <Link to="/"><span style={{ color: "red" }}><img src={logo} style={{width:"68px"}} />ARAKSH</span>TECH</Link>
                    </Link>
                    <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon fa icon-expand fa-bars"></span>
                        <span className="navbar-toggler-icon fa icon-close fa-times"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarScroll">
                        <ul className="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll">
                            <li className="nav-item">
                                <Link className={isActive("/")} to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={isActive("/about")} to="/about">About</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={isActive("/services")} to="/services">Services</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={isActive("/careers")} to="/careers">Careers</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={isActive("/contact")} to="/contact">Contact</Link>
                            </li>
                        </ul>
                        {/* <button className="btn btn-style" type="submit" >Schedule a Call</button> */}

                    </div>

                    {/* <div className="cont-ser-position">
                        <nav className="navigation">
                            <div className="theme-switch-wrapper">
                                <label className="theme-switch" htmlFor="checkbox">
                                    <input type="checkbox" id="checkbox" />
                                    <div className="mode-container">
                                        <i className="gg-sun"></i>
                                        <i className="gg-moon"></i>
                                    </div>
                                </label>
                            </div>
                        </nav>
                    </div> */}

                </nav>
            </div>
        </header>
    );
};
