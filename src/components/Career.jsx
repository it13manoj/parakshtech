import React from "react";
import { CareerHero } from "./panels/Hero";
import { TechMarquee } from "./common/TechMarquee";
import { CareerPerksGraphics } from "./panels/CareerPerksGraphics";
import { Jobs } from "./panels/Jobs";
import { WhyChooseUs } from "./panels/WhyChooseUs";
import { SocialMedia } from "./panels/SocialMedia";

export const Career = () => {
  return (
    <>
      <CareerHero />
      <TechMarquee />
      <CareerPerksGraphics />
      <Jobs />
      <WhyChooseUs />
      <SocialMedia />
    </>
  );
};

export default Career;