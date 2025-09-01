"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { typeColors, typeBackgrounds, typeList } from "@/components/Pokedex/ColorsPokemon";

interface Pokemon {
  id: number;
  name: string;
  sprites: { front_default: string | null };
  types: { type: { name: string } }[];
}

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
        setPokemonCache(new Map()); // limpa cache
        setPokemons([]); // limpa lista
        setImgError({});
      } catch (e) {
        if ((e as Error)?.name !== "AbortError") {
          console.error("Erro ao buscar lista:", e);
        }
      } finally {
        setLoadingList(false);
      }
    }

    fetchUrlsByType();
    return () => controller.abort();
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
      if (urls.length === 0) {
        setPokemons([]);
        setLoadingMore(false);
        return;
      }

      const missing = urls.filter((url) => !pokemonCache.has(url));
      const newEntries: [string, Pokemon][] = [];
      const batchSize = 20;

      try {
        for (let i = 0; i < missing.length; i += batchSize) {
          if (cancelled) return;
          const batch = missing.slice(i, i + batchSize);

          const settled = await Promise.allSettled(
            batch.map(async (url) => {
              const r = await fetch(url, { signal });
              if (!r.ok) throw new Error(`Erro detalhes: ${r.status}`);
              return (await r.json()) as Pokemon;
            })
          );

          settled.forEach((s, idx) => {
            if (s.status === "fulfilled") {
              newEntries.push([batch[idx], s.value]);
            }
          });
        }

        if (!cancelled && newEntries.length > 0) {
          setPokemonCache((prev) => {
            const copy = new Map(prev);
            newEntries.forEach(([k, v]) => copy.set(k, v));
            return copy;
          });
        }

        if (!cancelled) {
          const lista: Pokemon[] = [];
          for (const url of urls) {
            const pokemon = pokemonCache.get(url) || newEntries.find(([k]) => k === url)?.[1];
            if (pokemon) lista.push(pokemon);
          }
          setPokemons(lista);
        }
      } catch (e) {
        if ((e as Error)?.name !== "AbortError") {
          console.error("Erro ao buscar detalhes:", e);
        }
      } finally {
        if (!cancelled) {
          setLoadingMore(false);
        }
      }
    }

    if (urlsExibir.length > 0) {
      setLoadingMore(true);
      fetchDetails(urlsExibir);
    } else {
      setPokemons([]);
      setLoadingMore(false);
    }

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [urlsExibir, pokemonCache]);

  // Auto-scroll
  useEffect(() => {
    if (visibleCount > lastVisibleCountRef.current && !searchTerm) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    lastVisibleCountRef.current = visibleCount;
  }, [visibleCount, searchTerm]);

  return (
    <div className="flex flex-col mt-10 items-center">
      {/* Filtros */}
      <div className="flex gap-4 mb-6 w-full max-w-4xl">
        <input
          type="text"
          placeholder="Buscar Pokémon (nome ou ID)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 w-3/5 input"
        />
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="p-2 w-2/5 input"
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
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500">Carregando...</p>
        </div>
      ) : (
        <>
          <div
            className={`grid gap-10 justify-items-center transition-all duration-300 w-full max-w-7xl px-4
              ${pokemons.length >= 10
                ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                : pokemons.length >= 5
                ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
                : pokemons.length >= 4
                ? "grid-cols-2 sm:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2"}`}
          >
            {pokemons.map((pokemon) => {
              const primaryType = pokemon.types[0]?.type?.name || "normal";
              const backgroundClass = typeBackgrounds[primaryType] || "bg-gray-200";

              return (
                <div
                  key={pokemon.id}
                  className="flex flex-col px-5 py-4 bg-neutral/25 border border-black/15 rounded-2xl items-center shadow-sm hover:shadow-md transition-shadow duration-200 w-full max-w-xs"
                >
                  <div
                    className={`w-36 h-36 flex items-center justify-center mb-4 rounded-full overflow-hidden shadow-inner ${backgroundClass}`}
                  >
                    {!pokemon.sprites.front_default || imgError[pokemon.id] ? (
                      <PokeballIcon />
                    ) : (
                      <Image
                        src={pokemon.sprites.front_default}
                        alt={pokemon.name}
                        width={132}
                        height={132}
                        onError={() => setImgError((prev) => ({ ...prev, [pokemon.id]: true }))}
                        draggable={false}
                        unoptimized
                        className="object-contain drop-shadow-sm"
                      />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-1">
                    #{String(pokemon.id).padStart(3, "0")}
                  </p>
                  <p className="text-base font-semibold text-gray-900 capitalize text-center">
                    {pokemon.name}
                  </p>
                  <div className="text-sm text-gray-600 mt-1">
                    <span>Tipo: </span>
                    {pokemon.types.map((type, index) => (
                      <span key={type.type.name}>
                        <span className={`font-medium ${typeColors[type.type.name] || "text-gray-700"}`}>
                          {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
                        </span>
                        {index < pokemon.types.length - 1 && ", "}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {pokemons.length === 0 && !loadingList && !loadingMore && searchTerm && (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">Nenhum Pokémon encontrado</p>
            </div>
          )}

          {!searchTerm && visibleCount < allUrls.length && (
            <button
              onClick={() => setVisibleCount((v) => Math.min(v + 50, allUrls.length))}
              className="mt-6 px-6 py-2 btn"
              disabled={loadingMore}
            >
              {loadingMore ? "Carregando..." : "Carregar mais"}
            </button>
          )}
          <div ref={bottomRef} />
        </>
      )}
    </div>
  );
}
