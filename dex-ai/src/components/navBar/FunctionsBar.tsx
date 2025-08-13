"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const menuItems = [
  { label: "Pokedex", href: "/pokedex" },
  { label: "Batalha IA", href: "/battleIA" },
  { label: "Top Pokémon", href: "/topPokemons" },
  { label: "Quem é Esse?", href:"/quizPokemon" },
];

export default function FunctionsBar() {
  const pathname = usePathname();

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
      <div className="h-14 bg-neutral flex items-center px-4 gap-8">
        <Link href="/">
          <Image
            src="/assets/logos/LogoDexAI.svg"
            alt="Logo"
            className="w-32 h-32 cursor-pointer hover:scale-108 transition-transform"
            width={132}
            height={132}
          />
        </Link>
        {menuItems.map((item) => {
          const isActive = item.href && pathname === item.href;
          return item.href ? (
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
          ) : (
            <span
              key={item.label}
              className="flex items-center hover:opacity-80 transition-opacity"
              style={{ minWidth: 80, height: "56px" }}
            >
              <span className="nav-label text-sm font-medium text-textb cursor-pointer">
                {item.label}
              </span>
            </span>
          );
        })}
      </div>
    </>
  );
}
