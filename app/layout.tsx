import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enhance — Make AI understand you",
  description: "Turn rough ideas into precise, model-ready prompts.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
