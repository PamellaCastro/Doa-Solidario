import React from 'react';
import { Bell, User } from 'lucide-react';
import Logo from "../../assets/mao.png"

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const userName = "Admin";

  return (
    <header className="header">
      <div className="header-logo">
 <img src={Logo} alt="Bairro da Juventude" />       
  <h1>Bairro da Juventude</h1>
      </div>

      <div className="header-actions">
        <div className="notification-icon">
          <Bell size={24} />
          <span className="notification-badge">3</span>
        </div>
        <div className="header-user">
          <span className="user-avatar">{userName.charAt(0).toUpperCase()}</span>
          <span>{userName}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;