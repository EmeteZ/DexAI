import BattlePokemon from "../../../public/assets/Images/battlePokemon.jpg";
import Image from "next/image";

const Card = [
  {
    image: BattlePokemon,
    label1: "Simule batalhas com IA",
    label2: "Com a nossa IA você é capaz de simular batalhas entre nossos Pokémons!",
  },
];

export default function Cards() {
  return (
    <div className="flex items-center justify-center flex-col h-full gap-5 mt-5">
      <div className="flex flex-col justify-center items-center">
      <p className="text-4xl font-lexend font-semibold">
        Explore o mundo Pokémon como nunca antes!
      </p>
      <p className="text-2xl text-textb font-lexend">
        Veja stats, jogue com IA, filtre por tipo e muito mais.
      </p>
      </div>
      <div className="flex  mt-5 bg-neutral h-70 w-fit rounded-2xl items-start justify-center">
        {Card.map((Card) => (
          <div key={Card.label1} className="flex flex-col items-center ">
            <Image
              src={Card.image}
              alt="Battle Pokémon"
              className="rounded-2xl p-3"
              width={270}
              height={230}
            /><div className=" flex flex-col text-left">
            <p className="text-xl font-semibold font-lexend">{Card.label1}</p>
            
            <p className="text-sm font-semibold text-textb font-lexend break-words whitespace-normal w-60">{Card.label2}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
