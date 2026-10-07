import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "@/components/layout/Shell";

export const metadata: Metadata = {
  title: "DriftGuard | AI-Powered Cross-Artifact Consistency Analyzer",
  description: "Detect semantic inconsistencies between related artifacts inside software repositories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
