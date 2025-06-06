"use client";
import React, { useState } from 'react';

const pokemons = [
  { name: 'Charmander', image: '/assets/Images/Quiz/charmander.png' },
  { name: 'Bulbasaur', image: '/assets/Images/Quiz/bulbasaur.png' },
  { name: 'Squirtle', image: '/assets/Images/Quiz/squirtle.png' },
  // Adicione mais pokémons conforme desejar
];

export default function Quiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<null | boolean>(null);
  const [showActiveImage, setShowActiveImage] = useState(false);

  const hiddenPokemon = pokemons[currentIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim().toLowerCase() === hiddenPokemon.name.toLowerCase()) {
      setIsCorrect(true);
      setShowActiveImage(true);
      // Após 2 segundos, avança para o próximo pokémon e reseta estados
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
            className="border border-gray-300 bg-white rounded-md p-2 w-full mb-4 focus:outline-none focus:ring-2 "
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
