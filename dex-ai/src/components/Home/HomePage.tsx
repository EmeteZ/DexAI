// Importa os componentes Banner e Cards
import Banner from '../Home/Banner';
import Cards from '../Home/Cards';

// Componente da página inicial
export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Renderiza o banner no topo da página */}
      <Banner />

      {/* Container que segura os cards */}
      <div className="flex gap-5 mt-6">
        <Cards />
      </div>
    </div>
  );
}
