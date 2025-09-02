"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Ícones para mobile

// Lista dos itens do menu
const menuItems = [
  { label: "Pokedex", href: "/pokedex" },
  { label: "Batalha IA", href: "/battleIA" },
  { label: "Top Pokémon", href: "/topPokemons" },
  { label: "Quem é Esse?", href: "/quizPokemon" },
];

export default function FunctionsBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // Estado do menu mobile

  return (
    <>
      <style>
        {`
          .nav-label {
            position: relative;
            display: inline-block;
            padding-bottom: 4px;
            height: 20px;
            line-height: 20px;
          }
          .nav-underline {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: -8px;
            width: 90%;
            height: 3px;
            background: rgba(0, 0, 0, 0.54);
            border-radius: 9999px;
            transition: background 0.2s, box-shadow 0.2s;
            box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08);
            z-index: 10;
          }
        `}
      </style>

      {/* Navbar principal */}
      <div className="h-14 bg-neutral flex items-center justify-between md:justify-start px-4">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/assets/logos/LogoDexAI.svg"
            alt="Logo"
            className="w-30 h-30 md:mr-15 cursor-pointer hover:scale-105 transition-transform"
            width={120}
            height={120}
          />
        </Link>

        {/* Botão Mobile */}
        <button
          className="md:hidden text-textb"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Menu Desktop */}
        <div className="hidden md:flex gap-6">
          {menuItems.map((item) => {
            const isActive = item.href && pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center hover:opacity-80 transition-opacity"
                style={{ minWidth: 60, height: "56px" }}
              >
                <span className="nav-label text-sm font-medium text-textb cursor-pointer">
                  {item.label}
                  {isActive && <span className="nav-underline" />}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Menu Mobile (dropdown) */}
      {isOpen && (
        <div className="md:hidden flex flex-col bg-neutral px-4 pb-3">
          {menuItems.map((item) => {
            const isActive = item.href && pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)} // Fecha ao clicar
                className="py-2 border-b border-gray-300"
              >
                <span className="nav-label text-sm font-medium text-textb cursor-pointer">
                  {item.label}
                  {isActive && <span className="nav-underline" />}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
