import { AboutUs } from "./panels/AboutUs";
import { ExpertPeople } from "./panels/ExpertPeople";
import { AboutHero, Hero } from "./panels/Hero";
import { OurFeatures } from "./panels/OurFeatures";
import { SocialMedia } from "./panels/SocialMedia";
import { WhyChooseUs } from "./panels/WhyChooseUs";

export const About = () => {
  return (
    <>
      <AboutHero />
      <AboutUs />
      <OurFeatures />
      <WhyChooseUs />
     <ExpertPeople />
     
    </>
  );
}