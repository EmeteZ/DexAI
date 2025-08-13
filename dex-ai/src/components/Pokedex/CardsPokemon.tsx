"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";

interface Pokemon {
  id: number;
  name: string;
  sprites: { front_default: string | null };
  types: { type: { name: string } }[];
}

const typeColors: Record<string, string> = {
  fire: "text-orange-500", water: "text-blue-500", grass: "text-green-500",
  electric: "text-yellow-500", bug: "text-lime-600", normal: "text-gray-500",
  poison: "text-purple-500", ground: "text-yellow-700", fairy: "text-pink-400",
  fighting: "text-red-600", psychic: "text-pink-600", rock: "text-yellow-800",
  ghost: "text-indigo-500", ice: "text-cyan-400", dragon: "text-indigo-700",
  dark: "text-gray-800", steel: "text-gray-400", flying: "text-sky-500",
};

const typeList = [
  "all", "fire", "water", "grass", "electric", "bug", "normal", "poison",
  "ground", "fairy", "fighting", "psychic", "rock", "ghost", "ice", "dragon",
  "dark", "steel", "flying"
];

const PokeballIcon = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
    <circle cx="30" cy="30" r="28" stroke="#222" strokeWidth="4" fill="#fff" />
    <path d="M2 30h56" stroke="#222" strokeWidth="4" />
    <circle cx="30" cy="30" r="10" stroke="#222" strokeWidth="4" fill="#fff" />
    <circle cx="30" cy="30" r="5" fill="#222" />
  </svg>
);

export default function CardsPokemon() {
  const [allUrls, setAllUrls] = useState<{ name: string; url: string }[]>([]);
  const [pokemonCache, setPokemonCache] = useState<Map<string, Pokemon>>(new Map());
  const [visibleCount, setVisibleCount] = useState(50);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [loadingList, setLoadingList] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const lastVisibleCountRef = useRef<number>(visibleCount);

  // Buscar lista ao trocar tipo
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function fetchUrlsByType() {
      setLoadingList(true);
      try {
        let results: { name: string; url: string }[] = [];

        if (selectedType === "all") {
          const res = await fetch("https://pokeapi.co/api/v2/pokemon?offset=0&limit=1025", { signal });
          if (!res.ok) throw new Error(`Erro lista: ${res.status}`);
          const data = await res.json();
          results = data.results;
        } else {
          const res = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`, { signal });
          if (!res.ok) throw new Error(`Erro tipo: ${res.status}`);
          const data = await res.json();
          results = data.pokemon.map((p: { pokemon: { name: string; url: string } }) => p.pokemon);
        }

        setAllUrls(results);
        setVisibleCount(50);
        setPokemonCache(new Map());
      } catch (e) {
        if ((e as Error)?.name !== "AbortError") console.error("Erro lista:", e);
      } finally {
        setLoadingList(false);
      }
    }

    fetchUrlsByType();
    return () => controller.abort("limpeza");
  }, [selectedType]);

  // URLs a exibir
  const urlsExibir = useMemo(() => {
    if (searchTerm.trim()) {
      const termo = searchTerm.toLowerCase();
      return allUrls
        .filter(
          (p) =>
            p.name.toLowerCase().includes(termo) ||
            String(p.url.split("/").filter(Boolean).pop()) === termo
        )
        .map((p) => p.url);
    }
    return allUrls.slice(0, visibleCount).map((p) => p.url);
  }, [allUrls, visibleCount, searchTerm]);

  // Buscar detalhes incrementalmente
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    let cancelled = false;

    async function fetchDetails(urls: string[]) {
      const missing = urls.filter((url) => !pokemonCache.has(url));
      const newEntries: [string, Pokemon][] = [];
      const batchSize = 20;

      try {
        for (let i = 0; i < missing.length; i += batchSize) {
          const batch = missing.slice(i, i + batchSize);
          const settled = await Promise.allSettled(
            batch.map(async (url) => {
              const r = await fetch(url, { signal });
              if (!r.ok) throw new Error(`Erro detalhes: ${r.status}`);
              return (await r.json()) as Pokemon;
            })
          );
          settled.forEach((s, idx) => {
            if (s.status === "fulfilled") newEntries.push([batch[idx], s.value]);
          });
          if (cancelled) return;
        }

        if (newEntries.length) {
          setPokemonCache((prev) => {
            const copy = new Map(prev);
            newEntries.forEach(([k, v]) => copy.set(k, v));
            return copy;
          });
        }

        const lista = urls
          .map((url) => pokemonCache.get(url) || newEntries.find(([k]) => k === url)?.[1])
          .filter(Boolean) as Pokemon[];

        if (!cancelled) setPokemons(lista);
      } catch (e) {
        if ((e as Error)?.name !== "AbortError") console.error("Erro detalhes:", e);
      } finally {
        if (!cancelled) setLoadingMore(false);
      }
    }

    setLoadingMore(true);
    fetchDetails(urlsExibir);

    return () => {
      cancelled = true;
      controller.abort("limpeza");
    };
  }, [urlsExibir, pokemonCache]);

  // Auto-scroll
  useEffect(() => {
    if (visibleCount > lastVisibleCountRef.current && !searchTerm) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    lastVisibleCountRef.current = visibleCount;
  }, [visibleCount, searchTerm]);

  const handleImgError = (id: number) => {
    setImgError((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="flex flex-col mt-10 items-center">
      {/* Filtros */}
      <div className="flex gap-4 mb-6 w-full max-w-4xl">
        <input
          type="text"
          placeholder="Buscar Pokémon (nome ou ID)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 w-3/5 border rounded-md shadow-sm focus:ring-2"
        />
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="p-2 w-2/5 border rounded-md shadow-sm focus:ring-2 bg-white"
        >
          <option value="all">Todos os Tipos</option>
          {typeList.filter((t) => t !== "all").map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Lista */}
      {loadingList && pokemons.length === 0 ? (
        <p>Carregando...</p>
      ) : (
        <>
          <div className={`grid gap-10 justify-items-center transition-all duration-300
              ${pokemons.length >= 10
                ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                : pokemons.length >= 5
                ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
                : pokemons.length >= 4
                ? "grid-cols-2 sm:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2"}
            `}>
            {pokemons.map((pokemon) => (
              <div key={pokemon.id} className="flex flex-col px-5 py-4 bg-neutral rounded-2xl items-center shadow">
                <div className="w-35 h-35 flex items-center justify-center mb-4 bg-neutral/50 rounded-full overflow-hidden">
                  {!pokemon.sprites.front_default || imgError[pokemon.id] ? (
                    <PokeballIcon />
                  ) : (
                    <Image
                      src={pokemon.sprites.front_default}
                      alt={pokemon.name}
                      width={132}
                      height={132}
                      onError={() => handleImgError(pokemon.id)}
                      draggable={false}
                      unoptimized
                    />
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-1">#{String(pokemon.id).padStart(3, "0")}</p>
                <p className="text-base font-semibold">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
                <p className="text-sm text-gray-600">
                  Tipo: <span className={`${typeColors[pokemon.types[0]?.type?.name] || "text-black"}`}>
                    {pokemon.types[0]?.type?.name
                      ? pokemon.types[0].type.name.charAt(0).toUpperCase() + pokemon.types[0].type.name.slice(1)
                      : "Desconhecido"}
                  </span>
                </p>
              </div>
            ))}
          </div>
          {!searchTerm && visibleCount < allUrls.length && (
            <button onClick={() => setVisibleCount((v) => Math.min(v + 50, allUrls.length))}
              className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              {loadingMore ? "Carregando..." : "Carregar mais"}
            </button>
          )}
          <div ref={bottomRef} />
        </>
      )}
    </div>
  );
}
