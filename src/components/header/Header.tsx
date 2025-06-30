import React, { useEffect, useState } from "react";
import { Bell, LogOut } from "lucide-react";
import Logo from "../../assets/mao.png";
import { ItemService } from "../../services/ItemService";
import type { Item } from "../../types/Item";

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const userName = "Admin";
  const [menuOpen, setMenuOpen] = useState(false);
  const [itensAbertos, setItensAbertos] = useState(0);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const carregarItensAbertos = async () => {
      try {
        const itens: Item[] = await ItemService.listarTodos();
        const quantidadeAbertos = itens.reduce(
          (acc, item) => acc + (item.situacao === "ABERTO" ? item.quantidade : 0),
          0
        );
        setItensAbertos(quantidadeAbertos);
      } catch (error) {
        console.error("Erro ao buscar itens em aberto:", error);
        setItensAbertos(0);
      }
    };

    carregarItensAbertos();

    const intervalId = setInterval(carregarItensAbertos, 1000);


    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="header">
      <div className="header-logo">
        <img src={Logo} alt="Bairro da Juventude" />
        <h1>Bairro da Juventude</h1>
      </div>

      <div className="header-actions" style={{ position: "relative" }}>
        <div className="notification-icon">
          <Bell size={24} />
          <span className="notification-badge">
            {itensAbertos}
          </span>
        </div>

        <button
          onClick={toggleMenu}
          className="header-user"
          style={{
            display: "flex",
            alignItems: "center",
            border: "none",
            background: "none",
            cursor: "pointer",
            marginLeft: "16px",
          }}
        >
          <span className="user-avatar">
            {userName.charAt(0).toUpperCase()}
          </span>




          <span>{userName}</span>
        </button>


        {menuOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: "8px",
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderRadius: "6px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              zIndex: 100,
              minWidth: "140px",
            }}
          >
            <button
              onClick={onLogout}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "8px 12px",
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              <LogOut size={18} className="me-2" />
              <span>Sair</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
