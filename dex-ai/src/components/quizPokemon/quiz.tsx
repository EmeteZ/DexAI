"use client"; // Indica que o componente roda no cliente (Next.js)

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

// Tipo de cada Pokémon no quiz
type PokemonItem = { name: string; image: string };

// Função para embaralhar um array
function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

// Componente principal do Quiz
export default function Quiz() {
  // Estados do componente
  const [pokemons, setPokemons] = useState<PokemonItem[]>([]); // Lista de Pokémons
  const [currentIndex, setCurrentIndex] = useState(0); // Índice do Pokémon atual
  const [answer, setAnswer] = useState(""); // Resposta digitada
  const [isCorrect, setIsCorrect] = useState<null | boolean>(null); // Se a resposta está correta
  const [showActiveImage, setShowActiveImage] = useState(false); // Mostra a imagem colorida quando acerta
  const [loading, setLoading] = useState(true); // Loading enquanto busca Pokémons
  const abortRef = useRef<AbortController | null>(null); // AbortController para cancelar fetchs

  // Avança para o próximo Pokémon
  const nextPokemon = useCallback(() => {
    setShowActiveImage(false);
    setIsCorrect(null);
    setAnswer("");
    setCurrentIndex((prev) => (prev + 1) % pokemons.length);
  }, [pokemons.length]);

  // Busca os Pokémons ao montar o componente
  useEffect(() => {
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;

    async function fetchPokemons() {
      try {
        setLoading(true);
        const ids = Array.from({ length: 151 }, (_, i) => i + 1); // IDs dos Pokémons
        const batchSize = 30;
        const list: PokemonItem[] = [];

        // Busca os Pokémons em lotes para não sobrecarregar
        for (let i = 0; i < ids.length; i += batchSize) {
          const batch = ids.slice(i, i + batchSize);
          const settled = await Promise.allSettled(
            batch.map(async (id) => {
              const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
                signal: controller.signal,
              });
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              const data = await res.json();
              const image = data?.sprites?.other?.["official-artwork"]?.front_default;
              if (image) return { name: data.name, image };
              throw new Error("No image");
            })
          );
          settled.forEach((s) => {
            if (s.status === "fulfilled") list.push(s.value);
          });
        }

        setPokemons(shuffleArray(list)); // Embaralha Pokémons
        setCurrentIndex(0);
      } catch (e) {
        if ((e as Error)?.name !== "AbortError") {
          console.error("Erro ao buscar Pokémons:", e);
          setPokemons([]);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPokemons();
    return () => controller.abort(); // Cancela fetch ao desmontar
  }, []);

  // Exibe tela de loading
  if (loading)
    return <div className="min-h-screen flex items-center justify-center">Carregando Pokémon...</div>;

  // Exibe mensagem se nenhum Pokémon foi encontrado
  if (!pokemons.length)
    return <div className="min-h-screen flex items-center justify-center">Nenhum Pokémon encontrado.</div>;

  const hiddenPokemon = pokemons[currentIndex]; // Pokémon atual

  // Verifica a resposta do usuário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hiddenPokemon) return;

    const correct = answer.trim().toLowerCase() === hiddenPokemon.name.toLowerCase();
    setIsCorrect(correct);

    if (correct) {
      setShowActiveImage(true); // Mostra imagem colorida
      setTimeout(nextPokemon, 2000); // Passa para próximo Pokémon após 2s
    }
  };

  return (
    <div className=" mt-8 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-textb">Quem é esse Pokémon?</h1>

      {/* Card do Pokémon */}
      <div className="bg-neutral rounded-xl shadow-lg p-6 max-w-md w-full flex flex-col items-center">
        <div className="w-48 h-48 mb-6 relative">
          {hiddenPokemon?.image ? (
            <Image
              src={hiddenPokemon.image}
              alt="Silhueta do Pokémon"
              width={192}
              height={192}
              className={`${showActiveImage ? "" : "brightness-0 grayscale"} object-contain`}
              draggable={false}
              unoptimized
              priority
            />
          ) : (
            <div className="w-48 h-48 rounded-lg bg-gray-100 border border-gray-200" />
          )}
        </div>

        {/* Formulário para digitar a resposta */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <input
            type="text"
            placeholder="Digite o nome do Pokémon"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="p-2 w-full mb-4 input !bg-white"
            disabled={showActiveImage}
          />
          <div className="">
            <button
              type="submit"
              className="mr-5 btn py-2 px-4"
              disabled={showActiveImage}
            >
              Confirmar
            </button>

            <button
              onClick={nextPokemon}
              className="mt-4 btn-neutral bg-gray-900"
              disabled={showActiveImage}
            >
              Atualizar
            </button>
          </div>
        </form>

        {/* Mensagens de feedback */}
        {isCorrect === true && <p className="mt-4 text-green-600 font-semibold">Parabéns! Você acertou!</p>}
        {isCorrect === false && <p className="mt-4 text-red-600 font-semibold">Tente novamente!</p>}
      </div>
    </div>
  );
}
