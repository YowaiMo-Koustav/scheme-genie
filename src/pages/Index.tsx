import Hero from "@/components/landing/Hero";
import ProblemSolution from "@/components/landing/ProblemSolution";
import Stats from "@/components/landing/Stats";
import HowItWorks from "@/components/landing/HowItWorks";
import RoleCards from "@/components/landing/RoleCards";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Hero />
    <ProblemSolution />
    <Stats />
    <HowItWorks />
    <RoleCards />
    <CTASection />
    <Footer />
  </div>
);

export default Index;
