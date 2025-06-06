"use client";

import { useEffect, useState } from "react";

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
  };
  types: {
    type: {
      name: string;
    };
  }[];
}

const typeColors: { [key: string]: string } = {
  fire: "text-orange-500",
  water: "text-blue-500",
  grass: "text-green-500",
  electric: "text-yellow-500",
  bug: "text-lime-600",
  normal: "text-gray-500",
  poison: "text-purple-500",
  ground: "text-yellow-700",
  fairy: "text-pink-400",
  fighting: "text-red-600",
  psychic: "text-pink-600",
  rock: "text-yellow-800",
  ghost: "text-indigo-500",
  ice: "text-cyan-400",
  dragon: "text-indigo-700",
  dark: "text-gray-800",
  steel: "text-gray-400",
  flying: "text-sky-500",
};

const typeList = [
  "all",
  "fire",
  "water",
  "grass",
  "electric",
  "bug",
  "normal",
  "poison",
  "ground",
  "fairy",
  "fighting",
  "psychic",
  "rock",
  "ghost",
  "ice",
  "dragon",
  "dark",
  "steel",
  "flying",
];

const PokeballIcon = () => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    fill="none"
    className="w-33 h-33"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="30" cy="30" r="28" stroke="#222" strokeWidth="4" fill="#fff" />
    <path d="M2 30h56" stroke="#222" strokeWidth="4" />
    <circle cx="30" cy="30" r="10" stroke="#222" strokeWidth="4" fill="#fff" />
    <circle cx="30" cy="30" r="5" fill="#222" />
  </svg>
);

export default function CardsPokemon() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState<{ [id: number]: boolean }>({});

  // Busca todos os Pokémon ao iniciar ou ao trocar para "Todos os Tipos"
  const fetchAllPokemons = async () => {
    setLoading(true);
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=10000`);
    const data = await response.json();

    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon: { url: string }) => {
        const res = await fetch(pokemon.url);
        return await res.json();
      })
    );

    setPokemons(pokemonDetails);
    setLoading(false);
  };

  // Busca por tipo
  useEffect(() => {
    if (selectedType === "all") {
      fetchAllPokemons();
      return;
    }

    setLoading(true);

    async function fetchByType() {
      const response = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`);
      const data = await response.json();
      const pokemonList = data.pokemon.slice(0, 1000);

      const pokemonDetails = await Promise.all(
        pokemonList.map(async (poke: any) => {
          const res = await fetch(poke.pokemon.url);
          return await res.json();
        })
      );
      setPokemons(pokemonDetails);
      setLoading(false);
    }

    fetchByType();
    // eslint-disable-next-line
  }, [selectedType]);

  // Função para tratar erro de imagem
  const handleImgError = (id: number) => {
    setImgError((prev) => ({ ...prev, [id]: true }));
  };

  // Filtro local por nome ou id (parcial e case-insensitive)
  const filteredPokemons = pokemons.filter((pokemon) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      pokemon.name.toLowerCase().includes(term) ||
      String(pokemon.id).includes(term)
    );
  });

  return (
    <div className="flex flex-col mt-10 items-center">
      <div className="flex gap-4 mb-6 w-full max-w-4xl">
        <input
          type="text"
          placeholder="Buscar Pokémon (nome ou ID)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 w-3/5 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="p-2 w-2/5 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="all">Todos os Tipos</option>
          {typeList
            .filter((type) => type !== "all")
            .map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500 text-lg mt-10">Carregando...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {filteredPokemons.map((pokemon) => (
            <div
              key={pokemon.id + '-' + pokemon.name}
              className="flex flex-col px-5 py-4 bg-neutral h-63 w-47 rounded-2xl items-center shadow-lg transition-transform duration-300 hover:scale-105"
            >
              <div className="w-35 h-35 bg-neutralb/50 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                {(!pokemon.sprites.front_default || imgError[pokemon.id]) ? (
                  <PokeballIcon />
                ) : (
                  <img
                    src={pokemon.sprites.front_default}
                    alt=""
                    className="w-33 h-33 object-contain"
                    onError={() => handleImgError(pokemon.id)}
                    draggable={false}
                  />
                )}
              </div>
              <p className="text-xs text-gray-500 mb-1">#{String(pokemon.id).padStart(3, "0")}</p>
              <p className="text-base font-semibold text-black mb-1">
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </p>
              <p className="text-sm text-gray-600">
                Tipo:{" "}
                <span className={`${typeColors[pokemon.types[0].type.name] || "text-black"} font-medium`}>
                  {pokemon.types[0].type.name.charAt(0).toUpperCase() + pokemon.types[0].type.name.slice(1)}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
