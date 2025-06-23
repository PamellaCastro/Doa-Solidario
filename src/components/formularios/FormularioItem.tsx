import type React from "react";
import { useState } from "react";
import type { Item, Categoria } from "../../services/ItemService";
import { Save, XCircle, Search, UserPlus, User, X } from "lucide-react";

interface Pessoa {
  id?: number;
  nome: string;
  cpf: string;
  email: string;
  cidade: string;
  cep: string;
  rua: string;
  numero: string;
  estado: string;
}

interface FormularioItemProps {
  item: Item | null;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  modo: "cadastro" | "edicao";
  error: string | null;
  isSubmitting: boolean;
  disableCategoria?: boolean;
  disableDataCadastro?: boolean;
}

const FormularioItem: React.FC<FormularioItemProps> = ({
  item,
  onChange,
  onSubmit,
  modo,
  error,
  isSubmitting,
  disableCategoria = false,
  disableDataCadastro = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPessoa, setSelectedPessoa] = useState<Pessoa | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Pessoa[]>([]);
  const [isSubmittingPessoa, setIsSubmittingPessoa] = useState(false);

  const [novaPessoa, setNovaPessoa] = useState<Pessoa>({
    nome: "",
    cpf: "",
    email: "",
    cidade: "",
    cep: "",
    rua: "",
    numero: "",
    estado: "",
  });

  if (!item && modo === "edicao") return null;

  const categorias: Categoria[] = [
    "ELETRONICO",
    "ELETRODOMESTICO",
    "MOVEL",
    "TEXTIL",
  ];

  const estadosConservacao = ["BOM", "REGULAR", "RUIM"];
  const situacoes = [
    "ABERTO",
    "EM_ANDAMENTO",
    "DEPOSITADO",
    "VENDIDO",
    "SOLICITADO",
    "DOADO",
  ];

  const estados = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  // Simular busca de pessoa (substitua pela sua API)
  const buscarPessoa = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      // Simular chamada à API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dados mockados - substitua pela sua API
      const mockResults: Pessoa[] = [
        {
          id: 1,
          nome: "João Silva",
          cpf: "123.456.789-00",
          email: "joao@email.com",
          cidade: "São Paulo",
          cep: "01234-567",
          rua: "Rua das Flores",
          numero: "123",
          estado: "SP",
        },
      ];

      setSearchResults(
        mockResults.filter(
          (p) =>
            p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.cpf.includes(searchTerm)
        )
      );
    } catch (error) {
      console.error("Erro ao buscar pessoa:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const selecionarPessoa = (pessoa: Pessoa) => {
    setSelectedPessoa(pessoa);
    setSearchResults([]);
    setSearchTerm("");
  };

  const handleNovaPessoaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNovaPessoa((prev) => ({ ...prev, [name]: value }));
  };

  const cadastrarNovaPessoa = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPessoa(true);

    try {
      // Simular cadastro na API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const pessoaCadastrada: Pessoa = {
        ...novaPessoa,
        id: Date.now(), // Simular ID gerado
      };

      setSelectedPessoa(pessoaCadastrada);
      setShowModal(false);
      setNovaPessoa({
        nome: "",
        cpf: "",
        email: "",
        cidade: "",
        cep: "",
        rua: "",
        numero: "",
        estado: "",
      });

      alert("Pessoa cadastrada com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar pessoa:", error);
      alert("Erro ao cadastrar pessoa");
    } finally {
      setIsSubmittingPessoa(false);
    }
  };

  const removerPessoa = () => {
    setSelectedPessoa(null);
  };

  return (
    <>
      <form onSubmit={onSubmit} className="card p-4">
        {/* Seção de Pessoa */}
        <div className="row mb-4">
          <div className="col-12">
            <h5 className="text-primary mb-3">
              <User size={20} className="me-2" />
              Dados da Pessoa
            </h5>

            {!selectedPessoa ? (
              <div className="row">
                <div className="col-md-8 mb-3">
                  <label htmlFor="searchPessoa" className="form-label">
                    Buscar Pessoa (Nome ou CPF)
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      id="searchPessoa"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Digite o nome ou CPF da pessoa"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={buscarPessoa}
                      disabled={isSearching || !searchTerm.trim()}
                    >
                      {isSearching ? (
                        <span className="spinner-border spinner-border-sm" />
                      ) : (
                        <Search size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="col-md-4 mb-3 d-flex align-items-end">
                  <button
                    type="button"
                    className="btn btn-success w-100"
                    onClick={() => setShowModal(true)}
                  >
                    <UserPlus size={16} className="me-2" />
                    Cadastrar Nova Pessoa
                  </button>
                </div>

                {/* Resultados da busca */}
                {searchResults.length > 0 && (
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <small className="text-muted">
                          Resultados encontrados:
                        </small>
                      </div>
                      <div className="card-body p-2">
                        {searchResults.map((pessoa) => (
                          <div
                            key={pessoa.id}
                            className="d-flex justify-content-between align-items-center p-2 border-bottom cursor-pointer hover-bg-light"
                            onClick={() => selecionarPessoa(pessoa)}
                            style={{ cursor: "pointer" }}
                          >
                            <div>
                              <strong>{pessoa.nome}</strong>
                              <br />
                              <small className="text-muted">
                                CPF: {pessoa.cpf} | Email: {pessoa.email}
                              </small>
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-primary"
                              onClick={() => selecionarPessoa(pessoa)}
                            >
                              Selecionar
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="alert alert-success d-flex justify-content-between align-items-center">
                <div>
                  <strong>Pessoa Selecionada:</strong> {selectedPessoa.nome}
                  <br />
                  <small>
                    CPF: {selectedPessoa.cpf} | Email: {selectedPessoa.email}
                  </small>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={removerPessoa}
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        <hr />

        {/* Seção do Item */}
        <div className="row">
          <div className="col-12 mb-3">
            <h5 className="text-primary">
              <Save size={20} className="me-2" />
              Dados do Item
            </h5>
          </div>

          <div className="mb-3 col-12 col-md-6">
            <label htmlFor="descricao" className="form-label">
              Descrição
            </label>
            <input
              type="text"
              className="form-control"
              id="descricao"
              name="descricao"
              value={item?.descricao || ""}
              onChange={onChange}
              required
            />
          </div>

          <div className="mb-3 col-12 col-md-6">
            <label htmlFor="quantidade" className="form-label">
              Quantidade
            </label>
            <input
              type="number"
              className="form-control"
              id="quantidade"
              name="quantidade"
              value={item?.quantidade || ""}
              onChange={onChange}
              required
              min="0"
            />
          </div>

          <div className="mb-3 col-12 col-md-6">
            <label htmlFor="valor" className="form-label">
              Valor (R$)
            </label>
            <input
              type="text"
              className="form-control"
              id="valor"
              name="valor"
              value={
                item?.valor !== undefined && item?.valor !== null
                  ? item.valor.toString().replace(".", ",")
                  : ""
              }
              onChange={onChange}
              inputMode="decimal"
              required
            />
          </div>

          <div className="mb-3 col-12 col-md-6">
            <label htmlFor="caminhao" className="form-label">
              Caminhão
            </label>
            <input
              type="text"
              className="form-control"
              id="caminhao"
              name="caminhao"
              value={item?.caminhao || ""}
              onChange={onChange}
            />
          </div>

          <div className="mb-3 col-12 col-md-6">
            <label htmlFor="categoria" className="form-label">
              Categoria
            </label>
            <select
              className="form-select"
              id="categoria"
              name="categoria"
              value={item?.categoria || ""}
              onChange={onChange}
              required
              disabled={disableCategoria}
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3 col-12 col-md-6">
            <label htmlFor="estadoConservacao" className="form-label">
              Estado de Conservação
            </label>
            <select
              className="form-select"
              id="estadoConservacao"
              name="estadoConservacao"
              value={item?.estadoConservacao || ""}
              onChange={onChange}
              required
            >
              <option value="">Selecione o estado</option>
              {estadosConservacao.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3 col-12 col-md-6">
            <label htmlFor="situacao" className="form-label">
              Situação
            </label>
            <select
              className="form-select"
              id="situacao"
              name="situacao"
              value={item?.situacao || ""}
              onChange={onChange}
              required
            >
              <option value="">Selecione a situação</option>
              {situacoes.map((situ) => (
                <option key={situ} value={situ}>
                  {situ}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3 col-12">
            <label htmlFor="data_cadastro" className="form-label">
              Data de Cadastro
            </label>
            <input
              type="date"
              className="form-control"
              id="data_cadastro"
              name="data_cadastro"
              value={item?.data_cadastro || ""}
              onChange={onChange}
              disabled={disableDataCadastro}
            />
          </div>

          {error && (
            <div className="col-12">
              <div
                className="alert alert-danger d-flex align-items-center"
                role="alert"
              >
                <XCircle size={20} className="me-2" />
                <div>{error}</div>
              </div>
            </div>
          )}

          <div className="col-12 mt-4 text-center">
            <button
              type="submit"
              className="btn btn-primary d-inline-flex align-items-center gap-2"
              disabled={isSubmitting || !selectedPessoa}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  {modo === "cadastro" ? "Cadastrar" : "Atualizar"}
                </>
              )}
            </button>
            {!selectedPessoa && (
              <div className="text-muted mt-2">
                <small>* Selecione uma pessoa para continuar</small>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Modal para Cadastrar Nova Pessoa */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <UserPlus size={20} className="me-2" />
                  Cadastrar Nova Pessoa
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={cadastrarNovaPessoa}>
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
                        value={novaPessoa.nome}
                        onChange={handleNovaPessoaChange}
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
                        value={novaPessoa.cpf}
                        onChange={handleNovaPessoaChange}
                        placeholder="000.000.000-00"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={novaPessoa.email}
                        onChange={handleNovaPessoaChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="cidade" className="form-label">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cidade"
                        name="cidade"
                        value={novaPessoa.cidade}
                        onChange={handleNovaPessoaChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="cep" className="form-label">
                        CEP
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cep"
                        name="cep"
                        value={novaPessoa.cep}
                        onChange={handleNovaPessoaChange}
                        placeholder="00000-000"
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="rua" className="form-label">
                        Rua *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="rua"
                        name="rua"
                        value={novaPessoa.rua}
                        onChange={handleNovaPessoaChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="numero" className="form-label">
                        Número
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="numero"
                        name="numero"
                        value={novaPessoa.numero}
                        onChange={handleNovaPessoaChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="estado" className="form-label">
                        Estado *
                      </label>
                      <select
                        className="form-select"
                        id="estado"
                        name="estado"
                        value={novaPessoa.estado}
                        onChange={handleNovaPessoaChange}
                        required
                      >
                        <option value="">Selecione o estado</option>
                        {estados.map((estado) => (
                          <option key={estado} value={estado}>
                            {estado}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
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
                        Cadastrar Pessoa
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormularioItem;
