import Hero from "@/components/pages/landing/Hero";
import Features from "@/components/pages/landing/Features";
import CallExperience from "@/components/pages/landing/CallExperience";
import Security from "@/components/pages/landing/Security";
import FinalCTA from "@/components/pages/landing/FinalCTA";

const HomePage = () => {
  return (
    <main className="overflow-hidden bg-[#f8fafc] text-slate-950">
      <Hero />
      <Features />
      <CallExperience />
      <Security />
      <FinalCTA />
    </main>
  );
};

export default HomePage;
