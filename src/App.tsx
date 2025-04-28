import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
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

function App() {
  return (

    <>
      <div>
        <Sidebar />
        <Header />
      </div>
      <main
        style={{ marginLeft: "240px", marginTop: "80px", padding: "20px" }}
      ></main>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categorias/eletronicos" element={<Eletronicos />} />
        <Route
          path="/categorias/eletrodomesticos"
          element={<Eletrodomesticos />}
        />
        <Route path="/categorias/moveis" element={<Moveis />} />
        <Route path="/categorias/textil" element={<Textil />} />
        <Route path="/social" element={<Social />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/quero-doar" element={<QueroDoar />} />
        <Route
          path="/categorias/eletronicos/editar/:id"
          element={<EditarEletronico />}
        />
        <Route
          path="/categorias/eletronicos/detalhes/:id"
          element={<DetalhesEletronico />}
        />

        <Route
          path="/categorias/eletrodomesticos"
          element={<Eletrodomesticos />}
        />
        <Route
          path="/categorias/eletrodomesticos/novo"
          element={<CadastroEletrodomestico />}
        />
        <Route
          path="/categorias/eletrodomesticos/editar/:id"
          element={<EditarEletrodomestico />}
        />
        <Route
          path="/categorias/eletrodomesticos/detalhes/:id"
          element={<DetalhesEletrodomestico />}
        />

        <Route path="/" element={<h1>Funcionando!</h1>} />
      </Routes>
    </>
  );
}

export default App;
