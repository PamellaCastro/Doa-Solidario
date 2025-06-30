import type React from "react";
import { useState, useEffect } from "react";
import {
  Search,
  Package,
  User,
  MapPin,
  Gift,
  ShoppingCart,
  Filter,
  UserPlus,
  X,
  Edit,
  History, 
} from "lucide-react";
import { SocialService } from "../../services/SocialService";
import { PessoaService } from "../../services/PessoaService";
import { ItemService } from "../../services/ItemService"; 
import type { Item, Categoria } from "../../types/Item";
import type { Pessoa } from "../../types/Pessoa";
import { Estado } from "../../types/Endereco";

const Social: React.FC = () => {
  const [itensDisponiveis, setItensDisponiveis] = useState<Item[]>([]);
  const [itensDoados, setItensDoados] = useState<Item[]>([]);
  const [itensVendidos, setItensVendidos] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<Categoria | "">("");
  const [abaSelecionada, setAbaSelecionada] = useState<
    "disponiveis" | "doados" | "vendidos"
  >("disponiveis");

  // Modal de Doação/Venda states
  const [showModal, setShowModal] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<Item | null>(null);
  const [tipoAcao, setTipoAcao] = useState<"doar" | "vender">("doar");
  const [searchPessoa, setSearchPessoa] = useState("");
  const [pessoasSugeridas, setPessoasSugeridas] = useState<Pessoa[]>([]);
  const [pessoaSelecionada, setPessoaSelecionada] = useState<Pessoa | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // Cadastro de nova pessoa
  const [showCadastroPessoa, setShowCadastroPessoa] = useState(false);
  const [isSubmittingPessoa, setIsSubmittingPessoa] = useState(false);
  const [novaPessoa, setNovaPessoa] = useState<Pessoa>({
    nome: "",
    cpf: "",
    email: "",
    endereco: {
      cidade: "",
      cep: "",
      rua: "",
      numero: 0,
      estado: Estado.SC,
    },
  });

  // NOVO: Modal de Edição de Item states
  const [showEditModal, setShowEditModal] = useState(false);
  const [itemEmEdicao, setItemEmEdicao] = useState<Item | null>(null);
  const [isUpdatingItem, setIsUpdatingItem] = useState(false);

  useEffect(() => {
    carregarItens();
  }, [categoriaFiltro]);

  const carregarItens = async () => {
    setLoading(true);
    setError(null);
    try {
      const [disponiveis, doados, vendidos] = await Promise.all([
        SocialService.listarItensDisponiveis(categoriaFiltro || undefined),
        SocialService.listarItensDoados(categoriaFiltro || undefined),
        SocialService.listarItensVendidos(categoriaFiltro || undefined),
      ]);

      setItensDisponiveis(disponiveis);
      setItensDoados(doados);
      setItensVendidos(vendidos);
    } catch (err) {
      setError("Erro ao carregar itens");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const buscarPessoas = async (termo: string) => {
    if (termo.length < 2) {
      setPessoasSugeridas([]);
      return;
    }

    try {
      const pessoas = await PessoaService.buscar(termo);
      setPessoasSugeridas(pessoas.slice(0, 5));
    } catch (error) {
      console.error("Erro ao buscar pessoas:", error);
      setPessoasSugeridas([]);
    }
  };

  const handleSearchPessoa = (valor: string) => {
    setSearchPessoa(valor);
    buscarPessoas(valor);
  };

  const selecionarPessoa = (pessoa: Pessoa) => {
    setPessoaSelecionada(pessoa);
    setSearchPessoa(pessoa.nome);
    setPessoasSugeridas([]);
    setShowCadastroPessoa(false);
  };

  const handleNovaPessoaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("endereco.")) {
      const enderecoField = name.split(".")[1];
      setNovaPessoa((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco!,
          [enderecoField]: enderecoField === "numero" ? Number(value) : value,
        },
      }));
    } else {
      setNovaPessoa((prev) => ({ ...prev, [name]: value }));
    }
  };

  const cadastrarNovaPessoa = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPessoa(true);

    try {
      const pessoaCadastrada = await PessoaService.criar(novaPessoa);
      selecionarPessoa(pessoaCadastrada);

      // Reset form
      setNovaPessoa({
        nome: "",
        cpf: "",
        email: "",
        endereco: {
          cidade: "",
          cep: "",
          rua: "",
          numero: 0,
          estado: Estado.SC,
        },
      });

      alert("Pessoa cadastrada com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar pessoa:", error);
      alert("Erro ao cadastrar pessoa. Verifique os dados e tente novamente.");
    } finally {
      setIsSubmittingPessoa(false);
    }
  };

  const abrirModal = (item: Item, acao: "doar" | "vender") => {
    setItemSelecionado(item);
    setTipoAcao(acao);
    setShowModal(true);
    setPessoaSelecionada(null);
    setSearchPessoa("");
    setPessoasSugeridas([]);
    setShowCadastroPessoa(false);
  };

  const fecharModal = () => {
    setShowModal(false);
    setItemSelecionado(null);
    setPessoaSelecionada(null);
    setSearchPessoa("");
    setPessoasSugeridas([]);
    setShowCadastroPessoa(false);
  };

  const confirmarAcao = async () => {
    if (!itemSelecionado || !pessoaSelecionada) {
      alert("Por favor, selecione uma pessoa");
      return;
    }

    setIsProcessing(true);
    try {
      if (tipoAcao === "doar") {
        await SocialService.doarItem(itemSelecionado.id!, pessoaSelecionada);
        alert("Item doado com sucesso!");
      } else {
        await SocialService.venderItem(itemSelecionado.id!, pessoaSelecionada);
        alert("Item vendido com sucesso!");
      }

      await carregarItens();
      fecharModal();
    } catch (error) {
      console.error(`Erro ao ${tipoAcao} item:`, error);
      alert(`Erro ao ${tipoAcao} item. Tente novamente.`);
    } finally {
      setIsProcessing(false);
    }
  };

  // NOVO: Função para desfazer doação/venda
  const handleDesfazerAcao = async (itemId: number) => {
    if (
      !window.confirm(
        "Tem certeza que deseja reverter este item para 'Disponível'? O beneficiário será removido."
      )
    ) {
      return;
    }

    setIsProcessing(true);
    try {
      // Chama o serviço para reverter o item (mantendo o doador)
      await SocialService.reverterItemParaDisponivel(itemId);
      alert("Item revertido para disponível com sucesso!");
      await carregarItens();
    } catch (error) {
      console.error("Erro ao reverter item:", error);
      alert("Erro ao reverter item. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };


  // NOVO: Funções para edição de item
  const abrirEditModal = (item: Item) => {
    setItemEmEdicao({ ...item }); 
    setShowEditModal(true);
  };

  const fecharEditModal = () => {
    setShowEditModal(false);
    setItemEmEdicao(null);
  };

  const handleEditItemChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setItemEmEdicao((prev) => {
      if (!prev) return null;
      if (name === "quantidade" || name === "valor") {
        return { ...prev, [name]: Number(value) };
      }
      return { ...prev, [name]: value };
    });
  };

  const salvarEdicaoItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemEmEdicao || !itemEmEdicao.id) {
      alert("Nenhum item selecionado para edição.");
      return;
    }

    setIsUpdatingItem(true);
    try {
      // IMPORTANT: NÃO REMOVER pessoadoador ou pessoabeneficiario aqui.
      // O ItemService.atualizar deve enviar o objeto Item completo.
      // A API backend é responsável por manter a integridade do pessoadoador
      // e ignorar pessoabeneficiario se o item está em DEPOSITADO.
      await ItemService.atualizar(itemEmEdicao.id, itemEmEdicao); 

      alert("Item atualizado com sucesso!");
      await carregarItens(); 
      fecharEditModal();
    } catch (error) {
      console.error("Erro ao atualizar item:", error);
      alert("Erro ao atualizar item. Verifique os dados e tente novamente.");
    } finally {
      setIsUpdatingItem(false);
    }
  };

  const itensParaExibir =
    abaSelecionada === "disponiveis"
      ? itensDisponiveis
      : abaSelecionada === "doados"
      ? itensDoados
      : itensVendidos;

  const filteredItens = itensParaExibir.filter(
    (item) =>
      item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pessoadoador?.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const formatarCategoria = (categoria: string): string => {
    const nomes: Record<string, string> = {
      ELETRONICO: "Eletrônico",
      ELETRODOMESTICO: "Eletrodoméstico",
      MOVEL: "Móvel",
      TEXTIL: "Têxtil",
    };
    return nomes[categoria] || categoria;
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando itens...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        <h4>Erro ao carregar dados</h4>
        <p>{error}</p>
        <button className="btn btn-outline-danger" onClick={carregarItens}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 text-primary mb-0">
          <User size={28} className="me-2" />
          Página Social
        </h1>
        <div className="d-flex gap-2">
          <div className="badge bg-info text-white fs-6">
            {itensDisponiveis.length} disponíveis
          </div>
          <div className="badge bg-success text-white fs-6">
            {itensDoados.length} doados
          </div>
          <div className="badge bg-warning text-dark fs-6">
            {itensVendidos.length} vendidos
          </div>
        </div>
      </div>

      {/* Abas */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${
              abaSelecionada === "disponiveis" ? "active" : ""
            }`}
            onClick={() => setAbaSelecionada("disponiveis")}
          >
            <Package size={16} className="me-2" />
            Itens Disponíveis ({itensDisponiveis.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              abaSelecionada === "doados" ? "active" : ""
            }`}
            onClick={() => setAbaSelecionada("doados")}
          >
            <Gift size={16} className="me-2" />
            Itens Doados ({itensDoados.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              abaSelecionada === "vendidos" ? "active" : ""
            }`}
            onClick={() => setAbaSelecionada("vendidos")}
          >
            <ShoppingCart size={16} className="me-2" />
            Itens Vendidos ({itensVendidos.length})
          </button>
        </li>
      </ul>

      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por descrição ou pessoa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text">
              <Filter size={16} />
            </span>
            <select
              className="form-select"
              value={categoriaFiltro}
              onChange={(e) =>
                setCategoriaFiltro(e.target.value as Categoria | "")
              }
            >
              <option value="">Todas as categorias</option>
              <option value="ELETRONICO">Eletrônicos</option>
              <option value="ELETRODOMESTICO">Eletrodomésticos</option>
              <option value="MOVEL">Móveis</option>
              <option value="TEXTIL">Têxteis</option>
            </select>
          </div>
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-outline-primary w-100"
            onClick={carregarItens}
          >
            Atualizar
          </button>
        </div>
      </div>

      {/* Lista de Itens */}
      {filteredItens.length > 0 ? (
        <div className="list-group">
          {filteredItens.map((item) => (
            <div
              key={item.id}
              className="list-group-item list-group-item-action mb-2 shadow-sm rounded"
            >
              <div className="d-flex w-100 justify-content-between align-items-center">
                <h5 className="mb-1">{item.descricao}</h5>
                <div>
                  <span className="badge bg-primary me-2">
                    {formatarCategoria(item.categoria)}
                  </span>
                  <span
                    className={`badge ${
                      abaSelecionada === "disponiveis"
                        ? "bg-info"
                        : abaSelecionada === "doados"
                        ? "bg-success"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {abaSelecionada === "disponiveis"
                      ? "DISPONÍVEL"
                      : abaSelecionada === "doados"
                      ? "DOADO"
                      : "VENDIDO"}
                  </span>
                </div>
              </div>
              <p className="mb-1">
                Quantidade: <span className="fw-bold">{item.quantidade}</span> |
                Valor:{" "}
                <span className="fw-bold text-success">
                  {formatCurrency(item.valor || 0)}
                </span>{" "}
                | Estado:{" "}
                <span className="fw-bold">{item.estadoConservacao}</span> |
                Coletado:{" "}
                <span className="fw-bold">{item.caminhao ? "Sim" : "Não"}</span>
              </p>

              {item.pessoadoador && (
                <div className="mb-2 p-2 bg-light rounded">
                  <small className="text-muted d-flex align-items-center mb-1">
                    <User size={14} className="me-1" />
                    Doador:
                  </small>
                  <div className="fw-bold">{item.pessoadoador.nome}</div>
                  <small className="text-muted">
                    {item.pessoadoador.email}
                  </small>
                  {item.pessoadoador.endereco && (
                    <div className="d-flex align-items-center mt-1">
                      <MapPin size={12} className="me-1" />
                      <small>
                        {item.pessoadoador.endereco.cidade} -{" "}
                        {item.pessoadoador.endereco.estado}
                      </small>
                    </div>
                  )}
                </div>
              )}

              {/* Beneficiário (apenas para itens doados) ou Comprador (apenas para itens vendidos) */}
              {abaSelecionada === "doados" && item.pessoabeneficiario && (
                <div className="mb-2 p-2 bg-success bg-opacity-10 rounded">
                  <small className="text-muted d-flex align-items-center mb-1">
                    <Gift size={14} className="me-1" />
                    Beneficiário:
                  </small>
                  <div className="fw-bold">{item.pessoabeneficiario.nome}</div>
                  <small className="text-muted">
                    {item.pessoabeneficiario.email}
                  </small>
                </div>
              )}

              {abaSelecionada === "vendidos" && item.pessoabeneficiario && (
                <div className="mb-2 p-2 bg-warning bg-opacity-10 rounded">
                  <small className="text-muted d-flex align-items-center mb-1">
                    <ShoppingCart size={14} className="me-1" />
                    Comprador:
                  </small>
                  <div className="fw-bold">{item.pessoabeneficiario.nome}</div>
                  <small className="text-muted">
                    {item.pessoabeneficiario.email}
                  </small>
                </div>
              )}

              <small className="text-muted">
                Cadastrado em: {formatDate(item.data_cadastro)}
              </small>

              {abaSelecionada === "disponiveis" && (
                <div className="d-flex gap-2 mt-3 justify-content-end">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => abrirEditModal(item)}
                  >
                    <Edit size={16} className="me-1" />
                    Editar Item
                  </button>
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => abrirModal(item, "doar")}
                  >
                    <Gift size={16} className="me-1" />
                    Doar
                  </button>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => abrirModal(item, "vender")}
                  >
                    <ShoppingCart size={16} className="me-1" />
                    Vender
                  </button>
                </div>
              )}

              {abaSelecionada === "doados" && item.pessoabeneficiario && (
                <div className="d-flex gap-2 mt-3 justify-content-end">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDesfazerAcao(item.id!)}
                    disabled={isProcessing}
                  >
                    <History size={16} className="me-1" />
                    Desfazer Doação
                  </button>
                </div>
              )}

              {abaSelecionada === "vendidos" && item.pessoabeneficiario && (
                <div className="d-flex gap-2 mt-3 justify-content-end">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDesfazerAcao(item.id!)}
                    disabled={isProcessing}
                  >
                    <History size={16} className="me-1" />
                    Desfazer Venda
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <Package size={64} className="text-muted mb-3" />
          <h4>Nenhum item encontrado</h4>
          <p className="text-muted">
            {searchTerm || categoriaFiltro
              ? "Nenhum item encontrado com os filtros aplicados."
              : abaSelecionada === "disponiveis"
              ? "Não há itens depositados disponíveis para doação ou venda."
              : "Não há itens doados ainda."}
          </p>
        </div>
      )}

      {/* Modal de Confirmação */}
      {showModal && itemSelecionado && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {tipoAcao === "doar" ? "Doar Item" : "Vender Item"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={fecharModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <h6>Item: {itemSelecionado.descricao}</h6>
                  <p className="text-muted">
                    Quantidade: {itemSelecionado.quantidade} | Valor:{" "}
                    {formatCurrency(itemSelecionado.valor || 0)}
                  </p>
                </div>

                {!showCadastroPessoa ? (
                  <>
                    <div className="mb-3">
                      <label className="form-label">
                        Selecionar{" "}
                        {tipoAcao === "doar" ? "Beneficiário" : "Comprador"}:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Digite o nome ou CPF da pessoa..."
                        value={searchPessoa}
                        onChange={(e) => handleSearchPessoa(e.target.value)}
                      />

                      {pessoasSugeridas.length > 0 && (
                        <div className="list-group mt-2">
                          {pessoasSugeridas.map((pessoa) => (
                            <button
                              key={pessoa.id}
                              type="button"
                              className="list-group-item list-group-item-action"
                              onClick={() => selecionarPessoa(pessoa)}
                            >
                              <div className="fw-bold">{pessoa.nome}</div>
                              <small className="text-muted">
                                CPF: {pessoa.cpf} | Email: {pessoa.email}
                              </small>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="text-center mb-3">
                      <button
                        type="button"
                        className="btn btn-outline-success"
                        onClick={() => setShowCadastroPessoa(true)}
                      >
                        <UserPlus size={16} className="me-2" />
                        Cadastrar Nova Pessoa
                      </button>
                    </div>
                  </>
                ) : (
                  <form onSubmit={cadastrarNovaPessoa}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Cadastrar Nova Pessoa</h6>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setShowCadastroPessoa(false)}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label">Nome Completo *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="nome"
                          value={novaPessoa.nome}
                          onChange={handleNovaPessoaChange}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">CPF *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="cpf"
                          value={novaPessoa.cpf}
                          onChange={handleNovaPessoaChange}
                          placeholder="000.000.000-00"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">E-mail *</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={novaPessoa.email}
                          onChange={handleNovaPessoaChange}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Cidade *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="endereco.cidade"
                          value={novaPessoa.endereco?.cidade || ""}
                          onChange={handleNovaPessoaChange}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Estado *</label>
                        <select
                          className="form-select"
                          name="endereco.estado"
                          value={novaPessoa.endereco?.estado || ""}
                          onChange={handleNovaPessoaChange}
                          required
                        >
                          <option value="">Selecione</option>
                          {Object.values(Estado).map((estado) => (
                            <option key={estado} value={estado}>
                              {estado}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-12">
                        <label className="form-label">Rua *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="endereco.rua"
                          value={novaPessoa.endereco?.rua || ""}
                          onChange={handleNovaPessoaChange}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Número</label>
                        <input
                          type="number"
                          className="form-control"
                          name="endereco.numero"
                          value={novaPessoa.endereco?.numero || ""}
                          onChange={handleNovaPessoaChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">CEP</label>
                        <input
                          type="text"
                          className="form-control"
                          name="endereco.cep"
                          value={novaPessoa.endereco?.cep || ""}
                          onChange={handleNovaPessoaChange}
                          placeholder="00000-000"
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-end mt-3">
                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={isSubmittingPessoa}
                      >
                        {isSubmittingPessoa ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Cadastrando...
                          </>
                        ) : (
                          <>
                            <UserPlus size={16} className="me-2" />
                            Cadastrar e Selecionar
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {pessoaSelecionada && (
                  <div className="alert alert-success">
                    <strong>Pessoa Selecionada:</strong>{" "}
                    {pessoaSelecionada.nome}
                    <br />
                    <small>
                      CPF: {pessoaSelecionada.cpf} | Email:{" "}
                      {pessoaSelecionada.email}
                    </small>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={fecharModal}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className={`btn ${
                    tipoAcao === "doar" ? "btn-success" : "btn-primary"
                  }`}
                  onClick={confirmarAcao}
                  disabled={!pessoaSelecionada || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Processando...
                    </>
                  ) : (
                    <>
                      {tipoAcao === "doar" ? (
                        <Gift size={16} className="me-2" />
                      ) : (
                        <ShoppingCart size={16} className="me-2" />
                      )}
                      Confirmar {tipoAcao === "doar" ? "Doação" : "Venda"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NOVO: Modal de Edição de Item */}
      {showEditModal && itemEmEdicao && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Item: {itemEmEdicao.descricao}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={fecharEditModal}
                ></button>
              </div>
              <form onSubmit={salvarEdicaoItem}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="descricao" className="form-label">
                      Descrição
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="descricao"
                      name="descricao"
                      value={itemEmEdicao.descricao}
                      onChange={handleEditItemChange}
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="quantidade" className="form-label">
                        Quantidade
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="quantidade"
                        name="quantidade"
                        value={itemEmEdicao.quantidade}
                        onChange={handleEditItemChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="valor" className="form-label">
                        Valor
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="valor"
                        name="valor"
                        value={itemEmEdicao.valor || ""}
                        onChange={handleEditItemChange}
                        step="0.01"
                       // required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="estadoConservacao" className="form-label">
                      Estado de Conservação
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="estadoConservacao"
                      name="estadoConservacao"
                      value={itemEmEdicao.estadoConservacao}
                      onChange={handleEditItemChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="categoria" className="form-label">
                      Categoria
                    </label>
                    <select
                      className="form-select"
                      id="categoria"
                      name="categoria"
                      value={itemEmEdicao.categoria}
                      onChange={handleEditItemChange}
                      required
                    >
                      <option value="">Selecione a categoria</option>
                      <option value="ELETRONICO">Eletrônico</option>
                      <option value="ELETRODOMESTICO">Eletrodoméstico</option>
                      <option value="MOVEL">Móvel</option>
                      <option value="TEXTIL">Têxtil</option>
                    </select>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="caminhao"
                      name="caminhao"
                      checked={itemEmEdicao.caminhao || false}
                      onChange={(e) =>
                        setItemEmEdicao((prev) => ({
                          ...prev!,
                          caminhao: e.target.checked,
                        }))
                      }
                    />
                    <label className="form-check-label" htmlFor="caminhao">
                      Requer Entrega?
                    </label>
                  </div>
                  {/* O doador já deve vir preenchido no itemEmEdicao se ele existe, mas não precisa ser editável aqui */}
                  {itemEmEdicao.pessoadoador && (
                    <div className="mb-3 p-2 bg-light rounded">
                      <h6 className="mb-1">Doador:</h6>
                      <p className="mb-0">{itemEmEdicao.pessoadoador.nome}</p>
                      <small className="text-muted">
                        {itemEmEdicao.pessoadoador.email}
                      </small>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={fecharEditModal}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isUpdatingItem}
                  >
                    {isUpdatingItem ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Edit size={16} className="me-2" />
                        Salvar Alterações
                      </>
                    )}
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

export default Social;