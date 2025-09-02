// Importa os componentes Banner e Cards
import Banner from "../Home/Banner";
import Cards from "../Home/Cards";

// Componente da página inicial
export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* Renderiza o banner no topo da página */}
      <Banner />

      {/* Container que segura os cards */}
      <div className="flex justify-center items-center gap-5 mt-16 w-full">
        <Cards />
      </div>
    </div>
  );
}
