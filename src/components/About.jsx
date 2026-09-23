import React from "react";
import { AboutHero } from "./panels/Hero";
import { TechMarquee } from "./common/TechMarquee";
import { AboutUs } from "./panels/AboutUs";
import { StatsCounter } from "./common/StatsCounter";
import { AboutInteractiveGraphics } from "./panels/AboutInteractiveGraphics";
import { InnovationPillars } from "./panels/InnovationPillars";
import { WhyChooseUs } from "./panels/WhyChooseUs";
import { MilestonesTimeline } from "./panels/MilestonesTimeline";
import { ExpertPeople } from "./panels/ExpertPeople";
import { SocialMedia } from "./panels/SocialMedia";

export const About = () => {
  return (
    <>
      <AboutHero />
      <TechMarquee />
      <AboutUs />
      <StatsCounter />
      <AboutInteractiveGraphics />
      <InnovationPillars />
      <WhyChooseUs />
      <MilestonesTimeline />
      <ExpertPeople />
      <SocialMedia />
    </>
  );
};

export default About;