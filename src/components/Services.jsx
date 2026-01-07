import { AboutUs } from "./panels/AboutUs";
import { ExpertPeople } from "./panels/ExpertPeople";
import { AboutHero, Hero, ServicesHero, WeManageYourBusiness } from "./panels/Hero";
import { OurFeatures } from "./panels/OurFeatures";
import { SocialMedia } from "./panels/SocialMedia";
import { ValuedServices } from "./panels/ValuedServices";
import { WhatWeDo } from "./panels/WhatWeDo";
import { WhyChooseUs } from "./panels/WhyChooseUs";

export const Services = () => {
  return (
    <>
      <ServicesHero />
      <ValuedServices />
     
      {/* <ExpertPeople /> */}
      <WeManageYourBusiness />
       <OurFeatures />
      {/* <WhatWeDo /> */}
    </>
  );
}