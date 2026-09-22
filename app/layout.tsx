import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Movie Shift",
  description:
    "How genres, screens and audiences changed — an interactive editorial data story exploring twenty-five years of modern cinema.",
  openGraph: {
    title: "The Movie Shift",
    description:
      "How genres, screens and audiences changed — an interactive editorial data story exploring twenty-five years of modern cinema.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
