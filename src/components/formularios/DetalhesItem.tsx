import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  User,
  MapPin,
  Package,
  Calendar,
  DollarSign,
  Truck,
} from "lucide-react";
import { ItemService } from "../../services/ItemService";
import type { Item } from "../../types/Item";

interface DetalhesItemProps {
  categoria: string;
  titulo: string;
}

const DetalhesItem: React.FC<DetalhesItemProps> = ({ categoria, titulo }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      carregarItem(Number(id));
    }
  }, [id]);

  const carregarItem = async (itemId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await ItemService.buscarPorId(itemId);
      setItem(data);
    } catch (err) {
      setError("Erro ao carregar detalhes do item");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getSituacaoBadgeClass = (situacao: string): string => {
    const classes: Record<string, string> = {
      ABERTO: "bg-primary",
      EM_ANDAMENTO: "bg-warning",
      DEPOSITADO: "bg-info",
      VENDIDO: "bg-success",
      SOLICITADO: "bg-secondary",
      DOADO: "bg-success",
    };
    return classes[situacao] || "bg-secondary";
  };

  const getEstadoConservacaoClass = (estado: string): string => {
    const classes: Record<string, string> = {
      BOM: "text-success",
      REGULAR: "text-warning",
      RUIM: "text-danger",
    };
    return classes[estado] || "text-secondary";
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando detalhes...</span>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container p-4">
        <div className="alert alert-danger text-center" role="alert">
          <h4>Erro ao carregar detalhes</h4>
          <p>{error || "Item não encontrado"}</p>
          <button
            className="btn btn-outline-danger"
            onClick={() => navigate(`/categorias/${categoria}`)}
          >
            Voltar para Lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(`/categorias/${categoria}`)}
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="h2 text-primary mb-0">Detalhes do {titulo}</h1>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => navigate(`/categorias/${categoria}/editar/${item.id}`)}
        >
          <Edit size={18} />
          Editar
        </button>
      </div>

      <div className="row">
        {/* Informações do Item */}
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <Package size={20} className="me-2" />
                Informações do Item
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-bold">Descrição</label>
                  <p className="form-control-plaintext">{item.descricao}</p>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">Categoria</label>
                  <p className="form-control-plaintext">
                    <span className="badge bg-primary">
                      {item.categoria.replace("_", " ")}
                    </span>
                  </p>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">Subcategoria</label>
                  <p className="form-control-plaintext">
                    {item.subCategoria
                      ? item.subCategoria.descricao
                      : "Não informado"}
                  </p>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-bold">Quantidade</label>
                  <p className="form-control-plaintext">
                    <span className="badge bg-light text-dark fs-6">
                      {item.quantidade}
                    </span>
                  </p>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-bold">Valor</label>
                  <p className="form-control-plaintext text-success fw-bold">
                    {formatCurrency(item.valor || 0)}
                  </p>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-bold">
                    Necessita Caminhão
                  </label>
                  <p className="form-control-plaintext">
                    {item.caminhao ? (
                      <span className="badge bg-warning text-dark">
                        <Truck size={14} className="me-1" />
                        Sim
                      </span>
                    ) : (
                      <span className="badge bg-light text-dark">Não</span>
                    )}
                  </p>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">
                    Estado de Conservação
                  </label>
                  <p
                    className={`form-control-plaintext fw-bold ${getEstadoConservacaoClass(
                      item.estadoConservacao
                    )}`}
                  >
                    {item.estadoConservacao}
                  </p>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">Situação</label>
                  <p className="form-control-plaintext">
                    <span
                      className={`badge ${getSituacaoBadgeClass(
                        item.situacao
                      )} text-white`}
                    >
                      {item.situacao.replace("_", " ")}
                    </span>
                  </p>
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold">Data de Cadastro</label>
                  <p className="form-control-plaintext">
                    <Calendar size={16} className="me-2" />
                    {formatDate(item.data_cadastro)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informações da Pessoa */}
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <User size={20} className="me-2" />
                Dados da Pessoa
              </h5>
            </div>
            <div className="card-body">
              {item.pessoadoador ? (
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-bold">Nome</label>
                    <p className="form-control-plaintext">{item.pessoadoador.nome}</p>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-bold">CPF</label>
                    <p className="form-control-plaintext">{item.pessoadoador.cpf}</p>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-bold">E-mail</label>
                    <p className="form-control-plaintext">
                      <a
                        href={`mailto:${item.pessoadoador.email}`}
                        className="text-decoration-none"
                      >
                        {item.pessoadoador.email}
                      </a>
                    </p>
                  </div>

                  {item.pessoadoador.endereco && (
                    <>
                      <div className="col-12 mt-3">
                        <h6 className="text-secondary">
                          <MapPin size={16} className="me-2" />
                          Endereço
                        </h6>
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-bold">Cidade</label>
                        <p className="form-control-plaintext">
                          {item.pessoadoador.endereco.cidade}
                        </p>
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-bold">Estado</label>
                        <p className="form-control-plaintext">
                          {item.pessoadoador.endereco.estado}
                        </p>
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-bold">Rua</label>
                        <p className="form-control-plaintext">
                          {item.pessoadoador.endereco.rua}
                          {item.pessoadoador.endereco.numero &&
                            `, ${item.pessoadoador.endereco.numero}`}
                        </p>
                      </div>

                      {item.pessoadoador.endereco.cep && (
                        <div className="col-12">
                          <label className="form-label fw-bold">CEP</label>
                          <p className="form-control-plaintext">
                            {item.pessoadoador.endereco.cep}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <User size={48} className="opacity-50 mb-3" />
                  <p>Nenhuma pessoa associada a este item</p>
                </div>
              )}
            </div>
          </div>

          {/* Resumo Financeiro */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <DollarSign size={20} className="me-2" />
                Resumo Financeiro
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12">
                  <div className="d-flex justify-content-between">
                    <span>Valor Unitário:</span>
                    <strong>
                      {formatCurrency((item.valor || 0) / item.quantidade)}
                    </strong>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex justify-content-between">
                    <span>Quantidade:</span>
                    <strong>{item.quantidade}</strong>
                  </div>
                </div>
                <hr />
                <div className="col-12">
                  <div className="d-flex justify-content-between text-success">
                    <span className="fw-bold">Valor Total:</span>
                    <strong className="fs-5">
                      {formatCurrency(item.valor || 0)}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalhesItem;
