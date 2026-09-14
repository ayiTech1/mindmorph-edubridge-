import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Programs from "@/components/sections/Programs";
import Curricula from "@/components/sections/Curricula";
import Subjects from "@/components/sections/Subjects";
import Delivery from "@/components/sections/Delivery";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import HowItWorks from "@/components/sections/HowItWorks";
import CallToAction from "@/components/sections/CallToAction";
import Contact from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Programs />
      <Curricula />
      <Subjects />
      <Delivery />
      <WhyChooseUs />
      <HowItWorks />
      <CallToAction />
      <Contact />
    </>
  );
}
