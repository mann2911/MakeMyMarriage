import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "@/app/globals.css";

const bodyFont = localFont({
  src: "./fonts/plus-jakarta-sans.ttf",
  weight: "200 800",
  variable: "--font-body",
  display: "swap",
});

const headingFont = localFont({
  src: "./fonts/playfair-display.ttf",
  weight: "400 900",
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MakeMyMarriage",
  description: "MakeMyMarriage wedding-planning application.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${headingFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
