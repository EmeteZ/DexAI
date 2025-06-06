"use client";
import { useEffect, useState } from "react";

interface Pokemon {
    id: number;
    name: string;
    sprites: {
        front_default: string;
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

interface PokemonCard {
    id: number;
    name: string;
    sprite: string;
    value: number;
}

const getStatValue = (stats: Stat[], statName: string) => {
    const found = stats.find((s) => s.stat.name === statName);
    return found ? found.base_stat : 0;
};

export default function CardsStats() {
    const [topHP, setTopHP] = useState<PokemonCard[]>([]);
    const [topAttack, setTopAttack] = useState<PokemonCard[]>([]);
    const [topDefense, setTopDefense] = useState<PokemonCard[]>([]);
    const [topSpAttack, setTopSpAttack] = useState<PokemonCard[]>([]);
    const [topSpDefense, setTopSpDefense] = useState<PokemonCard[]>([]);
    const [topSpeed, setTopSpeed] = useState<PokemonCard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPokemons() {
            const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
            const data = await response.json();

            const pokemonsDetails = await Promise.all(
                data.results.map(async (pokemon: { url: string }) => {
                    const res = await fetch(pokemon.url);
                    const details: Pokemon = await res.json();
                    return {
                        id: details.id,
                        name: details.name,
                        sprite: details.sprites.front_default,
                        hp: getStatValue(details.stats, "hp"),
                        attack: getStatValue(details.stats, "attack"),
                        defense: getStatValue(details.stats, "defense"),
                        special_attack: getStatValue(details.stats, "special-attack"),
                        special_defense: getStatValue(details.stats, "special-defense"),
                        speed: getStatValue(details.stats, "speed"),
                    };
                })
            );

            setTopHP(
                [...pokemonsDetails]
                    .sort((a, b) => b.hp - a.hp)
                    .slice(0, 10)
                    .map((p) => ({
                        id: p.id,
                        name: p.name,
                        sprite: p.sprite,
                        value: p.hp,
                    }))
            );
            setTopAttack(
                [...pokemonsDetails]
                    .sort((a, b) => b.attack - a.attack)
                    .slice(0, 10)
                    .map((p) => ({
                        id: p.id,
                        name: p.name,
                        sprite: p.sprite,
                        value: p.attack,
                    }))
            );
            setTopDefense(
                [...pokemonsDetails]
                    .sort((a, b) => b.defense - a.defense)
                    .slice(0, 10)
                    .map((p) => ({
                        id: p.id,
                        name: p.name,
                        sprite: p.sprite,
                        value: p.defense,
                    }))
            );
            setTopSpAttack(
                [...pokemonsDetails]
                    .sort((a, b) => b.special_attack - a.special_attack)
                    .slice(0, 10)
                    .map((p) => ({
                        id: p.id,
                        name: p.name,
                        sprite: p.sprite,
                        value: p.special_attack,
                    }))
            );
            setTopSpDefense(
                [...pokemonsDetails]
                    .sort((a, b) => b.special_defense - a.special_defense)
                    .slice(0, 10)
                    .map((p) => ({
                        id: p.id,
                        name: p.name,
                        sprite: p.sprite,
                        value: p.special_defense,
                    }))
            );
            setTopSpeed(
                [...pokemonsDetails]
                    .sort((a, b) => b.speed - a.speed)
                    .slice(0, 10)
                    .map((p) => ({
                        id: p.id,
                        name: p.name,
                        sprite: p.sprite,
                        value: p.speed,
                    }))
            );
            setLoading(false);
        }

        fetchPokemons();
    }, []);

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
                            key={pokemon.id}
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
                                <img
                                    src={pokemon.sprite}
                                    alt={pokemon.name}
                                    className="w-12 h-12 object-cover"
                                    style={{ objectPosition: "center" }}
                                />
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
