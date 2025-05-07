import { Bell, User } from "lucide-react"
import logo from "../../assets/transferir (1).png"

function Header() {
  return (
    <header className="header">
      <div className="header-logo">
        <img src={logo || "/placeholder.svg"} alt="Bairro da Juventude" />
        <h1>Bairro da Juventude</h1>
      </div>
      <div className="header-actions">
        <div className="notification-icon">
          <Bell size={20} color="white" />
          <span className="notification-badge">3</span>
        </div>
        <div className="header-user">
          <div className="user-avatar">
            <User size={18} />
          </div>
          <span className="text-white">Admin</span>
        </div>
      </div>
    </header>
  )
}

export default Header
