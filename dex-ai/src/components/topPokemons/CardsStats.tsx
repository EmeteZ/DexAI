"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
  };
  stats: Stat[];
}

interface Stat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

interface PokemonDetail {
  id: number;
  name: string;
  sprite: string | null;
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
}

interface PokemonCard {
  id: number;
  name: string;
  sprite: string | null;
  value: number;
}

const getStatValue = (stats: Stat[], statName: string) => {
  const found = stats?.find((s) => s.stat?.name === statName);
  return found ? found.base_stat : 0;
};

// Retry leve com backoff exponencial
async function fetchWithRetry(input: RequestInfo, init?: RequestInit, retries = 2, backoffMs = 300): Promise<Response> {
  let lastErr: unknown = null;
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(input, init);
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      return res;
    } catch (e) {
      lastErr = e;
      if (i < retries) {
        await new Promise((r) => setTimeout(r, backoffMs * Math.pow(2, i)));
        continue;
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Falha de rede");
}

export default function CardsStats() {
  const [topHP, setTopHP] = useState<PokemonCard[]>([]);
  const [topAttack, setTopAttack] = useState<PokemonCard[]>([]);
  const [topDefense, setTopDefense] = useState<PokemonCard[]>([]);
  const [topSpAttack, setTopSpAttack] = useState<PokemonCard[]>([]);
  const [topSpDefense, setTopSpDefense] = useState<PokemonCard[]>([]);
  const [topSpeed, setTopSpeed] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    async function fetchAll() {
      try {
        setLoading(true);

        // 1) Buscar lista paginada
        const allResults: { name: string; url: string }[] = [];
        const totalToFetch = 1000;
        const pageSize = 200;

        for (let offset = 0; offset < totalToFetch; offset += pageSize) {
          const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${pageSize}`;
          const listRes = await fetchWithRetry(url, { signal: controller.signal });
          const listData = await listRes.json();
          const page = Array.isArray(listData?.results) ? listData.results : [];
          allResults.push(...page);
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
                hp: getStatValue(d.stats, "hp"),
                attack: getStatValue(d.stats, "attack"),
                defense: getStatValue(d.stats, "defense"),
                special_attack: getStatValue(d.stats, "special-attack"),
                special_defense: getStatValue(d.stats, "special-defense"),
                speed: getStatValue(d.stats, "speed"),
              } as PokemonDetail;
            })
          );
          settled.forEach((s) => {
            if (s.status === "fulfilled") details.push(s.value);
          });
        }

        // 3) Montar os tops
        const byHP = [...details].sort((a, b) => b.hp - a.hp).slice(0, 10);
        const byAttack = [...details].sort((a, b) => b.attack - a.attack).slice(0, 10);
        const byDefense = [...details].sort((a, b) => b.defense - a.defense).slice(0, 10);
        const bySpAtk = [...details].sort((a, b) => b.special_attack - a.special_attack).slice(0, 10);
        const bySpDef = [...details].sort((a, b) => b.special_defense - a.special_defense).slice(0, 10);
        const bySpeed = [...details].sort((a, b) => b.speed - a.speed).slice(0, 10);

        setTopHP(byHP.map((p) => ({ id: p.id, name: p.name, sprite: p.sprite, value: p.hp })));
        setTopAttack(byAttack.map((p) => ({ id: p.id, name: p.name, sprite: p.sprite, value: p.attack })));
        setTopDefense(byDefense.map((p) => ({ id: p.id, name: p.name, sprite: p.sprite, value: p.defense })));
        setTopSpAttack(bySpAtk.map((p) => ({ id: p.id, name: p.name, sprite: p.sprite, value: p.special_attack })));
        setTopSpDefense(bySpDef.map((p) => ({ id: p.id, name: p.name, sprite: p.sprite, value: p.special_defense })));
        setTopSpeed(bySpeed.map((p) => ({ id: p.id, name: p.name, sprite: p.sprite, value: p.speed })));
      } catch (e) {
        const err = e as Error;
        if (err?.name === "AbortError") return;
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();

    return () => {
      controller.abort();
    };
  }, []);

  const Placeholder = () => (
    <div
      className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200"
      aria-label="Sem sprite"
    />
  );

  const renderTable = (title: string, data: PokemonCard[], statLabel: string, starColor: string) => (
    <div
      className="flex flex-col px-4 py-4 bg-neutral h-auto w-96 rounded-xl items-center shadow-lg transition-transform duration-300 p-5 pt-5"
      style={{
        maxHeight: "320px",
        overflowY: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: "#d1d5db #f3f4f6",
      }}
    >
      {/* Scrollbar minimalista */}
      <style>
        {`
          .scrollbar-minimal::-webkit-scrollbar {
            width: 4px;
            border-radius: 8px;
            background: #f3f4f6;
          }
          .scrollbar-minimal::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 8px;
          }
        `}
      </style>
      <p className="text-sm font-medium text-gray mb-2 ml-2">{title}</p>
      <div className="scrollbar-minimal w-full">
        {loading ? (
          <p className="text-gray-500 text-sm">Carregando...</p>
        ) : (
          data.map((pokemon, idx) => (
            <div
              key={`${pokemon.id}-${statLabel}`}
              className="relative flex h-14 w-full rounded-xl shadow bg-white items-center pl-4 pr-4 mb-3"
              style={{ minWidth: 220 }}
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
                  {pokemon.value} <span className="font-normal text-gray-600">{statLabel}</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="flex align-center m-6 flex-col">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-10 w-full justify-center">
        {renderTable("Melhores em HP", topHP, "HP", "text-red-400")}
        {renderTable("Melhores em Ataque", topAttack, "ATK", "text-orange-500")}
        {renderTable("Melhores em Defesa", topDefense, "DEF", "text-blue-400")}
        {renderTable("Melhores em Velocidade", topSpeed, "Speed", "text-pink-500")}
        {renderTable("Melhores em Sp. Atk", topSpAttack, "Sp. Atk", "text-orange-800")}
        {renderTable("Melhores em Sp. Def", topSpDefense, "Sp. Def", "text-blue-800")}
      </div>
    </div>
  );
}
