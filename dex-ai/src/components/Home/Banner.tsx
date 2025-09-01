// Componente interativo que roda no navegador.
"use client";

// Importa o componente Image do Next.js e hooks do React.
import Image from "next/image";
import React, { useRef } from "react";

export default function Banner() {
  // Referência para manipular o estilo da imagem diretamente via DOM.
  const imgRef = useRef<HTMLImageElement>(null);

  // Cria o efeito 3D de inclinação conforme o mouse se move.
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!imgRef.current) return;

    const banner = e.currentTarget;
    const rect = banner.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 15;
    const rotateX = -((y - centerY) / centerY) * 10;

    imgRef.current.style.transform = `perspective(800px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.07)`;
    imgRef.current.style.transition = "transform 0.1s";
  }

  // Reseta a imagem para a posição original quando o mouse sai do banner.
  function handleMouseLeave() {
    if (imgRef.current) {
      imgRef.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
      imgRef.current.style.transition = "transform 0.5s";
    }
  }

  return (
    <div
      className="relative flex w-full h-56 cursor-pointer items-center justify-center overflow-hidden shadow-inner-strong"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative flex h-full w-full items-center justify-center bg-black/20">
        {/*
          Componente 'Image' do Next.js para otimização automática.
          A propriedade 'fill' faz a imagem ocupar todo o espaço do container pai (que precisa ser 'relative').
        */}
        <Image
          // Conecta esta imagem à referência para manipulação de estilo.
          ref={imgRef}
          src="/assets/Images/Charizard.png"
          alt="Charizard"
          fill
          className="object-cover object-center"
          style={{
            willChange: "transform", // Dica de otimização para o navegador.
            transition: "transform 0.5s cubic-bezier(.25,.8,.25,1)",
          }}
          // A propriedade 'sizes' ajuda o Next.js a servir a imagem no tamanho correto
          // para diferentes telas, melhorando a performance.
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </div>
  );
}