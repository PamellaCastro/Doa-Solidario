
import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { LogIn } from "lucide-react"
import logo from "../../assets/transferir (1).png"

interface LoginProps {
  onLogin: () => void
}

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulando uma chamada de API com um pequeno atraso
    setTimeout(() => {
      // Implementar autenticação
      if (email && password) {
        onLogin()
        navigate("/dashboard")
      } else {
        setError("Por favor, preencha todos os campos.")
      }
      setIsLoading(false)
    }, 800)
  }

  const handleQueroDoar = () => {
    navigate("/quero-doar")
  }

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="login-logo">
          <img src={logo || "/placeholder.svg"} alt="Bairro da Juventude" />
          <h1>BAIRRO DA JUVENTUDE</h1>
        </div>
        <button className="btn btn-accent" onClick={handleQueroDoar}>
          Doar
        </button>
      </div>

      <div className="login-content">
        <div className="login-box">
          <div className="login-image">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-06%20at%2020.02.20-jEaoKvNDgTUrm5i9fKTYuPZTruWpF4.jpeg"
              alt="Bairro da Juventude"
            />
          </div>
          <div className="login-form-container">
            <h2 className="login-form-title">Acesso ao Sistema</h2>

            {error && <div className="p-3 mb-4 bg-danger bg-opacity-10 text-danger rounded">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label form-label-required">E-mail</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label form-label-required">Senha</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    <span>Entrar</span>
                  </>
                )}
              </button>
            </form>
            <div className="login-footer">
              <p>
                Esqueceu sua senha?{" "}
                <a href="#" className="login-link">
                  Recuperar acesso
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
