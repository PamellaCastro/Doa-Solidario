import { NavLink } from "react-router-dom"
import { Home, Monitor, ShoppingBag, Sofa, Shirt, Heart, Settings, LogOut } from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
}

function Sidebar({ isOpen, onClose, onLogout }: SidebarProps) {
  return (
    <>
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-content">
          <nav className="sidebar-nav">
            <ul>
              <li>
                <NavLink to="/dashboard" className="sidebar-link" onClick={onClose}>
                  <Home size={20} />
                  <span>Dashboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/categorias/eletronicos" className="sidebar-link" onClick={onClose}>
                  <Monitor size={20} />
                  <span>Eletrônicos</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/categorias/eletrodomesticos" className="sidebar-link" onClick={onClose}>
                  <ShoppingBag size={20} />
                  <span>Eletrodomésticos</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/categorias/moveis" className="sidebar-link" onClick={onClose}>
                  <Sofa size={20} />
                  <span>Móveis</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/categorias/textil" className="sidebar-link" onClick={onClose}>
                  <Shirt size={20} />
                  <span>Têxteis</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/social" className="sidebar-link" onClick={onClose}>
                  <Heart size={20} />
                  <span>Social</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/configuracoes" className="sidebar-link" onClick={onClose}>
                  <Settings size={20} />
                  <span>Configurações</span>
                </NavLink>
              </li>
            </ul>
          </nav>
          <div className="sidebar-footer">
            <button className="sidebar-link text-danger" onClick={onLogout}>
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>
      {isOpen && <div className="sidebar-overlay active" onClick={onClose}></div>}
    </>
  )
}

export default Sidebar
