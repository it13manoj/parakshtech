import React from "react";
import { Hero } from "./panels/Hero";
import { TechMarquee } from "./common/TechMarquee";
import { StatsCounter } from "./common/StatsCounter";
import { ValuedServices } from "./panels/ValuedServices";
import { WhyChooseUs } from "./panels/WhyChooseUs";
import { Portfolio } from "./panels/Portfolio";
import { OurFeatures } from "./panels/OurFeatures";
import { SocialMedia } from "./panels/SocialMedia";

export const Home = () => {
  return (
    <>
      <Hero />
      <TechMarquee />
      <StatsCounter />
      <ValuedServices />
      <WhyChooseUs />
      <Portfolio />
      <OurFeatures />
      <SocialMedia />
    </>
  );
};

export default Home;