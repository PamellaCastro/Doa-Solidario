import type React from "react"
import { useState } from "react"
import { Settings, Database, User, Users, PlusCircle, Home } from "lucide-react"
import StatusSistema from "../../components/gerenciamento/StatusSistema"
import GerenciamentoPessoa from "../../components/gerenciamento/GerenciamentoPessoa"
import GerenciamentoCategoria from "../../components/gerenciamento/GerenciamentoCategoria"
import GerenciamentoUsuario from "../../components/gerenciamento/GerenciamentoUsuario"

type SectionKey = "status" | "pessoas" | "usuarios" | "categorias"

const ConfiguracoesSistema: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionKey>("status")

  const sections = [
    {
      id: "status" as SectionKey,
      label: "Status do Sistema",
      icon: Database,
      description: "Monitoramento e saúde dos serviços",
      color: "primary",
    },
    {
      id: "pessoas" as SectionKey,
      label: "Gerenciar Pessoas",
      icon: User,
      description: "Cadastro e gestão de pessoas",
      color: "success",
    },
    {
      id: "usuarios" as SectionKey,
      label: "Gerenciar Usuários",
      icon: Users,
      description: "Controle de usuários do sistema",
      color: "info",
    },
    {
      id: "categorias" as SectionKey,
      label: "Categorias",
      icon: PlusCircle,
      description: "Gestão de categorias e subcategorias",
      color: "warning",
    },
  ]

  const getCurrentSection = () => {
    return sections.find((section) => section.id === activeSection)
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case "status":
        return (
          <div>
            <StatusSistema />
          </div>
        )
      case "pessoas":
        return <GerenciamentoPessoa />
      case "usuarios":
        return <GerenciamentoUsuario />
      case "categorias":
        return <GerenciamentoCategoria />
      default:
        return <StatusSistema />
    }
  }

  const currentSection = getCurrentSection()

  return (
    <div className="container-fluid p-4">
      {/* Header Principal */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 text-primary mb-1">
                <Settings size={32} className="me-3" />
                Configurações do Sistema
              </h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Home size={14} className="me-1" />
                    Gráficos
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Configurações
                  </li>
                  {currentSection && (
                    <li className="breadcrumb-item active" aria-current="page">
                      {currentSection.label}
                    </li>
                  )}
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Sidebar de Navegação */}
        <div className="col-lg-3 col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="card-title mb-0 text-secondary">
                <Settings size={18} className="me-2" />
                Seções
              </h5>
            </div>
            <div className="list-group list-group-flush">
              {sections.map((section) => {
                const Icon = section.icon
                const isActive = activeSection === section.id
                return (
                  <button
                    key={section.id}
                    className={`list-group-item list-group-item-action border-0 ${
                      isActive ? `bg-${section.color} text-white` : "text-dark"
                    }`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <div className="d-flex align-items-center">
                      <Icon size={18} className="me-3" />
                      <div className="text-start">
                        <div className="fw-bold">{section.label}</div>
                        <small className={isActive ? "text-white-50" : "text-muted"}>{section.description}</small>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Área de Conteúdo */}
        <div className="col-lg-9 col-md-8">
          <div className="card shadow-sm">
            <div className="card-header">
              <div className="d-flex align-items-center">
                {currentSection && (
                  <>
                    <div className={`badge bg-${currentSection.color} me-3 p-2`}>
                      <currentSection.icon size={20} />
                    </div>
                    <div>
                      <h5 className="card-title mb-0">{currentSection.label}</h5>
                      <small className="text-muted">{currentSection.description}</small>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="card-body">{renderSectionContent()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfiguracoesSistema
