import CardsStats from "@/components/topPokemons/CardsStats"; // Importa o componente que exibe os Tops de Pokémon

export default function TopPokemons() {
  return (
    <div className="flex items-center justify-center">
      {/* Renderiza o componente de estatísticas/top Pokémon */}
      <CardsStats/>
    </div>
  );
}
