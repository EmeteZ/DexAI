import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { TbInfoSquareRoundedFilled } from "react-icons/tb";

const links = [
  {
    icon: <FaGithub className="text-white w-4 h-4" />,
    label: "GitHub",
    href: "https://github.com/EmeteZ/DexAI"
  },
  {
    icon: <FaLinkedin className="text-white w-4 h-4" />,
    label: "Linkedin",
    href: "https://www.linkedin.com/in/matheus-macedo-697591207/"
  },
  {
    icon: <TbInfoSquareRoundedFilled className="text-white w-4 h-4" />,
    label: "Sobre o Projeto",
    href: "https://seu-site.com/sobre"
  }
];

export default function InfosTopBar() {
  return (
    <div className="px-6 flex items-center gap-8 bg-blue2 h-8 justify-end">
      {links.map((item, index) => (
        <a
          key={index}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          {item.icon}
          <span className="text-sm font-medium text-white">{item.label}</span>
        </a>
      ))}
    </div>
  );
}
