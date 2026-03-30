import Nav from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { SectionRenderer } from "@/components/SectionRenderer";

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <Nav />
      <Hero />
      <SectionRenderer />
    </div>
  );
}
