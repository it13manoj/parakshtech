import React from "react";
import { Hero } from "./panels/Hero";
import { TechMarquee } from "./common/TechMarquee";
import { StatsCounter } from "./common/StatsCounter";
import { ValuedServices } from "./panels/ValuedServices";
import { WhyChooseUs } from "./panels/WhyChooseUs";
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
      <OurFeatures />
      <SocialMedia />
    </>
  );
};

export default Home;