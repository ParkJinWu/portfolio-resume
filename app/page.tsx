import Nav from "@/components/Nav";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Education from "@/components/sections/Education";

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <Nav />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Education />
    </div>
  );
}
