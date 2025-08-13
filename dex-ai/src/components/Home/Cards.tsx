import BattlePokemon from "../../../public/assets/Images/battlePokemon.jpg";
import ComparePokemons from "../../../public/assets/Images/ComparePokemons.jpeg";
import WhoPokemon from "../../../public/assets/Images/whoPokemon.jpg";
import SearchPokemon from "../../../public/assets/Images/searchPokemon.jpg";
import Image from "next/image";


const Card = [
  {
    image: BattlePokemon,
    label1: "Simule batalhas com IA",
    label2: "Com a nossa IA você é capaz de simular batalhas entre nossos Pokémons!",
  },
  {
    image: ComparePokemons,
    label1: "Compare status, tipos e gerações",
    label2: "Descubra vantagens, desvantagens e evolua sua estratégia!",
  },
  {
    image: WhoPokemon,
    label1: "Teste seu conhecimento",
    label2: "Jogue o clássico (Quem é esse Pokémon?)",
  },
  {
    image: SearchPokemon,
    label1: "Busque por centenas de Pokémons",
    label2: "Explore nossa gigante database com diversos Pokémons",
  },
];

export default function Cards() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <div className="flex flex-col items-center">
        <p className="text-4xl font-lexend font-semibold text-center">
          Explore o mundo Pokémon como nunca antes!
        </p>
        <p className="text-2xl text-textb font-lexend text-center">
          Veja stats, simule com IA, descubra o pokemon e muito mais.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-5 mt-5 bg-neutral rounded-2xl p-6">
        {Card.map((card) => (
          <div
            key={card.label1}
            className="flex flex-col items-center justify-between w-69 h-80 bg-white rounded-2xl shadow p-4 transition-transform duration-200 hover:scale-105 hover:animate-pop-out cursor-pointer"
          >
            <Image
              src={card.image}
              alt={card.label1}
              className="rounded-xl mb-2 object-cover"
              width={240}
              height={140}
              style={{ objectFit: "cover" }}
            />
            <div className="flex flex-col text-left flex-1 w-full">
              <p className="text-xl font-semibold font-lexend mb-2">{card.label1}</p>
              <p className="text-sm font-semibold text-textb font-lexend break-words whitespace-normal">
                {card.label2}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
