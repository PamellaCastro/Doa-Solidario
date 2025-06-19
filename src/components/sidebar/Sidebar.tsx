import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Settings, Users, Monitor, ShoppingBag, Sofa, Shirt, LogOut } from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Home size={20} />
              <span>Grafico</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/categorias/eletronicos" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Monitor size={20} />
              <span>Eletrônico</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/categorias/eletrodomesticos" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <ShoppingBag size={20} />
              <span>Eletrodoméstico</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/categorias/moveis" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Sofa size={20} />
              <span>Móvel</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/categorias/texteis" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Shirt size={20} />
              <span>Têxtil</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/social" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Users size={20} />
              <span>Social</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/configuracoes" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Settings size={20} />
              <span>Configurações</span>
            </NavLink>
          </li>
          <li className="mt-auto">
            <button onClick={onLogout} className="sidebar-link" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}>
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;