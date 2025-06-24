import type React from "react";
import { useState, useEffect } from "react";
import {
  Search,
  Users,
  Package,
  Heart,
  Plus,
  User,
  MapPin,
  DollarSign,
} from "lucide-react";
import { ItemService } from "../../services/ItemService";
import { BeneficiarioService } from "../../services/BeneficiarioService";
import type { Item, Situacao } from "../../types/Item";
import type { Beneficiario } from "../../types/Beneficiario";
import { Estado } from "../../types/Endereco";

const AreaSocial: React.FC = () => {
  const [itensDisponiveis, setItensDisponiveis] = useState<Item[]>([]);
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedBeneficiario, setBeneficiario] = useState<Beneficiario | null>(
    null
  );
  const [showModalDoacao, setShowModalDoacao] = useState(false);
  const [showModalBeneficiario, setShowModalBeneficiario] = useState(false);
  const [searchBeneficiario, setSearchBeneficiario] = useState("");
  const [resultadosBeneficiario, setResultadosBeneficiario] = useState<
    Beneficiario[]
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModalVenda, setShowModalVenda] = useState(false);
  const [observacoesVenda, setObservacoesVenda] = useState("");

  const [novoBeneficiario, setNovoBeneficiario] = useState<Beneficiario>({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    observacoes: "",
    endereco: {
      cidade: "",
      cep: "",
      rua: "",
      numero: 0,
      estado: Estado.SC,
    },
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      // Buscar apenas itens disponíveis para doação (não doados ainda)
      const todosItens = await ItemService.listarTodos();
      const itensDisponiveis = todosItens.filter(
        (item) => item.situacao !== "DOADO" && item.situacao !== "VENDIDO"
      );
      setItensDisponiveis(itensDisponiveis);

      const todosBeneficiarios = await BeneficiarioService.listarTodos();
      setBeneficiarios(todosBeneficiarios);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const buscarBeneficiario = async () => {
    if (!searchBeneficiario.trim()) return;

    try {
      const resultados = await BeneficiarioService.buscar(searchBeneficiario);
      setResultadosBeneficiario(resultados);
    } catch (error) {
      console.error("Erro ao buscar beneficiário:", error);
      setResultadosBeneficiario([]);
    }
  };

  const handleNovoBeneficiarioChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("endereco.")) {
      const enderecoField = name.split(".")[1];
      setNovoBeneficiario((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco!,
          [enderecoField]: enderecoField === "numero" ? Number(value) : value,
        },
      }));
    } else {
      setNovoBeneficiario((prev) => ({ ...prev, [name]: value }));
    }
  };

  const cadastrarBeneficiario = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const beneficiarioCriado = await BeneficiarioService.criar(
        novoBeneficiario
      );
      setBeneficiario(beneficiarioCriado);
      setShowModalBeneficiario(false);
      setNovoBeneficiario({
        nome: "",
        cpf: "",
        email: "",
        telefone: "",
        observacoes: "",
        endereco: {
          cidade: "",
          cep: "",
          rua: "",
          numero: 0,
          estado: Estado.SC,
        },
      });
      alert("Beneficiário cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar beneficiário:", error);
      alert("Erro ao cadastrar beneficiário");
    }
  };

  const processarDoacao = async () => {
    if (!selectedItem || !selectedBeneficiario) {
      alert("Selecione um item e um beneficiário");
      return;
    }

    setIsProcessing(true);
    try {
      // Atualizar o item para status DOADO
      const itemAtualizado: Item = {
        ...selectedItem,
        situacao: "DOADO" as Situacao,
        // Adicionar um campo para o beneficiário se necessário
        // beneficiario: selectedBeneficiario
      };

      await ItemService.atualizar(selectedItem.id!, itemAtualizado);

      alert(
        `Doação realizada com sucesso!\n\nItem: ${selectedItem.descricao}\nBeneficiário: ${selectedBeneficiario.nome}`
      );

      // Reseta seleções e recarregar dados
      setSelectedItem(null);
      setBeneficiario(null);
      setShowModalDoacao(false);
      await carregarDados();
    } catch (error) {
      console.error("Erro ao processar doação:", error);
      alert("Erro ao processar doação");
    } finally {
      setIsProcessing(false);
    }
  };

  const iniciarDoacao = (item: Item) => {
    setSelectedItem(item);
    setShowModalDoacao(true);
  };

  const iniciarVenda = (item: Item) => {
    setSelectedItem(item);
    setBeneficiario(null);
    setResultadosBeneficiario([]);
    setSearchBeneficiario("");
    setObservacoesVenda("");
    setShowModalVenda(true);
  };

  const processarVenda = async () => {
    if (!selectedItem || !selectedBeneficiario) {
      alert("Selecione um item e um beneficiário");
      return;
    }

    setIsProcessing(true);
    try {
      const itemAtualizado: Item = {
        ...selectedItem,
        situacao: "VENDIDO" as Situacao,
      };

      await ItemService.atualizar(selectedItem.id!, itemAtualizado);

      alert(
        `Venda realizada com sucesso!\n\nItem: ${selectedItem.descricao}\nBeneficiário: ${selectedBeneficiario.nome}`
      );

      // Reseta seleções e recarregar dados
      setSelectedItem(null);
      setBeneficiario(null);
      setObservacoesVenda("");
      setShowModalVenda(false);
      await carregarDados();
    } catch (error) {
      console.error("Erro ao processar venda:", error);
      alert("Erro ao processar venda");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredItens = itensDisponiveis.filter(
    (item) =>
      item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pessoa?.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 text-primary mb-0">
          <Heart size={28} className="me-2" />
          Área Social - Doações
        </h1>
        <div className="d-flex gap-2">
          <span className="badge bg-info fs-6">
            {filteredItens.length} itens disponíveis
          </span>
          <span className="badge bg-success fs-6">
            {beneficiarios.length} beneficiários cadastrados
          </span>
        </div>
      </div>

      {/* Busca */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <span className="input-group-text">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar itens por descrição, categoria ou doador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4 text-end">
          <button
            className="btn btn-success"
            onClick={() => setShowModalBeneficiario(true)}
          >
            <Plus size={16} className="me-2" />
            Novo Beneficiário
          </button>
        </div>
      </div>

      {/* Lista de Itens Disponíveis */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            <Package size={20} className="me-2" />
            Itens Disponíveis para Doação
          </h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Item</th>
                  <th>Ações</th>
                  <th>Categoria</th>
                  <th>Doador</th>
                  <th>Quantidade</th>
                  <th>Valor Est.</th>
                  <th>Estado</th>
                  <th>Data Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {filteredItens.length > 0 ? (
                  filteredItens.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div>
                          <strong>{item.descricao}</strong>
                          {item.caminhao && (
                            <span
                              className="badge bg-warning text-dark ms-2"
                              title="Necessita caminhão"
                            >
                              🚛
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => iniciarDoacao(item)}
                            title="Doar para beneficiário"
                          >
                            <Heart size={14} className="me-1" />
                            Doar
                          </button>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => iniciarVenda(item)}
                            title="Marcar como vendido"
                          >
                            <DollarSign size={14} className="me-1" />
                            Vender
                          </button>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-primary">
                          {item.categoria}
                        </span>
                      </td>
                      <td>
                        {item.pessoa ? (
                          <div>
                            <div>{item.pessoa.nome}</div>
                            <small className="text-muted">
                              {item.pessoa.email}
                            </small>
                          </div>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">
                          {item.quantidade}
                        </span>
                      </td>
                      <td>{formatCurrency(item.valor || 0)}</td>
                      <td>
                        <span
                          className={`fw-bold ${
                            item.estadoConservacao === "BOM"
                              ? "text-success"
                              : item.estadoConservacao === "REGULAR"
                              ? "text-warning"
                              : "text-danger"
                          }`}
                        >
                          {item.estadoConservacao}
                        </span>
                      </td>
                      <td>
                        {item.data_cadastro
                          ? new Date(item.data_cadastro).toLocaleDateString(
                              "pt-BR"
                            )
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      <div className="text-muted">
                        <Package size={48} className="mb-3 opacity-50" />
                        <h5>Nenhum item disponível</h5>
                        <p>Não há itens disponíveis para doação no momento.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Doação */}
      {showModalDoacao && selectedItem && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <Heart size={20} className="me-2" />
                  Processar Doação
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModalDoacao(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Informações do Item */}
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="mb-0">
                      <Package size={16} className="me-2" />
                      Item Selecionado
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-8">
                        <h5>{selectedItem.descricao}</h5>
                        <p className="text-muted mb-1">
                          <strong>Categoria:</strong> {selectedItem.categoria} |
                          <strong> Quantidade:</strong>{" "}
                          {selectedItem.quantidade} |<strong> Estado:</strong>{" "}
                          {selectedItem.estadoConservacao}
                        </p>
                        <p className="text-muted mb-0">
                          <strong>Doador:</strong>{" "}
                          {selectedItem.pessoa?.nome || "N/A"}
                        </p>
                      </div>
                      <div className="col-md-4 text-end">
                        <h4 className="text-success">
                          {formatCurrency(selectedItem.valor || 0)}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seleção de Beneficiário */}
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">
                      <Users size={16} className="me-2" />
                      Selecionar Beneficiário
                    </h6>
                  </div>
                  <div className="card-body">
                    {!selectedBeneficiario ? (
                      <div>
                        <div className="row mb-3">
                          <div className="col-md-8">
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar beneficiário por nome, CPF ou telefone"
                                value={searchBeneficiario}
                                onChange={(e) =>
                                  setSearchBeneficiario(e.target.value)
                                }
                              />
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={buscarBeneficiario}
                              >
                                <Search size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <button
                              type="button"
                              className="btn btn-success w-100"
                              onClick={() => setShowModalBeneficiario(true)}
                            >
                              <Plus size={16} className="me-2" />
                              Novo Beneficiário
                            </button>
                          </div>
                        </div>

                        {/* Resultados da busca */}
                        {resultadosBeneficiario.length > 0 && (
                          <div
                            className="border rounded p-2"
                            style={{ maxHeight: "200px", overflowY: "auto" }}
                          >
                            {resultadosBeneficiario.map((beneficiario) => (
                              <div
                                key={beneficiario.id}
                                className="d-flex justify-content-between align-items-center p-2 border-bottom cursor-pointer hover-bg-light"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setBeneficiario(beneficiario);
                                  setResultadosBeneficiario([]);
                                  setSearchBeneficiario("");
                                }}
                              >
                                <div>
                                  <strong>{beneficiario.nome}</strong>
                                  <br />
                                  <small className="text-muted">
                                    CPF: {beneficiario.cpf} | Tel:{" "}
                                    {beneficiario.telefone}
                                  </small>
                                </div>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-primary"
                                  onClick={() => {
                                    setBeneficiario(beneficiario);
                                    setResultadosBeneficiario([]);
                                    setSearchBeneficiario("");
                                  }}
                                >
                                  Selecionar
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="alert alert-success d-flex justify-content-between align-items-center">
                        <div>
                          <strong>Beneficiário Selecionado:</strong>{" "}
                          {selectedBeneficiario.nome}
                          <br />
                          <small>
                            CPF: {selectedBeneficiario.cpf} | Tel:{" "}
                            {selectedBeneficiario.telefone}
                          </small>
                          {selectedBeneficiario.endereco && (
                            <>
                              <br />
                              <small>
                                {selectedBeneficiario.endereco.cidade} -{" "}
                                {selectedBeneficiario.endereco.estado}
                              </small>
                            </>
                          )}
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setBeneficiario(null)}
                        >
                          Remover
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModalDoacao(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={processarDoacao}
                  disabled={!selectedBeneficiario || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Heart size={16} className="me-2" />
                      Confirmar Doação
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Venda */}
      {showModalVenda && selectedItem && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <DollarSign size={20} className="me-2" />
                  Processar Venda
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModalVenda(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Informações do Item */}
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="mb-0">
                      <Package size={16} className="me-2" />
                      Item Selecionado
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-8">
                        <h5>{selectedItem.descricao}</h5>
                        <p className="text-muted mb-1">
                          <strong>Categoria:</strong> {selectedItem.categoria} |
                          <strong> Quantidade:</strong>{" "}
                          {selectedItem.quantidade} |<strong> Estado:</strong>{" "}
                          {selectedItem.estadoConservacao}
                        </p>
                        <p className="text-muted mb-0">
                          <strong>Doador:</strong>{" "}
                          {selectedItem.pessoa?.nome || "N/A"}
                        </p>
                      </div>
                      <div className="col-md-4 text-end">
                        <h4 className="text-success">
                          {formatCurrency(selectedItem.valor || 0)}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seleção de Beneficiário */}
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="mb-0">
                      <Users size={16} className="me-2" />
                      Selecionar Beneficiário (Comprador)
                    </h6>
                  </div>
                  <div className="card-body">
                    {!selectedBeneficiario ? (
                      <div>
                        <div className="row mb-3">
                          <div className="col-md-8">
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar beneficiário por nome, CPF ou telefone"
                                value={searchBeneficiario}
                                onChange={(e) =>
                                  setSearchBeneficiario(e.target.value)
                                }
                              />
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={buscarBeneficiario}
                              >
                                <Search size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <button
                              type="button"
                              className="btn btn-success w-100"
                              onClick={() => setShowModalBeneficiario(true)}
                            >
                              <Plus size={16} className="me-2" />
                              Novo Beneficiário
                            </button>
                          </div>
                        </div>

                        {/* Resultados da busca */}
                        {resultadosBeneficiario.length > 0 && (
                          <div
                            className="border rounded p-2"
                            style={{ maxHeight: "200px", overflowY: "auto" }}
                          >
                            {resultadosBeneficiario.map((beneficiario) => (
                              <div
                                key={beneficiario.id}
                                className="d-flex justify-content-between align-items-center p-2 border-bottom cursor-pointer hover-bg-light"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setBeneficiario(beneficiario);
                                  setResultadosBeneficiario([]);
                                  setSearchBeneficiario("");
                                }}
                              >
                                <div>
                                  <strong>{beneficiario.nome}</strong>
                                  <br />
                                  <small className="text-muted">
                                    CPF: {beneficiario.cpf} | Tel:{" "}
                                    {beneficiario.telefone}
                                  </small>
                                </div>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-primary"
                                  onClick={() => {
                                    setBeneficiario(beneficiario);
                                    setResultadosBeneficiario([]);
                                    setSearchBeneficiario("");
                                  }}
                                >
                                  Selecionar
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="alert alert-info d-flex justify-content-between align-items-center">
                        <div>
                          <strong>Comprador Selecionado:</strong>{" "}
                          {selectedBeneficiario.nome}
                          <br />
                          <small>
                            CPF: {selectedBeneficiario.cpf} | Tel:{" "}
                            {selectedBeneficiario.telefone}
                          </small>
                          {selectedBeneficiario.endereco && (
                            <>
                              <br />
                              <small>
                                {selectedBeneficiario.endereco.cidade} -{" "}
                                {selectedBeneficiario.endereco.estado}
                              </small>
                            </>
                          )}
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setBeneficiario(null)}
                        >
                          Remover
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Observações da Venda */}
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">Observações da Venda (opcional)</h6>
                  </div>
                  <div className="card-body">
                    <textarea
                      className="form-control"
                      rows={3}
                      value={observacoesVenda}
                      onChange={(e) => setObservacoesVenda(e.target.value)}
                      placeholder="Informações sobre a venda, forma de pagamento, condições especiais, etc..."
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModalVenda(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={processarVenda}
                  disabled={!selectedBeneficiario || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <DollarSign size={16} className="me-2" />
                      Confirmar Venda
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cadastro Beneficiário */}
      {showModalBeneficiario && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <User size={20} className="me-2" />
                  Cadastrar Novo Beneficiário
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModalBeneficiario(false)}
                ></button>
              </div>
              <form onSubmit={cadastrarBeneficiario}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label htmlFor="nome" className="form-label">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="nome"
                        name="nome"
                        value={novoBeneficiario.nome}
                        onChange={handleNovoBeneficiarioChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="cpf" className="form-label">
                        CPF *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cpf"
                        name="cpf"
                        value={novoBeneficiario.cpf}
                        onChange={handleNovoBeneficiarioChange}
                        placeholder="000.000.000-00"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="telefone" className="form-label">
                        Telefone *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="telefone"
                        name="telefone"
                        value={novoBeneficiario.telefone}
                        onChange={handleNovoBeneficiarioChange}
                        placeholder="(48) 99999-9999"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="email" className="form-label">
                        E-mail
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={novoBeneficiario.email}
                        onChange={handleNovoBeneficiarioChange}
                      />
                    </div>

                    <div className="col-12">
                      <h6 className="text-secondary mt-3 mb-2">
                        <MapPin size={16} className="me-2" />
                        Endereço
                      </h6>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="endereco.cidade" className="form-label">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="endereco.cidade"
                        name="endereco.cidade"
                        value={novoBeneficiario.endereco?.cidade || ""}
                        onChange={handleNovoBeneficiarioChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="endereco.estado" className="form-label">
                        Estado *
                      </label>
                      <select
                        className="form-select"
                        id="endereco.estado"
                        name="endereco.estado"
                        value={novoBeneficiario.endereco?.estado || ""}
                        onChange={handleNovoBeneficiarioChange}
                        required
                      >
                        <option value="">Selecione o estado</option>
                        {Object.values(Estado).map((estado) => (
                          <option key={estado} value={estado}>
                            {estado}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12">
                      <label htmlFor="endereco.rua" className="form-label">
                        Rua
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="endereco.rua"
                        name="endereco.rua"
                        value={novoBeneficiario.endereco?.rua || ""}
                        onChange={handleNovoBeneficiarioChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="endereco.numero" className="form-label">
                        Número
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="endereco.numero"
                        name="endereco.numero"
                        value={novoBeneficiario.endereco?.numero || ""}
                        onChange={handleNovoBeneficiarioChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="endereco.cep" className="form-label">
                        CEP
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="endereco.cep"
                        name="endereco.cep"
                        value={novoBeneficiario.endereco?.cep || ""}
                        onChange={handleNovoBeneficiarioChange}
                        placeholder="00000-000"
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="observacoes" className="form-label">
                        Observações
                      </label>
                      <textarea
                        className="form-control"
                        id="observacoes"
                        name="observacoes"
                        rows={3}
                        value={novoBeneficiario.observacoes}
                        onChange={handleNovoBeneficiarioChange}
                        placeholder="Informações adicionais sobre o beneficiário..."
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModalBeneficiario(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success">
                    <User size={16} className="me-2" />
                    Cadastrar Beneficiário
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaSocial;
