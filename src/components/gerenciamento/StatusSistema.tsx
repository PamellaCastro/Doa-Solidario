import type React from "react";
import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Activity,
} from "lucide-react";
import { ItemService } from "../../services/ItemService";
import { PessoaService } from "../../services/PessoaService";
import { UsuarioService } from "../../services/UsuarioService";

interface StatusCheck {
  name: string;
  status: "success" | "error" | "warning" | "loading";
  message: string;
  lastCheck: Date;
}

const StatusSistema: React.FC = () => {
  const [checks, setChecks] = useState<StatusCheck[]>([
    {
      name: "API Pessoas",
      status: "loading",
      message: "Verificando...",
      lastCheck: new Date(),
    },
    {
      name: "API Itens",
      status: "loading",
      message: "Verificando...",
      lastCheck: new Date(),
    },
    {
      name: "API Usuários",
      status: "loading",
      message: "Verificando...",
      lastCheck: new Date(),
    },
  ]);
  const [isChecking, setIsChecking] = useState(false);

  const verificarStatus = async () => {
    setIsChecking(true);
    const newChecks: StatusCheck[] = [];

    // Verificar API Pessoas
    try {
      await PessoaService.listarTodos();
      newChecks.push({
        name: "API Pessoas",
        status: "success",
        message: "Funcionando corretamente",
        lastCheck: new Date(),
      });
    } catch (error) {
      newChecks.push({
        name: "API Pessoas",
        status: "error",
        message: "Erro na conexão",
        lastCheck: new Date(),
      });
    }

    // Verificar API Itens
    try {
      await ItemService.listarTodos();
      newChecks.push({
        name: "API Itens",
        status: "success",
        message: "Funcionando corretamente",
        lastCheck: new Date(),
      });
    } catch (error) {
      newChecks.push({
        name: "API Itens",
        status: "error",
        message: "Erro na conexão",
        lastCheck: new Date(),
      });
    }

    // Verificar API Usuários
    try {
      await UsuarioService.listarTodos();
      newChecks.push({
        name: "API Usuários",
        status: "success",
        message: "Funcionando corretamente",
        lastCheck: new Date(),
      });
    } catch (error) {
      newChecks.push({
        name: "API Usuários",
        status: "error",
        message: "Erro na conexão",
        lastCheck: new Date(),
      });
    }

    setChecks(newChecks);
    setIsChecking(false);
  };

  useEffect(() => {
    verificarStatus();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="text-success" size={20} />;
      case "error":
        return <XCircle className="text-danger" size={20} />;
      case "warning":
        return <AlertCircle className="text-warning" size={20} />;
      default:
        return <RefreshCw className="text-secondary" size={20} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return "bg-success";
      case "error":
        return "bg-danger";
      case "warning":
        return "bg-warning";
      default:
        return "bg-secondary";
    }
  };

  const overallStatus = checks.every((check) => check.status === "success")
    ? "success"
    : checks.some((check) => check.status === "error")
    ? "error"
    : "warning";

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">
          <Activity size={20} className="me-2" />
          Status do Sistema
        </h5>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={verificarStatus}
          disabled={isChecking}
        >
          {isChecking ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Verificando...
            </>
          ) : (
            <>
              <RefreshCw size={16} className="me-2" />
              Atualizar
            </>
          )}
        </button>
      </div>
      <div className="card-body">
        {/* Status Geral */}
        <div className="row mb-3">
          <div className="col-12">
            <div
              className={`alert alert-${
                overallStatus === "success"
                  ? "success"
                  : overallStatus === "error"
                  ? "danger"
                  : "warning"
              } d-flex align-items-center`}
            >
              {getStatusIcon(overallStatus)}
              <span className="ms-2">
                <strong>Sistema: </strong>
                {overallStatus === "success"
                  ? "Todos os serviços funcionando"
                  : overallStatus === "error"
                  ? "Alguns serviços com problemas"
                  : "Verificação em andamento"}
              </span>
            </div>
          </div>
        </div>

        {/* Detalhes dos Checks */}
        <div className="row">
          {checks.map((check, index) => (
            <div key={index} className="col-md-4 mb-3">
              <div className="card h-100">
                <div className="card-body text-center">
                  <div className="mb-2">{getStatusIcon(check.status)}</div>
                  <h6 className="card-title">{check.name}</h6>
                  <span
                    className={`badge ${getStatusBadge(
                      check.status
                    )} text-white mb-2`}
                  >
                    {check.status.toUpperCase()}
                  </span>
                  <p className="card-text small text-muted">{check.message}</p>
                  <small className="text-muted">
                    Última verificação:{" "}
                    {check.lastCheck.toLocaleTimeString("pt-BR")}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusSistema;
