import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "../styles/globals.css";
import Navbar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dex Ai",
  description: "Aprenda tudo sobre Pokémon!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Navbar />

        <main className="flex-grow">
          {children}
        </main>

        <Footer />

       
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </body>
    </html>
  );
}
