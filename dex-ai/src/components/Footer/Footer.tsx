"use client";

// Importações de dependências.
import { IoIosWarning } from "react-icons/io";
import { useState } from "react";

// Componente para o rodapé que inclui um modal de aviso.
export default function Footer() {
  // Estado para controlar a visibilidade do modal.
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Barra do rodapé com o gatilho para abrir o modal. */}
      <div className="flex items-center justify-center bg-blue2 h-8 px-6 mt-10">
        <button
          onClick={() => setIsOpen(true)}
          className="text-sm font-medium text-white cursor-pointer items-center flex gap-2 hover:opacity-80 transition-opacity"
        >
          <IoIosWarning />
          Aviso legal
        </button>
      </div>

      {/* Renderização condicional do modal com base no estado 'isOpen'. */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          {/* Conteúdo do modal. */}
          <div className="bg-white rounded-xl shadow-2xl w-80 max-w-full p-5 text-center">
            <h2 className="text-base font-semibold text-textb mb-3">
              Atenção
            </h2>
            <p className="text-sm text-gray-600">
              Este projeto é apenas para fins educacionais e não possui fins
              lucrativos. As imagens e nomes relacionados à franquia Pokémon são
              de propriedade da The Pokémon Company, Nintendo e Game Freak.
            </p>
            {/* Botão que fecha o modal alterando o estado. */}
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 px-4 py-2 text-sm bg-blue2 text-white rounded hover:brightness-110 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}