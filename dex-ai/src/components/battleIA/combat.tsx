"use client";

// Imports de bibliotecas
import React, { useState } from "react"; // Lib de UI e gerenciamento de estado.
import { GoogleGenAI } from "@google/genai"; // Cliente da API do Google Gemini.
import ReactMarkdown from "react-markdown"; // Componente para renderizar Markdown.

// Interfaces para tipagem
interface PokemonStat {
  stat: {
    name: string;
  };
  base_stat: number;
}

interface PokemonType {
  type: {
    name: string;
  };
}

interface PokemonApiResponse {
  name: string;
  stats: PokemonStat[];
  types: PokemonType[];
}

interface PokemonData {
  name: string;
  stats: Record<string, number>;
  types: string[];
}

// Carrega a API key das variáveis de ambiente.
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;

// Validação da API key na inicialização.
if (!apiKey) {
  throw new Error("NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY não foi definida.");
}

// Instancia o cliente da IA.
const ai = new GoogleGenAI({ apiKey });

export default function Combat() {
  // Estados do componente para controlar os inputs, a resposta, o loading e erros.
  const [pokemon1, setPokemon1] = useState("");
  const [pokemon2, setPokemon2] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Busca e formata os dados de um Pokémon via PokeAPI.
  async function fetchPokemonStats(name: string): Promise<PokemonData> {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
    );
    if (!response.ok) throw new Error(`Pokémon ${name} não encontrado.`);

    const data: PokemonApiResponse = await response.json();
    const stats: Record<string, number> = {};
    data.stats.forEach((stat: PokemonStat) => {
      stats[stat.stat.name] = stat.base_stat;
    });

    // Retorna um objeto estruturado com os dados relevantes.
    return {
      name: data.name,
      stats,
      types: data.types.map((t: PokemonType) => t.type.name),
    };
  }

  // Orquestra a simulação: busca dados, monta o prompt e chama a IA.
  async function handleSimulate() {
    setLoading(true);
    setError("");
    setResponseText("");

    try {
      // Busca os dados de ambos os Pokémon em paralelo para otimização.
      const [p1, p2] = await Promise.all([
        fetchPokemonStats(pokemon1),
        fetchPokemonStats(pokemon2),
      ]);

      // Constrói o prompt detalhado para o modelo Gemini, injetando os dados da API.
      const prompt = `
      Você é um narrador de batalhas Pokémon. Sua missão é contar uma luta entre dois Pokémon como se fosse uma história breve, em turnos.

      REGRAS:
      - Fale bem brevemente sobre cada Pokémon antes da luta (1 a 2 frases para cada).
      - Narre a luta em formato de **turnos** (Turno 1, Turno 2, ...).
      - Cada turno deve descrever a ação de cada Pokémon de forma curta, mas emocionante.
      - Não cite números de status ou porcentagens de HP.
      - Use estilo de narrativa, não lista de golpes técnicos. (Exemplo: "Um raio psíquico ilumina o campo" em vez de "usou Psychic").
      - No último turno, descreva quem venceu e por quê, de forma breve e clara.
      - Em igualdade de condições, escolha o vencedor mais consistente com o conjunto (tipo + habilidades + lore).

      REGRAS DE COERÊNCIA (OBRIGATÓRIAS)
      - Respeite vantagens, resistências e imunidades de tipo.
      - Considere papéis de lore e poder geral: entidades divinas/cósmicas (ex.: Arceus) não perdem em condições padrão.
      - Se ARCEUS estiver em campo, ele vence por padrão nas condições abaixo. Só permita derrota se eu tiver habilitado explicitamente um cenário especial (ex.: handicaps severos).
      - Se um resultado improvável acontecer (apenas quando permitido), explique a razão canônica/estratégica com clareza.
      - Mega evoluções: ATIVADAS por padrão (se necessario).


      DADOS DO CONFRONTO
      Pokémon 1: ${p1.name}
      Tipos: ${p1.types.join(", ")}
      Estatísticas: HP ${p1.stats.hp}, Ataque ${p1.stats.attack}, Defesa ${
        p1.stats.defense
      }, Ataque Especial ${p1.stats["special-attack"]}, Defesa Especial ${
        p1.stats["special-defense"]
      }, Velocidade ${p1.stats.speed}

      Pokémon 2: ${p2.name}
      Tipos: ${p2.types.join(", ")}
      Estatísticas: HP ${p2.stats.hp}, Ataque ${p2.stats.attack}, Defesa ${
        p2.stats.defense
      }, Ataque Especial ${p2.stats["special-attack"]}, Defesa Especial ${
        p2.stats["special-defense"]
      }, Velocidade ${p2.stats.speed}

      SAÍDA ESPERADA (em Markdown):
      - Breve introdução dos Pokémon.
      - **Turno 1**: ação dos dois.
      - **Turno 2**: ação dos dois.
      - ...
      - Último turno: conclusão e vencedor.
      `;

      // Envia o prompt para o modelo Gemini e aguarda a resposta.
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
      });

      setResponseText(response.text || "Sem resposta da IA.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao processar a simulação.");
      }
    } finally {
      setLoading(false);
    }
  }

  // Renderização do componente (JSX).
  return (
    <div className="p-6 max-w-xl mx-auto flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">
        ⚔️ Simulador de Combate Pokémon
      </h1>

      {/* Inputs controlados com binding de duas vias (value/onChange). */}
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

      {/* Botão de ação com estado de loading e validação de inputs. */}
      <button
        onClick={handleSimulate}
        disabled={loading || !pokemon1 || !pokemon2}
        className="btn py-2 px-4"
      >
        {loading ? "Simulando..." : "Simular Combate"}
      </button>

      {/* Renderização condicional para mensagens de erro. */}
      {error && <p className="text-red-600 mt-4">{error}</p>}

      {/* Renderização condicional do resultado da IA. */}
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