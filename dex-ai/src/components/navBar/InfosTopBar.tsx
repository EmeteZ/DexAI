// Indica que o componente é interativo e roda no navegador.
"use client";

// Importa os ícones e a função de estado do React.
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { TbInfoSquareRoundedFilled } from "react-icons/tb";
import { useState } from "react";

// Uma lista com os dados dos links que serão exibidos na barra.
const links = [
  {
    icon: <FaGithub className="text-white w-4 h-4" />,
    label: "GitHub",
    href: "https://github.com/EmeteZ/DexAI"
  },
  {
    icon: <FaLinkedin className="text-white w-4 h-4" />,
    label: "Linkedin",
    href: "https://www.linkedin.com/in/matheus-macedo-697591207/"
  }
];

// Início do componente da barra de informações.
export default function InfosTopBar() {
  // 'isOpen' controla se a janela de informações está visível ou não.
  // Começa como 'false' (invisível).
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    // A barra azul no topo da página.
    <div className="px-6 flex items-center gap-8 bg-blue2 h-9 justify-end">
      
      {/* Cria os links de GitHub e Linkedin a partir da lista 'links'. */}
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

      {/* Botão que abre a janela de "Sobre o Projeto". */}
      <button
        // Ao clicar, muda 'isOpen' para 'true' para mostrar a janela.
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <TbInfoSquareRoundedFilled className="text-white w-4 h-4" />
        <span className="text-sm font-medium text-white cursor-pointer">Sobre o Projeto</span>
      </button>

      {/* A janela de informações (modal) só aparece se 'isOpen' for verdadeiro. */}
      {isOpen && (
        // O fundo escuro que cobre a tela inteira.
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-80 max-w-full p-5 text-center">
            <h2 className="text-base font-semibold text-gray-800 mb-3">
              Dex AI
            </h2>
            <p className="text-sm text-gray-600">
              pequeno resumo do projeto
            </p>
            {/* Botão para fechar a janela. */}
            <button
              // Ao clicar, muda 'isOpen' para 'false' para esconder a janela.
              onClick={() => setIsOpen(false)}
              className="mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:brightness-110 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}