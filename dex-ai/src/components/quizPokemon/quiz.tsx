"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

type PokemonItem = { name: string; image: string | null };

function shuffleArray(array: PokemonItem[]) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function Quiz() {
  const [pokemons, setPokemons] = useState<PokemonItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<null | boolean>(null);
  const [showActiveImage, setShowActiveImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    async function fetchPokemons() {
      try {
        setLoading(true);
        // ids 1..300
        const ids = Array.from({ length: 300 }, (_, i) => i + 1);
        const batchSize = 30;
        const list: PokemonItem[] = [];

        for (let i = 0; i < ids.length; i += batchSize) {
          const batch = ids.slice(i, i + batchSize);
          const settled = await Promise.allSettled(
            batch.map(async (id) => {
              const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
                signal: controller.signal,
              });
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              const data = await res.json();
              const image: string | null =
                data?.sprites?.other?.["official-artwork"]?.front_default ?? null;
              return { name: data.name as string, image };
            })
          );
          settled.forEach((s) => {
            if (s.status === "fulfilled") list.push(s.value);
          });
        }

        // Mantém apenas itens com imagem para evitar “buracos”
        const withImage = list.filter((p) => !!p.image);
        setPokemons(shuffleArray(withImage.length ? withImage : list));
        setCurrentIndex(0);
      } catch (e) {
        const err = e as Error;
        if (err?.name !== "AbortError") {
          console.error("Erro ao buscar Pokémons:", err);
          setPokemons([]);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPokemons();

    return () => {
      controller.abort();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando Pokémon...
      </div>
    );
  }

  if (pokemons.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Nenhum Pokémon encontrado.
      </div>
    );
  }

  const hiddenPokemon = pokemons[currentIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hiddenPokemon) return;

    if (answer.trim().toLowerCase() === hiddenPokemon.name.toLowerCase()) {
      setIsCorrect(true);
      setShowActiveImage(true);
      setTimeout(() => {
        setShowActiveImage(false);
        setIsCorrect(null);
        setAnswer("");
        setCurrentIndex((prev) => (prev + 1) % pokemons.length);
      }, 2000);
    } else {
      setIsCorrect(false);
    }
  };

  const handleSkip = () => {
    setShowActiveImage(false);
    setIsCorrect(null);
    setAnswer("");
    setCurrentIndex((prev) => (prev + 1) % pokemons.length);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-textb">Quem é esse Pokémon?</h1>

      <div className="bg-neutral rounded-xl shadow-lg p-6 max-w-md w-full h-100 flex flex-col items-center justify-center">
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

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <input
            type="text"
            placeholder="Digite o nome do Pokémon"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="border border-gray-300 bg-white rounded-md p-2 w-full mb-4 focus:outline-none focus:ring-2"
            disabled={showActiveImage}
          />
          <button
            type="submit"
            className="bg-blue2 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue2/80 transition cursor-pointer disabled:opacity-60"
            disabled={showActiveImage}
          >
            Confirmar
          </button>
        </form>

        <button
          onClick={handleSkip}
          className="mt-4 bg-gray-400 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-500 transition cursor-pointer disabled:opacity-60"
          disabled={showActiveImage}
        >
          Atualizar
        </button>

        {isCorrect === true && (
          <p className="mt-4 text-green-600 font-semibold">Parabéns! Você acertou!</p>
        )}
        {isCorrect === false && (
          <p className="mt-4 text-red-600 font-semibold">Tente novamente!</p>
        )}
      </div>
    </div>
  );
}
