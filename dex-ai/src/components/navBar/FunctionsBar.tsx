"use client"; // Indica que este componente será renderizado no cliente
import Link from "next/link"; // Importa Link do Next.js para navegação interna
import { usePathname } from "next/navigation"; // Hook para obter a rota atual
import Image from "next/image"; // Componente de imagem do Next.js

// Lista dos itens do menu com label e rota
const menuItems = [
  { label: "Pokedex", href: "/pokedex" },
  { label: "Batalha IA", href: "/battleIA" },
  { label: "Top Pokémon", href: "/topPokemons" },
  { label: "Quem é Esse?", href:"/quizPokemon" },
];

// Componente da barra de funções / menu
export default function FunctionsBar() {
  const pathname = usePathname(); // Pega a rota atual

  return (
    <>
      {/* Estilos CSS inline para underline nos links */}
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

      {/* Container da barra de funções */}
      <div className="h-14 bg-neutral flex items-center px-4 gap-8">
        {/* Logo que redireciona para a página inicial */}
        <Link href="/">
          <Image
            src="/assets/logos/LogoDexAI.svg"
            alt="Logo"
            className="w-32 h-32 cursor-pointer hover:scale-108 transition-transform"
            width={132}
            height={132}
          />
        </Link>

        {/* Mapeia os itens do menu */}
        {menuItems.map((item) => {
          const isActive = item.href && pathname === item.href; // Checa se a rota atual é a do item
          return item.href ? (
            // Renderiza Link se houver href
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center hover:opacity-80 transition-opacity"
              style={{ minWidth: 60, height: "56px" }}
            >
              <span className="nav-label text-sm font-medium text-textb cursor-pointer">
                {item.label}
                {/* Underline ativo se a rota estiver ativa */}
                {isActive && <span className="nav-underline" />}
              </span>
            </Link>
          ) : (
            // Renderiza apenas um span se não houver href
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
