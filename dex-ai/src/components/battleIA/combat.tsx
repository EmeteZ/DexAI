"use client";
import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("A chave da API não foi encontrada. Verifique o arquivo .env.");
}

const ai = new GoogleGenAI({ apiKey });

export default function Combat() {
  const [pokemon1, setPokemon1] = useState("");
  const [pokemon2, setPokemon2] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Função para buscar dados do Pokémon
  async function fetchPokemonStats(name: string) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    if (!response.ok) throw new Error(`Pokémon ${name} não encontrado.`);

    const data = await response.json();
    const stats: Record<string, number> = {};
    data.stats.forEach((stat: any) => {
      stats[stat.stat.name] = stat.base_stat;
    });

    return {
      name: data.name,
      stats,
      types: data.types.map((t: any) => t.type.name),
    };
  }

  // Função para simular combate
  async function handleSimulate() {
    setLoading(true);
    setError("");
    setResponseText("");

    try {
      const [p1, p2] = await Promise.all([
        fetchPokemonStats(pokemon1),
        fetchPokemonStats(pokemon2),
      ]);

      const prompt = `
Simule um embate entre dois pokémons com base nas seguintes informações:

Pokémon 1: ${p1.name}
Tipos: ${p1.types.join(", ")}
Estatísticas: HP ${p1.stats.hp}, Ataque ${p1.stats.attack}, Defesa ${p1.stats.defense}, 
Ataque Especial ${p1.stats["special-attack"]}, Defesa Especial ${p1.stats["special-defense"]}, 
Velocidade ${p1.stats.speed}

Pokémon 2: ${p2.name}
Tipos: ${p2.types.join(", ")}
Estatísticas: HP ${p2.stats.hp}, Ataque ${p2.stats.attack}, Defesa ${p2.stats.defense}, 
Ataque Especial ${p2.stats["special-attack"]}, Defesa Especial ${p2.stats["special-defense"]}, 
Velocidade ${p2.stats.speed}

Monte a luta como se fosse uma narrativa de RPG, sem citar números diretamente. 
Use Markdown com **títulos**, **listas** e **negrito** para organizar a resposta.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      setResponseText(response.text || "Sem resposta da IA.");
    } catch (err: any) {
      setError(err.message || "Erro ao buscar dados dos pokémons.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">⚔️ Simulador de Combate Pokémon</h1>

      {/* Inputs */}
      <div className="mb-4 w-full">
        <input
          type="text"
          placeholder="Nome do Pokémon 1"
          value={pokemon1}
          onChange={(e) => setPokemon1(e.target.value)}
          className="input p-2 w-full mb-2"
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Nome do Pokémon 2"
          value={pokemon2}
          onChange={(e) => setPokemon2(e.target.value)}
          className="input p-2 w-full"
          disabled={loading}
        />
      </div>

      {/* Botão */}
      <button
        onClick={handleSimulate}
        disabled={loading || !pokemon1 || !pokemon2}
        className="btn py-2 px-4"
      >
        {loading ? "Simulando..." : "Simular Combate"}
      </button>

      {/* Erros */}
      {error && <p className="text-red-600 mt-4">{error}</p>}

      {/* Resultado */}
      {responseText && (
        <div className="mt-6 p-4 border rounded bg-gray-100 w-full">
          <h2 className="font-semibold mb-2">Resultado da Simulação:</h2>
          <div className="Prose">
            <ReactMarkdown>{responseText}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
