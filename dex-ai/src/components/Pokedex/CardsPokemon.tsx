"use client"; // Indica que este componente roda no cliente (Next.js)

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { typeColors, typeBackgrounds, typeList } from "@/components/Pokedex/ColorsPokemon";

// Interface para tipar os dados de cada Pokémon
interface Pokemon {
  id: number;
  name: string;
  sprites: { front_default: string | null };
  types: { type: { name: string } }[];
}

// Componente SVG da Pokébola (fallback caso a imagem do Pokémon não carregue)
const PokeballIcon = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
    <circle cx="30" cy="30" r="28" stroke="#222" strokeWidth="4" fill="#fff" />
    <path d="M2 30h56" stroke="#222" strokeWidth="4" />
    <circle cx="30" cy="30" r="10" stroke="#222" strokeWidth="4" fill="#fff" />
    <circle cx="30" cy="30" r="5" fill="#222" />
  </svg>
);

// Componente principal de Cards de Pokémon
export default function CardsPokemon() {
  // Estados do componente
  const [allUrls, setAllUrls] = useState<{ name: string; url: string }[]>([]); // URLs de todos os Pokémons
  const [pokemonCache, setPokemonCache] = useState<Map<string, Pokemon>>(new Map()); // Cache de detalhes dos Pokémons
  const [visibleCount, setVisibleCount] = useState(50); // Quantos Pokémons exibir
  const [pokemons, setPokemons] = useState<Pokemon[]>([]); // Lista de Pokémons exibidos
  const [searchTerm, setSearchTerm] = useState(""); // Filtro de busca
  const [selectedType, setSelectedType] = useState("all"); // Tipo selecionado
  const [loadingList, setLoadingList] = useState(false); // Carregando lista
  const [loadingMore, setLoadingMore] = useState(false); // Carregando mais Pokémons
  const [imgError, setImgError] = useState<Record<number, boolean>>({}); // Marca se houve erro na imagem
  const bottomRef = useRef<HTMLDivElement | null>(null); // Referência para scroll automático
  const lastVisibleCountRef = useRef<number>(visibleCount); // Guarda último valor de visibleCount

  // Buscar lista de URLs quando muda o tipo selecionado
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
        setVisibleCount(50); // Reseta contador de visíveis
        setPokemonCache(new Map()); // Limpa cache
        setPokemons([]); // Limpa lista
        setImgError({}); // Limpa erros de imagem
      } catch (e) {
        if ((e as Error)?.name !== "AbortError") console.error("Erro ao buscar lista:", e);
      } finally {
        setLoadingList(false);
      }
    }

    fetchUrlsByType();
    return () => controller.abort(); // Cancela fetch se componente desmontar
  }, [selectedType]);

  // Filtra URLs a exibir baseado na busca ou quantidade visível
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

  // Busca os detalhes dos Pokémons incrementalmente
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

      const missing = urls.filter((url) => !pokemonCache.has(url)); // Verifica quais Pokémons não estão no cache
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

          // Adiciona ao cache apenas os que foram carregados com sucesso
          settled.forEach((s, idx) => {
            if (s.status === "fulfilled") newEntries.push([batch[idx], s.value]);
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
        if ((e as Error)?.name !== "AbortError") console.error("Erro ao buscar detalhes:", e);
      } finally {
        if (!cancelled) setLoadingMore(false);
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

  // Auto-scroll ao carregar mais Pokémons
  useEffect(() => {
    if (visibleCount > lastVisibleCountRef.current && !searchTerm) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    lastVisibleCountRef.current = visibleCount;
  }, [visibleCount, searchTerm]);

  return (
    <div className="flex flex-col mt-10 items-center">
      {/* Filtros de busca e tipo */}
      <div className="flex gap-4 p-5 mb-6 w-full justify-center max-w-4xl">
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
          className=" md:w-2/5 w-25 input"
        > 
          <option value="all">Todos os Tipos</option>
          {typeList.filter((t) => t !== "all").map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de Pokémons */}
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
                  className="flex flex-col px-5 py-4 bg-neutral/25 border border-black/15 rounded-2xl items-center shadow-sm hover:shadow-md transition-shadow duration-200 w-full max-w-xs md:h-auto h-60"
                >
                  {/* Imagem do Pokémon ou Pokébola caso não carregue */}
                  <div
                    className={`md:w-36 md:h-36 w-30 flex items-center justify-center mb-4 rounded-full overflow-hidden shadow-inner ${backgroundClass}`}
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

                  {/* ID e nome */}
                  <p className="text-xs text-gray-500 mb-1">
                    #{String(pokemon.id).padStart(3, "0")}
                  </p>
                  <p className="text-base font-semibold text-gray-900 capitalize text-center">
                    {pokemon.name}
                  </p>

                  {/* Tipos do Pokémon */}
                  <div className="md:text-sm text-xs text-gray-600 mt-1">
                    <span>Tipo: </span>
                    {pokemon.types.map((type, index) => (
                      <span key={type.type.name}>
                        <span className={`md:font-medium text-xs ${typeColors[type.type.name] || "text-gray-700"}`}>
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

          {/* Mensagem se nenhum Pokémon for encontrado */}
          {pokemons.length === 0 && !loadingList && !loadingMore && searchTerm && (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">Nenhum Pokémon encontrado</p>
            </div>
          )}

          {/* Botão de carregar mais */}
          {!searchTerm && visibleCount < allUrls.length && (
            <button
              onClick={() => setVisibleCount((v) => Math.min(v + 50, allUrls.length))}
              className="mt-6 px-6 py-2 btn"
              disabled={loadingMore}
            >
              {loadingMore ? "Carregando..." : "Carregar mais"}
            </button>
          )}
          <div ref={bottomRef} /> {/* Referência para scroll automático */}
        </>
      )}
    </div>
  );
}
