import type { Metadata } from "next"; // Tipo para metadata da página
import { Geist, Geist_Mono } from "next/font/google"; // Importa fontes do Google

import "../styles/globals.css"; // Estilos globais
import Navbar from "../components/navBar/NavBar"; // Componente Navbar
import Footer from "../components/Footer/Footer"; // Componente Footer

// Configura Geist Sans como variável CSS
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Configura Geist Mono como variável CSS
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata da aplicação (Next.js)
export const metadata: Metadata = {
  title: "Dex Ai",
  description: "Aprenda tudo sobre Pokémon!",
  icons: {
    icon: '/assets/Logos/IconeLogo.png', 
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        {/* Navbar no topo */}
        <Navbar />

        {/* Área principal da página */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer no final */}
        <Footer />

      </body>
    </html>
  );
}
