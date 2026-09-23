import React from "react";
import { ServicesHero, WeManageYourBusiness } from "./panels/Hero";
import { TechMarquee } from "./common/TechMarquee";
import { ValuedServices } from "./panels/ValuedServices";
import { ServicesArchitectureDiagram } from "./panels/ServicesArchitectureDiagram";
import { StatsCounter } from "./common/StatsCounter";
import { OurFeatures } from "./panels/OurFeatures";
import { SocialMedia } from "./panels/SocialMedia";

export const Services = () => {
  return (
    <>
      <ServicesHero />
      <TechMarquee />
      <ValuedServices />
      <ServicesArchitectureDiagram />
      <StatsCounter />
      <WeManageYourBusiness />
      <OurFeatures />
      <SocialMedia />
    </>
  );
};

export default Services;