import Hero from "@/components/Hero";
import About from "@/components/About";
import StylesGallery from "@/components/StylesGallery";
import WorkProcess from "@/components/WorkProcess";
import Portfolio from "@/components/Portfolio";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <StylesGallery />
      <WorkProcess />
      <Portfolio />
      <Contact />
      <Footer />
    </>
  );
}
