import { NavLink } from "react-router-dom"

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
      {imageUrl && <img src={imageUrl} alt="Descrição da imagem" />}
      </div>
      <nav>
        <ul>
          <li>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/categorias/eletronicos">Eletrônicos</NavLink>
          </li>
          <li>
            <NavLink to="/categorias/eletrodomesticos">
              Eletrodomésticos
            </NavLink>
          </li>
          <li>
            <NavLink to="/categorias/moveis">Móveis</NavLink>
          </li>
          <li>
            <NavLink to="/categorias/textil">Têxteis</NavLink>
          </li>
          <li>
            <NavLink to="/social">Social</NavLink>
          </li>
          <li>
            <NavLink to="/configuracoes">Configurações</NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
