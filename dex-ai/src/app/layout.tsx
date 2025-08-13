import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "../styles/globals.css";
import Navbar from "../components/navBar/NavBar";
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
  icons: {
    icon: '/assets/Logos/IconeLogo.png', 
  },
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

      </body>
    </html>
  );
}
