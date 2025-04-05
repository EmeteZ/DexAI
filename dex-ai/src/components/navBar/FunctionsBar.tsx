
const menuItems = [
  {
    label: "Pokedex",
  },
  {
    label: "Batalha IA",
  },
  {
    label: "Top Pokémon",
  },
  {
    label: "Filtros Avançados",
  },
  {
    label: "Quem é Esse?",
  }
];


export default function FunctionsBar() {
    return (
      <div className="h-14 bg-neutral flex items-center px-4 gap-8">
        <img src="/assets/logos/LogoDexAI.svg" alt="Logo" className="w-32 h-32 cursor-pointer hover:scale-108 transition-transform" />

        {menuItems.map((item, index) => (
        <a
          key={item.label}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-sm font-medium text-textb cursor-pointer">{item.label}</span>
        </a>
      ))}
      </div>
    );
  }
  