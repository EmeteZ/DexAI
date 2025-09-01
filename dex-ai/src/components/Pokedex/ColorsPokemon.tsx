// Cores de texto por tipo
export const typeColors: Record<string, string> = {
  fire: "text-orange-500", 
  water: "text-blue-500", 
  grass: "text-green-500",
  electric: "text-yellow-500", 
  bug: "text-lime-600", 
  normal: "text-gray-500",
  poison: "text-purple-500", 
  ground: "text-yellow-700", 
  fairy: "text-pink-400",
  fighting: "text-red-600", 
  psychic: "text-pink-600", 
  rock: "text-yellow-800",
  ghost: "text-indigo-500", 
  ice: "text-cyan-400", 
  dragon: "text-indigo-700",
  dark: "text-gray-800", 
  steel: "text-gray-400", 
  flying: "text-sky-500",
};

// Gradientes de fundo por tipo
export const typeBackgrounds: Record<string, string> = {
  fire: "bg-gradient-to-br from-orange-200 to-red-300", 
  water: "bg-gradient-to-br from-blue-200 to-cyan-300", 
  grass: "bg-gradient-to-br from-green-200 to-emerald-300",
  electric: "bg-gradient-to-br from-yellow-200 to-amber-300", 
  bug: "bg-gradient-to-br from-lime-200 to-green-300", 
  normal: "bg-gradient-to-br from-gray-200 to-neutral-300",
  poison: "bg-gradient-to-br from-purple-200 to-violet-300", 
  ground: "bg-gradient-to-br from-yellow-300 to-orange-400", 
  fairy: "bg-gradient-to-br from-pink-200 to-rose-300",
  fighting: "bg-gradient-to-br from-red-300 to-rose-400", 
  psychic: "bg-gradient-to-br from-pink-200 to-purple-300", 
  rock: "bg-gradient-to-br from-yellow-400 to-amber-500",
  ghost: "bg-gradient-to-br from-indigo-200 to-purple-300", 
  ice: "bg-gradient-to-br from-cyan-200 to-blue-300", 
  dragon: "bg-gradient-to-br from-indigo-300 to-purple-400",
  dark: "bg-gradient-to-br from-gray-400 to-slate-500", 
  steel: "bg-gradient-to-br from-gray-300 to-zinc-400", 
  flying: "bg-gradient-to-br from-sky-200 to-blue-300",
};

// Lista de tipos
export const typeList = [
  "all", "fire", "water", "grass", "electric", "bug", "normal", "poison",
  "ground", "fairy", "fighting", "psychic", "rock", "ghost", "ice", "dragon",
  "dark", "steel", "flying"
];
