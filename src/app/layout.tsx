import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ConsoleShell } from "@/components/chrome/ConsoleShell";
import { agent } from "@/lib/data";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hassan-abdullah.vercel.app"),
  title: `${agent.name} · Control Plane`,
  description: `${agent.role}. ${agent.summary}`,
  applicationName: "Hassan Abdullah · Control Plane",
  authors: [{ name: agent.name, url: agent.links.github }],
  keywords: [
    "Hassan Abdullah",
    "Software Engineer",
    "AI Engineer",
    "Distributed Systems",
    "Observability",
    "Agentic AI",
    "Portfolio",
  ],
  openGraph: {
    title: `${agent.name} · Software & AI Engineer`,
    description:
      "A live observability console for Agent: Hassan Abdullah. Distributed systems, agentic AI, and the infrastructure around autonomous agents.",
    type: "website",
    siteName: "Hassan Abdullah · Control Plane",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${agent.name} · Software & AI Engineer`,
    description:
      "A live observability console for Agent: Hassan Abdullah. Distributed systems, agentic AI, and the infrastructure around autonomous agents.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full`}
    >
      <body className="min-h-dvh font-sans">
        <ConsoleShell>{children}</ConsoleShell>
      </body>
    </html>
  );
}
