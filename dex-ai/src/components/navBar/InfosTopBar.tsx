"use client";

import { FaGithub, FaLinkedin } from "react-icons/fa";
import { TbInfoSquareRoundedFilled } from "react-icons/tb";
import { useState } from "react";

// Lista com os links a serem exibidos
const links = [
  {
    icon: <FaGithub className="text-white w-4 h-4" />,
    label: "GitHub",
    href: "https://github.com/EmeteZ/DexAI",
  },
  {
    icon: <FaLinkedin className="text-white w-4 h-4" />,
    label: "Linkedin",
    href: "https://www.linkedin.com/in/matheus-macedo-697591207/",
  },
];

export default function InfosTopBar() {
  // Estado que controla se a janela modal está aberta
  const [isOpen, setIsOpen] = useState(false);

  return (
    // Barra azul no topo
    <div className="px-6 flex items-center h-9 bg-blue2 justify-end">
      {/* Contêiner flex que agrupa todos os links e botões */}
      <div className="flex items-center gap-4">
        {links.map((item, index) => (
          <a
            key={index}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            {item.icon}
            <span className="text-sm font-medium text-white">{item.label}</span>
          </a>
        ))}

        {/* Botão de abrir janela "Sobre o Projeto" */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <TbInfoSquareRoundedFilled className="text-white w-4 h-4" />
          <span className="text-sm font-medium text-white cursor-pointer">
            Sobre o Projeto
          </span>
        </button>
      </div>

      {/* Modal que aparece ao clicar no botão */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          {/* Conteúdo do modal. */}
          <div className="bg-white rounded-xl shadow-2xl w-130 max-w-full p-5 text-center">
            <h2 className="text-base font-semibold text-textb mb-3">Saiba mais</h2>
            <div className="text-sm text-gray-600">
  <h1>Resumo do Projeto DexAI</h1>
  <p>
    O projeto DexAI é uma aplicação full-stack dividida em frontend
    <strong> Next.js</strong> e backend
    <strong> Node.js/Express</strong>.
  </p>
  <h2>O que foi feito?</h2>
  <ul>
    <li>
      <strong>Frontend:</strong> Criação de interfaces para
      <strong> Pokédex</strong>, <strong>Quiz</strong>,
      <strong> Tops Pokémons</strong> e
      <strong> batalhas com IA</strong>.
    </li>
    <li>
      <strong>Backend:</strong> Desenvolvimento de um servidor com
      <strong> Node.js/Express</strong> para gerenciar a comunicação
      com a API Gemini do Google.
    </li>
    <li>
      <strong>Integração:</strong> Conexão entre as duas partes,
      onde o frontend envia comandos ao backend, que usa a
      <strong> API Gemini</strong> para gerar respostas de IA para as
      batalhas de Pokémon.
    </li>
  </ul>
  <p>
    O objetivo final foi criar uma aplicação interativa que une
    dados de Pokémon com a inteligência artificial do Google.
  </p>
</div>
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
    </div>
  );
}
