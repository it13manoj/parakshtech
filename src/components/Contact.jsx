import { AboutUs } from "./panels/AboutUs";
import { ContactForm } from "./panels/ContactForm";
import { ExpertPeople } from "./panels/ExpertPeople";
import {ContactHero } from "./panels/Hero";
import {Jobs} from "./panels/Jobs";
import { OurFeatures } from "./panels/OurFeatures";
import { SocialMedia } from "./panels/SocialMedia";
import { WhatWeDo } from "./panels/WhatWeDo";
import { WhyChooseUs } from "./panels/WhyChooseUs";

export const ContactUs = () => {
  return (
    <>
      <ContactHero />
      <ContactForm />
    </>
  );
}