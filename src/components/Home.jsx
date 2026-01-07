import { Hero } from "./panels/Hero";
import { OurFeatures } from "./panels/OurFeatures";
import { SocialMedia } from "./panels/SocialMedia";
import { ValuedServices } from "./panels/ValuedServices";
import { WhyChooseUs } from "./panels/WhyChooseUs";

export const Home = () => {
  return (
    <>
      <Hero />
      <ValuedServices />
      <WhyChooseUs />
      <OurFeatures />
      <div className="container"> <hr/>
        <SocialMedia />
      </div>
     
    </>
  );
}