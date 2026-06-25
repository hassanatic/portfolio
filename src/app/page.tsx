import { Hero } from "@/components/hero/Hero";
import { Trace } from "@/components/sections/Trace";
import { SystemMap } from "@/components/sections/SystemMap";
import { Deployments } from "@/components/sections/Deployments";
import { TerminalSection } from "@/components/terminal/TerminalSection";
import { Escalate } from "@/components/sections/Escalate";
import { SiteFooter } from "@/components/chrome/SiteFooter";

export default function Home() {
  return (
    <>
      <Hero />
      <Trace />
      <SystemMap />
      <Deployments />
      <TerminalSection />
      <Escalate />
      <SiteFooter />
    </>
  );
}
