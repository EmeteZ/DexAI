import CardsPokemon from "@/components/Pokedex/CardsPokemon"; // Importa o componente que exibe os cards da Pokédex

export default function Pokedex() {
  return (
    <div className="flex items-center justify-center">
      {/* Renderiza os cards de Pokémon */}
      <CardsPokemon/>
    </div>
  );
}
