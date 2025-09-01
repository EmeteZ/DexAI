// Importa os componentes que compõem a Navbar
import InfosTopBar from './InfosTopBar' // Barra superior com informações
import FunctionsBar from './FunctionsBar' // Barra com links de navegação

// Componente principal da Navbar
export default function NavBar() {
    return (
      <div className="">
        {/* Renderiza a barra de informações no topo */}
        <InfosTopBar/>
        {/* Renderiza a barra de funções/menu */}
        <FunctionsBar/>
      </div>
    );
}
