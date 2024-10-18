import { Button } from "@/components/ui/button";
import { Hero } from "../components/frontend/Hero";
import { Logos } from "../components/frontend/Logos";
import { Features } from "../components/frontend/Features";
import { PricingTable } from "../components/shared/Pricing";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
      <Hero />
      <Logos />
      <Features />
      <PricingTable />
    </div>
  );
}
