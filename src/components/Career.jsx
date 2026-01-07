import { AboutUs } from "./panels/AboutUs";
import { ExpertPeople } from "./panels/ExpertPeople";
import { AboutHero, CareerHero, Hero, ServicesHero, WeManageYourBusiness } from "./panels/Hero";
import {Jobs} from "./panels/Jobs";
import { OurFeatures } from "./panels/OurFeatures";
import { SocialMedia } from "./panels/SocialMedia";
import { WhatWeDo } from "./panels/WhatWeDo";
import { WhyChooseUs } from "./panels/WhyChooseUs";

export const Career = () => {
  return (
    <>
      <CareerHero />
      <Jobs />
    </>
  );
}