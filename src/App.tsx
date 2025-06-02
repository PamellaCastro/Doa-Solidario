import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Sidebar from "./components/sidebar/Sidebar";
import Header from "./components/header/Header";
import Eletronicos from "./pages/categorias/eletronicos/Eletronicos";
import Eletrodomesticos from "./pages/categorias/eletrodomesticos/Eletrodomesticos";
import Moveis from "./pages/categorias/moveis/Moveis";
import Textil from "./pages/categorias/texteis/Texteis";
import Social from "./pages/social/Social";
import Configuracoes from "./pages/configuracoes/configuracoes";
import QueroDoar from "./pages/queroDoar/QueroDoar";
import EditarEletronico from "./pages/categorias/eletronicos/EditarEletronicos";
import DetalhesEletronico from "./pages/categorias/eletronicos/DetalhesEletronicos";
import CadastroEletrodomestico from "./pages/categorias/eletrodomesticos/CadastroEletrodomesticos";
import EditarEletrodomestico from "./pages/categorias/eletrodomesticos/EditarEletrodomesticos";
import DetalhesEletrodomestico from "./pages/categorias/eletrodomesticos/DetalhesEletrodomesticos";
import CadastroEletronico from "./pages/categorias/eletronicos/CadastroEletronicos";
import CadastroMovel from "./pages/categorias/moveis/CadastroMoveis";
import EditarMovel from "./pages/categorias/moveis/EditarMoveis";
import DetalhesMovel from "./pages/categorias/moveis/DetalhesMoveis";
import CadastroTextil from "./pages/categorias/texteis/CadastroTexteis";
import EditarTextil from "./pages/categorias/texteis/EditarTexteis";
import DetalhesTextil from "./pages/categorias/texteis/DetalhesTexteis";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  // Define os caminhos públicos – páginas que não exigem autenticação.
  const publicPaths = ["/login", "/quero-doar", "/"];
  const isPublicPage = publicPaths.includes(location.pathname);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("authToken", "dummy-token");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p>Carregando o sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {(!isPublicPage && isLoggedIn) && (
        <Header toggleSidebar={toggleSidebar} onLogout={handleLogout} />
      )}

      <div className="content-wrapper">
        {(!isPublicPage && isLoggedIn) && (
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} onLogout={handleLogout} />
        )}
        <main className={(!isPublicPage && isLoggedIn) ? "main-content" : ""}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
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
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;