import { NavLink } from "react-router-dom"
import { Home, Monitor, ShoppingBag, Sofa, Shirt, Heart, Settings, LogOut } from "lucide-react"

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <NavLink to="/dashboard" className="sidebar-link">
              <Home size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/categorias/eletronicos" className="sidebar-link">
              <Monitor size={20} />
              <span>Eletrônicos</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/categorias/eletrodomesticos" className="sidebar-link">
              <ShoppingBag size={20} />
              <span>Eletrodomésticos</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/categorias/moveis" className="sidebar-link">
              <Sofa size={20} />
              <span>Móveis</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/categorias/textil" className="sidebar-link">
              <Shirt size={20} />
              <span>Têxteis</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/social" className="sidebar-link">
              <Heart size={20} />
              <span>Social</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/configuracoes" className="sidebar-link">
              <Settings size={20} />
              <span>Configurações</span>
            </NavLink>
          </li>
          <li className="mt-auto">
            <NavLink to="/login" className="sidebar-link text-red-500">
              <LogOut size={20} />
              <span>Sair</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
