import { Shell } from "@/components/layout/shell";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Research } from "@/components/sections/research";
import { Certificates } from "@/components/sections/certificates";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/layout/footer";

/**
 * The whole site is one cinematic scroll. Section order is the
 * narrative: hook → proof of work → who → how → journey → depth →
 * credentials → invitation → sign-off.
 */
export default function Home() {
  return (
    <Shell>
      <main id="main">
        <Hero/>
        <Projects />
        <About />
        <Skills />
        <Experience />
        <Research />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </Shell>
  );
}
