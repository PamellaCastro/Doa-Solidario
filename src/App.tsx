import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Sidebar from "./components/sidebar/Sidebar";
import Header from "./components/header/Header"; // Header global para as páginas autenticadas

// Importações dos componentes de Categoria (principal)
import Eletronicos from "./pages/categorias/eletronicos/Eletronicos";
import Eletrodomesticos from "./pages/categorias/eletrodomesticos/Eletrodomesticos";
import Moveis from "./pages/categorias/moveis/Moveis";
import Textil from "./pages/categorias/texteis/Texteis";

// Importações de outras páginas
import Social from "./pages/social/Social";
import Configuracoes from "./pages/configuracoes/Configuracoes";
import QueroDoar from "./pages/queroDoar/QueroDoar";

// Importações dos componentes específicos de Eletrônico (CRUD)
import CadastroEletronico from "./pages/categorias/eletronicos/CadastroEletronicos";
import EditarEletronico from "./pages/categorias/eletronicos/EditarEletronicos";
import DetalhesEletronico from "./pages/categorias/eletronicos/DetalhesEletronicos";

// Importações dos componentes específicos de Eletrodoméstico (CRUD)
import CadastroEletrodomestico from "./pages/categorias/eletrodomesticos/CadastroEletrodomesticos";
import EditarEletrodomestico from "./pages/categorias/eletrodomesticos/EditarEletrodomesticos";
import DetalhesEletrodomestico from "./pages/categorias/eletrodomesticos/DetalhesEletrodomesticos";

// Importações dos componentes específicos de Móvel (CRUD)
import CadastroMovel from "./pages/categorias/moveis/CadastroMoveis";
import EditarMovel from "./pages/categorias/moveis/EditarMoveis";
import DetalhesMovel from "./pages/categorias/moveis/DetalhesMoveis";

// Importações dos componentes específicos de Têxtil (CRUD)
import CadastroTextil from "./pages/categorias/texteis/CadastroTexteis";
import EditarTextil from "./pages/categorias/texteis/EditarTexteis";
import DetalhesTextil from "./pages/categorias/texteis/DetalhesTexteis";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

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

  const publicPaths = ["/login", "/quero-doar", "/"]; 
  const isPublicPage = publicPaths.includes(location.pathname);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("authToken", "dummy-token"); 
    navigate("/dashboard"); 
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("authToken"); // Remove o token
    navigate("/login"); 
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
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
    <div className="app-container"> {/* Container raiz que sempre existe */}

      {/* Header global, visível apenas se logado E NÃO for uma página pública */}
      {isLoggedIn && !isPublicPage && <Header onLogout={handleLogout} />}

      <div className="content-wrapper"> {/* Envolve Sidebar e Main Content */}

        {/* Sidebar, visível apenas se logado E NÃO for uma página pública */}
        {isLoggedIn && !isPublicPage && <Sidebar onLogout={handleLogout} />}

        {/* Aplica "main-content" se for uma página interna, "full-width-content" para login/quero-doar */}
        <main className={isLoggedIn && !isPublicPage ? "main-content" : "full-width-content"}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} /> {/* Redireciona a raiz para login */}
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/quero-doar" element={<QueroDoar />} />

            {/* Rotas Protegidas - Renderizadas apenas se o usuário estiver logado */}
            {isLoggedIn ? (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                {/* Rotas de Eletrônicos (CRUD) */}
                <Route path="/categorias/eletronicos" element={<Eletronicos />} />
                <Route path="/categorias/eletronicos/novo" element={<CadastroEletronico />} />
                <Route path="/categorias/eletronicos/editar/:id" element={<EditarEletronico />} />
                <Route path="/categorias/eletronicos/detalhes/:id" element={<DetalhesEletronico />} />

                {/* Rotas de Eletrodomésticos (CRUD) */}
                <Route path="/categorias/eletrodomesticos" element={<Eletrodomesticos />} />
                <Route path="/categorias/eletrodomesticos/novo" element={<CadastroEletrodomestico />} />
                <Route path="/categorias/eletrodomesticos/editar/:id" element={<EditarEletrodomestico />} />
                <Route path="/categorias/eletrodomesticos/detalhes/:id" element={<DetalhesEletrodomestico />} />

                {/* Rotas de Móveis (CRUD) */}
                <Route path="/categorias/moveis" element={<Moveis />} />
                <Route path="/categorias/moveis/novo" element={<CadastroMovel />} />
                <Route path="/categorias/moveis/editar/:id" element={<EditarMovel />} />
                <Route path="/categorias/moveis/detalhes/:id" element={<DetalhesMovel />} />

                {/* Rotas de Têxteis (CRUD) */}
                <Route path="/categorias/texteis" element={<Textil />} />
                <Route path="/categorias/texteis/novo" element={<CadastroTextil />} />
                <Route path="/categorias/texteis/editar/:id" element={<EditarTextil />} />
                <Route path="/categorias/texteis/detalhes/:id" element={<DetalhesTextil />} />

                {/* Outras Rotas Protegidas */}
                <Route path="/social" element={<Social />} />
                <Route path="/configuracoes" element={<Configuracoes />} />

                {/* Qualquer outra rota (logado) vai para o dashboard */}
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </>
            ) : (
              // Se não logado, qualquer rota não-pública vai para o login
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;