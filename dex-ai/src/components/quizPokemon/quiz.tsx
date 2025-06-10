"use client";
import React, { useState, useEffect } from 'react';

function shuffleArray(array: { name: any; image: any; }[]) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function Quiz() {
  const [pokemons, setPokemons] = useState<{ name: string; image: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<null | boolean>(null);
  const [showActiveImage, setShowActiveImage] = useState(false);
  const [loading, setLoading] = useState(true);

  // Busca e embaralha os pokémons da 1ª geração (IDs 1 a 151)
  useEffect(() => {
    const fetchPokemons = async () => {
      const pokemonList = [];
      for (let id = 1; id <= 300; id++) {
        try {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          const data = await response.json();
          pokemonList.push({
            name: data.name,
            image: data.sprites.other['official-artwork'].front_default
          });
        } catch (error) {
          console.error(`Erro ao buscar Pokémon ${id}:`, error);
        }
      }
      setPokemons(shuffleArray(pokemonList));
      setLoading(false);
    };
    fetchPokemons();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando Pokémon...</div>;
  }

  if (pokemons.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Nenhum Pokémon encontrado.</div>;
  }

  const hiddenPokemon = pokemons[currentIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim().toLowerCase() === hiddenPokemon.name.toLowerCase()) {
      setIsCorrect(true);
      setShowActiveImage(true);
      setTimeout(() => {
        setShowActiveImage(false);
        setIsCorrect(null);
        setAnswer('');
        setCurrentIndex((prev) => (prev + 1) % pokemons.length);
      }, 2000);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-textb">Quem é esse Pokémon?</h1>
      <div className="bg-neutral rounded-xl shadow-lg p-6 max-w-md w-full h-100 flex flex-col items-center justify-center">
        <img
          src={hiddenPokemon.image}
          alt="Silhueta do Pokémon"
          className={`w-48 h-48 mb-6 ${showActiveImage ? '' : 'brightness-0 grayscale'}`}
        />
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
            className="bg-blue2 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue2/80 transition cursor-pointer"
            disabled={showActiveImage}
          >
            Confirmar
          </button>
        </form>
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
