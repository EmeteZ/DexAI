"use client";
import React, { useRef } from "react";

export default function Banner() {
  const imgRef = useRef<HTMLImageElement>(null);

  // Função chamada ao mover o mouse sobre o banner
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const banner = e.currentTarget;
    const rect = banner.getBoundingClientRect();
    const x = e.clientX - rect.left; // posição X do mouse dentro do banner
    const y = e.clientY - rect.top;  // posição Y do mouse dentro do banner

    // Centraliza as coordenadas em relação ao centro do banner
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 15; // até 15 graus para os lados
    const rotateX = -((y - centerY) / centerY) * 10; // até 10 graus para cima/baixo

    if (imgRef.current) {
      imgRef.current.style.transform = `
        perspective(800px)
        rotateY(${rotateY}deg)
        rotateX(${rotateX}deg)
        scale(1.07)
      `;
      imgRef.current.style.transition = "transform 0.1s";
    }
  }

  // Ao sair do banner, reseta o efeito
  function handleMouseLeave() {
    if (imgRef.current) {
      imgRef.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
      imgRef.current.style.transition = "transform 0.5s";
    }
  }

  return (
    <div
      className="flex relative w-full h-56 overflow-hidden shadow-inner-strong items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: "pointer" }}
    >
      <div className="flex bg-black/20 w-full h-fit items-center justify-center">
        <img
          ref={imgRef}
          src="/assets/Images/Charizard.png"
          alt="Charizard"
          className="w-auto h-56 object-cover object-center"
          style={{
            willChange: "transform",
            transition: "transform 0.5s cubic-bezier(.25,.8,.25,1)",
            
          }}
        />
      </div>
    </div>
  );
}
