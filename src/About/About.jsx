import React, { useState } from "react";
import { Hero, Navbar } from "../Components/Header";
import { Abouts, Case, FAQs, Feature, Newsletter, Search, Services, Team } from "../Components/Index";
import Footer from "../Components/Footer";

function About(){
const [getHero, SetHero] =useState("About Us")



    return (

        <>
           
            <Hero getHero={getHero}></Hero>
            <Search></Search>
            <Abouts />
            <Services />
            <Feature />
            <Case />
            <FAQs />
            <Team />
            {/* <Testimonial /> */}
            <Newsletter />
            <Footer />

        
        </>
    )
}



export default About;