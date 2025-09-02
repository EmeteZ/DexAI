"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Tipos e Helpers
interface Pokemon {
  id: number;
  name: string;
  sprites: { front_default: string | null };
  stats: Stat[];
}

interface Stat {
  base_stat: number;
  stat: { name: string };
}

interface PokemonDetail {
  id: number;
  name: string;
  sprite: string | null;
  stats: Record<string, number>;
}

interface PokemonCard {
  id: number;
  name: string;
  sprite: string | null;
  value: number;
}

// Função para pegar o valor de um stat específico
const getStatValue = (stats: Stat[], statName: string) =>
  stats.find((s) => s.stat.name === statName)?.base_stat ?? 0;

// Função de fetch com retries e backoff
async function fetchWithRetry(
  input: RequestInfo,
  init?: RequestInit,
  retries = 2,
  backoffMs = 300
): Promise<Response> {
  let lastErr: unknown = null;
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(input, init);
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      return res;
    } catch (e) {
      lastErr = e;
      if (i < retries) {
        await new Promise((r) =>
          setTimeout(r, backoffMs * Math.pow(2, i))
        );
        continue;
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Falha de rede");
}

// Configuração dos stats
const STAT_CONFIG = [
  { key: "hp", label: "HP", title: "Melhores em HP", color: "text-red-400" },
  { key: "attack", label: "ATK", title: "Melhores em Ataque", color: "text-orange-500" },
  { key: "defense", label: "DEF", title: "Melhores em Defesa", color: "text-blue-400" },
  { key: "special-attack", label: "Sp. Atk", title: "Melhores em Sp. Atk", color: "text-orange-800" },
  { key: "special-defense", label: "Sp. Def", title: "Melhores em Sp. Def", color: "text-blue-800" },
  { key: "speed", label: "Speed", title: "Melhores em Velocidade", color: "text-pink-500" },
];

// Componente principal
export default function CardsStats() {
  const [tops, setTops] = useState<Record<string, PokemonCard[]>>({});
  const [loading, setLoading] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    async function fetchAll() {
      try {
        setLoading(true);

        // 1) Buscar lista paginada de Pokémons
        const allResults: { name: string; url: string }[] = [];
        const totalToFetch = 1000;
        const pageSize = 200;

        for (let offset = 0; offset < totalToFetch; offset += pageSize) {
          const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${pageSize}`;
          const listRes = await fetchWithRetry(url, { signal: controller.signal });
          const listData = await listRes.json();
          allResults.push(...(listData?.results ?? []));
        }

        // 2) Buscar detalhes em lotes
        const details: PokemonDetail[] = [];
        const batchSize = 25;

        for (let i = 0; i < allResults.length; i += batchSize) {
          const batch = allResults.slice(i, i + batchSize);
          const settled = await Promise.allSettled(
            batch.map(async (p) => {
              const res = await fetchWithRetry(p.url, { signal: controller.signal });
              const d: Pokemon = await res.json();
              return {
                id: d.id,
                name: d.name,
                sprite: d.sprites?.front_default ?? null,
                stats: {
                  hp: getStatValue(d.stats, "hp"),
                  attack: getStatValue(d.stats, "attack"),
                  defense: getStatValue(d.stats, "defense"),
                  "special-attack": getStatValue(d.stats, "special-attack"),
                  "special-defense": getStatValue(d.stats, "special-defense"),
                  speed: getStatValue(d.stats, "speed"),
                },
              } as PokemonDetail;
            })
          );
          settled.forEach((s) => s.status === "fulfilled" && details.push(s.value));
        }

        // 3) Montar os tops 10 por stat
        const newTops: Record<string, PokemonCard[]> = {};
        STAT_CONFIG.forEach(({ key }) => {
          newTops[key] = [...details]
            .sort((a, b) => b.stats[key] - a.stats[key])
            .slice(0, 10)
            .map((p) => ({
              id: p.id,
              name: p.name,
              sprite: p.sprite,
              value: p.stats[key],
            }));
        });

        setTops(newTops);
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          console.error("Erro ao carregar dados:", e);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
    return () => controller.abort();
  }, []);

  // Helpers de UI
  const Placeholder = () => (
    <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200" aria-label="Sem sprite" />
  );

  const StatTable = ({
    title,
    data,
    statLabel,
    starColor,
  }: {
    title: string;
    data: PokemonCard[];
    statLabel: string;
    starColor: string;
  }) => (
    <div className="flex flex-col px-4 py-4 bg-neutral h-auto w-full sm:w-72 md:w-80 lg:w-96 rounded-xl items-center shadow-lg">
      <p className="text-sm font-medium text-gray mb-2 ml-2">{title}</p>
      <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 w-full max-h-80 p-2 overflow-y-auto">
        {loading ? (
          <p className="text-gray-500 text-sm">Carregando...</p>
        ) : (
          data.map((pokemon, idx) => (
            <div
              key={`${pokemon.id}-${statLabel}`}
              className="relative flex h-14 w-full rounded-xl shadow bg-white items-center pl-4 pr-4 mb-3"
            >
              {idx === 0 && (
                <span
                  className={`absolute -top-2 -left-2 ${starColor} text-xl drop-shadow-lg`}
                  title={`Maior ${statLabel}`}
                >
                  ★
                </span>
              )}
              <div className="w-12 h-12 bg-neutralb/50 rounded-full flex items-center justify-center overflow-hidden">
                {pokemon.sprite ? (
                  <Image
                    src={pokemon.sprite}
                    alt={pokemon.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain"
                    draggable={false}
                    unoptimized
                  />
                ) : (
                  <Placeholder />
                )}
              </div>
              <p className="text-sm font-semibold text-gray-700 ml-4 capitalize w-24 truncate">
                {pokemon.name}
              </p>
              <div className="flex-1 flex justify-end">
                <p className={`text-sm font-bold tracking-wide ${starColor}`}>
                  {pokemon.value}{" "}
                  <span className="font-normal text-gray-600">{statLabel}</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Render
  return (
    <div className="flex align-center m-6 flex-col">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6 w-full justify-center">
        {STAT_CONFIG.map(({ key, label, title, color }) => (
          <StatTable
            key={key}
            title={title}
            data={tops[key] ?? []}
            statLabel={label}
            starColor={color}
          />
        ))}
      </div>
    </div>
  );
}
