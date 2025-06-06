"use client";

import { useEffect, useState } from "react";

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
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

export default function CardsPokemon() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPokemons = async (offset: number, limit: number) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const data = await response.json();

    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon: { url: string }) => {
        const res = await fetch(pokemon.url);
        return await res.json();
      })
    );

    setPokemons((prev) => [...prev, ...pokemonDetails]);
  };

  const fetchByNameOrId = async (term: string) => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${term.toLowerCase()}`);
      const data = await res.json();
      setPokemons([data]);
    } catch (error) {
      setPokemons([]);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchPokemons(offset, 10);
    }
  }, [offset]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        fetchByNameOrId(searchTerm);
      } else {
        setPokemons([]);
        fetchPokemons(0, offset + 10);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const loadMore = () => {
    setOffset((prev) => prev + 10);
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }, 300);
  };

  return (
    <div className="flex flex-col mt-10 items-center">
      <input
        type="text"
        placeholder="Buscar Pokémon (nome ou ID)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 p-2 w-75 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10">
        {pokemons.map((pokemon) => (
          <div
            key={pokemon.id}
            className="flex flex-col px-5 py-4 bg-neutral h-63 w-47 rounded-2xl items-center shadow-lg transition-transform duration-300 hover:scale-105"
          >
            <div className="w-35 h-35 bg-neutralb/50 rounded-full flex items-center justify-center mb-4 overflow-hidden">
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-33 h-33 object-contain"
              />
            </div>
            <p className="text-xs text-gray-500 mb-1">#{String(pokemon.id).padStart(3, "0")}</p>
            <p className="text-base font-semibold text-black mb-1">
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </p>
            <p className="text-sm text-gray-600">
              Tipo: {" "}
              <span className={`${typeColors[pokemon.types[0].type.name] || "text-black"} font-medium`}>
                {pokemon.types[0].type.name.charAt(0).toUpperCase() + pokemon.types[0].type.name.slice(1)}
              </span>
            </p>
          </div>
        ))}
      </div>

      {searchTerm === "" && (
        <button
          onClick={loadMore}
          className="mt-6 px-4 py-2 bg-blue2 text-white rounded hover:brightness-110 transition"
        >
          Mostrar mais
        </button>
      )}
    </div>
  );
}
