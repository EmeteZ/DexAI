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

  async function fetchPokemonStats(name) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      if (!response.ok) {
        throw new Error(`Pokémon ${name} não encontrado.`);
      }
      const data = await response.json();
      // Extrair estatísticas relevantes
      const stats = {};
      data.stats.forEach(stat => {
        stats[stat.stat.name] = stat.base_stat;
      });
      // Extrair tipos
      const types = data.types.map(t => t.type.name);
      return {
        name: data.name,
        stats,
        types
      };
    } catch (err) {
      throw err;
    }
  }

  async function handleSimulate() {
    setLoading(true);
    setError("");
    setResponseText("");
    try {
      const p1 = await fetchPokemonStats(pokemon1);
      const p2 = await fetchPokemonStats(pokemon2);

      // Montar prompt para Gemini
      const prompt = `Simule um embate entre dois pokémons com base nas seguintes informações:

Pokémon 1: ${p1.name}
Tipos: ${p1.types.join(", ")}
Estatísticas: HP ${p1.stats.hp}, Ataque ${p1.stats.attack}, Defesa ${p1.stats.defense}, Ataque Especial ${p1.stats['special-attack']}, Defesa Especial ${p1.stats['special-defense']}, Velocidade ${p1.stats.speed}

Pokémon 2: ${p2.name}
Tipos: ${p2.types.join(", ")}
Estatísticas: HP ${p2.stats.hp}, Ataque ${p2.stats.attack}, Defesa ${p2.stats.defense}, Ataque Especial ${p2.stats['special-attack']}, Defesa Especial ${p2.stats['special-defense']}, Velocidade ${p2.stats.speed}

Baseie o resultado em fundamentos de batalha Pokémon, considerando tipos, estatísticas e estratégias. Não quero que diga nenhuma estatistica, apenas diga como seria e um pequeno resumo do porque. Responda em formato Markdown, usando títulos, listas e negrito para destacar os pontos principais`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

      setResponseText(response.text || "Sem resposta da IA.");
    } catch (err) {
      setError(err.message || "Erro ao buscar dados dos pokémons.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Simulador de Combate Pokémon</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nome do Pokémon 1"
          value={pokemon1}
          onChange={(e) => setPokemon1(e.target.value)}
          className="border p-2 rounded w-full mb-2"
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Nome do Pokémon 2"
          value={pokemon2}
          onChange={(e) => setPokemon2(e.target.value)}
          className="border p-2 rounded w-full"
          disabled={loading}
        />
      </div>
      <button
        onClick={handleSimulate}
        disabled={loading || !pokemon1 || !pokemon2}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Simulando..." : "Simular Combate"}
      </button>
      {error && <p className="text-red-600 mt-4">{error}</p>}
      {responseText && (
        <div className="mt-6 p-4 border rounded bg-gray-100 whitespace-pre-wrap">
          <h2 className="font-semibold mb-2">Resultado da Simulação:</h2>
          <div className="Prose">
           <ReactMarkdown>{responseText}</ReactMarkdown>
           </div>
        </div>
      )}
    </div>
  );
}
