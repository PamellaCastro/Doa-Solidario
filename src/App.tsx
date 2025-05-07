import { Routes, Route } from "react-router-dom"
import Login from "./pages/login/Login"
import Dashboard from "./pages/dashboard/Dashboard"
import Sidebar from "./components/sidebar/Sidebar"
import Header from "./components/header/Header"
import Eletronicos from "./pages/categorias/eletronicos/Eletronicos"
import Eletrodomesticos from "./pages/categorias/eletrodomesticos/Eletrodomesticos"
import Moveis from "./pages/categorias/moveis/Moveis"
import Textil from "./pages/categorias/texteis/Texteis"
import Social from "./pages/social/Social"
import Configuracoes from "./pages/configuracoes/configuracoes"
import QueroDoar from "./pages/queroDoar/QueroDoar"
import EditarEletronico from "./pages/categorias/eletronicos/EditarEletronicos"
import DetalhesEletronico from "./pages/categorias/eletronicos/DetalhesEletronicos"
import CadastroEletrodomestico from "./pages/categorias/eletrodomesticos/CadastroEletrodomesticos"
import EditarEletrodomestico from "./pages/categorias/eletrodomesticos/EditarEletrodomesticos"
import DetalhesEletrodomestico from "./pages/categorias/eletrodomesticos/DetalhesEletrodomesticos"
import CadastroEletronico from "./pages/categorias/eletronicos/CadastroEletronicos"
import CadastroMovel from "./pages/categorias/moveis/CadastroMoveis"
import EditarMovel from "./pages/categorias/moveis/EditarMoveis"
import DetalhesMovel from "./pages/categorias/moveis/DetalhesMoveis"
import CadastroTextil from "./pages/categorias/texteis/CadastroTexteis"
import EditarTextil from "./pages/categorias/texteis/EditarTexteis"
import DetalhesTextil from "./pages/categorias/texteis/DetalhesTexteis"
import { useState, useEffect } from "react"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular verificação de autenticação
    const checkAuth = () => {
      const token = localStorage.getItem("authToken")
      if (token) {
        setIsLoggedIn(true)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  // Verificar se o usuário está na página de login ou quero doar
  const isPublicPage =
    window.location.pathname === "/login" ||
    window.location.pathname === "/quero-doar" ||
    window.location.pathname === "/"

  // Função para fazer login
  const handleLogin = () => {
    setIsLoggedIn(true)
    localStorage.setItem("authToken", "dummy-token")
  }

  // Função para fazer logout
  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem("authToken")
    window.location.href = "/login"
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-background-beige">Carregando...</div>
  }

  return (
    <>
      {!isPublicPage && isLoggedIn && (
        <>
          <Header />
          <Sidebar />
        </>
      )}
      <main className={!isPublicPage && isLoggedIn ? "main-content" : ""}>
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/quero-doar" element={<QueroDoar />} />

          {/* Rotas protegidas */}
          {isLoggedIn ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/categorias/eletronicos" element={<Eletronicos />} />
              <Route path="/categorias/eletronicos/novo" element={<CadastroEletronico />} />
              <Route path="/categorias/eletronicos/editar/:id" element={<EditarEletronico />} />
              <Route path="/categorias/eletronicos/detalhes/:id" element={<DetalhesEletronico />} />

              <Route path="/categorias/eletrodomesticos" element={<Eletrodomesticos />} />
              <Route path="/categorias/eletrodomesticos/novo" element={<CadastroEletrodomestico />} />
              <Route path="/categorias/eletrodomesticos/editar/:id" element={<EditarEletrodomestico />} />
              <Route path="/categorias/eletrodomesticos/detalhes/:id" element={<DetalhesEletrodomestico />} />

              <Route path="/categorias/moveis" element={<Moveis />} />
              <Route path="/categorias/moveis/novo" element={<CadastroMovel />} />
              <Route path="/categorias/moveis/editar/:id" element={<EditarMovel />} />
              <Route path="/categorias/moveis/detalhes/:id" element={<DetalhesMovel />} />

              <Route path="/categorias/textil" element={<Textil />} />
              <Route path="/categorias/textil/novo" element={<CadastroTextil />} />
              <Route path="/categorias/textil/editar/:id" element={<EditarTextil />} />
              <Route path="/categorias/textil/detalhes/:id" element={<DetalhesTextil />} />

              <Route path="/social" element={<Social />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
            </>
          ) : (
            <Route path="*" element={<Login onLogin={handleLogin} />} />
          )}
        </Routes>
      </main>
    </>
  )
}

export default App
