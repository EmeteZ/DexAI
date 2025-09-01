import type { Metadata } from "next"; 
import { Inter } from "next/font/google"; // Fonte do Google

import "../styles/globals.css"; 
import Navbar from "../components/navBar/NavBar"; 
import Footer from "../components/Footer/Footer";

// Configura a fonte Inter como variável CSS
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Metadata da aplicação (Next.js)
export const metadata: Metadata = {
  title: "Dex Ai",
  description: "Aprenda tudo sobre Pokémon!",
  icons: {
    icon: "/assets/Logos/IconeLogo.png",
  },
};

// Layout principal que envolve todas as páginas
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased flex flex-col min-h-screen`}
      >
        {/* Navbar no topo */}
        <Navbar />

        {/* Área principal da página */}
        <main className="flex-grow">{children}</main>

        {/* Footer no final */}
        <Footer />
      </body>
    </html>
  );
}
