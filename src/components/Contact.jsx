import React from "react";
import { ContactHero } from "./panels/Hero";
import { ContactQuickChannels } from "./panels/ContactQuickChannels";
import { ContactForm } from "./panels/ContactForm";
import { SocialMedia } from "./panels/SocialMedia";

export const ContactUs = () => {
  return (
    <>
      <ContactHero />
      <ContactQuickChannels />
      <ContactForm />
      <SocialMedia />
    </>
  );
};

export default ContactUs;