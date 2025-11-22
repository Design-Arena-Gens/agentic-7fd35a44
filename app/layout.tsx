import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Film Scene Planner",
  description: "Organize film scenarios into structured acts, characters, and scenes."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
