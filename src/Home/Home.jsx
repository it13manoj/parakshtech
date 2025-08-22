import React from "react";
import {Hero, Navbar} from "../Components/Header"
import { Abouts, Case, FAQs, Feature, Newsletter, Search, Services, Team, Testimonial } from "../Components/Index";
import Footer from "../Components/Footer";
function  Home(){



    return (
        <>
            {/* <Navbar></Navbar> */}
            {/* <Hero></Hero> */}
            {/* <Search></Search> */}
            <Abouts />
            <Services />
            <Feature />
            <Case />
            <FAQs />
            <Team />
            {/* <Testimonial /> */}
            {/* <Newsletter />
            <Footer /> */}
        </>
    )
}




export default Home;