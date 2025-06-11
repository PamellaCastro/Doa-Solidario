import type React from "react";
import { useState } from "react";
import { User, PlusCircle, Users } from "lucide-react"; 

import GerenciamentoPessoa from "../../components/pessoa/GerenciamentoPessoa";
import GerenciamentoCategoria from "../../components/categoria/GerenciamentoCategoria";
import GerenciamentoUsuario from "../../components/usuario/GerenciamentoUsuario";

// Definir as chaves para as seções na navegação
type SectionKey = "pessoas" | "usuarios" | "categorias"; 

function Configuracoes() {
  const [activeSection, setActiveSection] = useState<SectionKey>("pessoas");  "pessoas"

  const renderSection = () => {
    switch (activeSection) {
      case "pessoas":
        return <GerenciamentoPessoa />; 
      case "usuarios":
        return <GerenciamentoUsuario />; 
      case "categorias":
        return <GerenciamentoCategoria />; 
      default:
        return <GerenciamentoPessoa />; 
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 bg-gray-50 min-h-[calc(100vh-theme(spacing.16))]">
      {/* Navegação Lateral (Menu de Seções) */}
      <nav className="md:w-64 bg-white rounded-lg shadow-md p-4 h-fit sticky top-4">
        <h2 className="text-xl font-bold text-primary mb-6 border-b pb-4">Opções de Configuração</h2>
        <ul>
          <li>
            <button
              className={`flex items-center w-full px-4 py-3 rounded-md text-left transition-colors duration-200 ${
                activeSection === "pessoas" ? "bg-primary text-white shadow-sm" : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveSection("pessoas")}
            >
              <User size={20} className="mr-3" />
              Gerenciar Pessoas
            </button>
          </li>
          <li>
            <button
              className={`flex items-center w-full px-4 py-3 rounded-md text-left transition-colors duration-200 ${
                activeSection === "usuarios" ? "bg-primary text-white shadow-sm" : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveSection("usuarios")}
            >
              <Users size={20} className="mr-3" />
              Gerenciar Usuários
            </button>
          </li>
          <li className="mt-2">
            <button
              className={`flex items-center w-full px-4 py-3 rounded-md text-left transition-colors duration-200 ${
                activeSection === "categorias" ? "bg-primary text-white shadow-sm" : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveSection("categorias")}
            >
              <PlusCircle size={20} className="mr-3" />
              Categorias e Subcategorias
            </button>
          </li>
        </ul>
      </nav>

      {/* Área de Conteúdo Principal */}
      <main className="flex-1">
        {renderSection()}
      </main>
    </div>
  );
}

export default Configuracoes;