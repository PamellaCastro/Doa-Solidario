import type React from "react"
import { useState, useEffect } from "react"
import { Save, XCircle, Search, UserPlus, User, X } from "lucide-react"
import { type Item, EstadoConservacao, Situacao } from "../../types/Item"
import { Categoria } from "../../types/Categoria"
import type { Pessoa } from "../../types/Pessoa"
import type { SubCategoria } from "../../types/SubCategoria"
import { Estado } from "../../types/Endereco"
import { PessoaService } from "../../services/PessoaService"
import { SubCategoriaService } from "../../services/SubCategoriaService"

interface FormularioItemProps {
  item: Item | null
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent, itemAtualizado?: Item) => void
  modo: "cadastro" | "edicao"
  error: string | null
  isSubmitting: boolean
  disableCategoria?: boolean
  disableDataCadastro?: boolean
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
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPessoa, setSelectedPessoa] = useState<Pessoa | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Pessoa[]>([])
  const [isSubmittingPessoa, setIsSubmittingPessoa] = useState(false)
  const [subCategorias, setSubCategorias] = useState<SubCategoria[]>([])
  const [loadingSubCategorias, setLoadingSubCategorias] = useState(false)

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
  })

  const formatarTexto = (texto: string): string => {
    return texto
      .toLowerCase()
      .split("_")
      .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join(" ")
  }

  useEffect(() => {
    // No modo de edição vem com uma pessoa selecionada
    if (modo === "edicao" && item?.pessoadoador && !selectedPessoa) {
      console.log("Definindo pessoa do item:", item.pessoadoador)
      setSelectedPessoa(item.pessoadoador)
    }
  }, [item, modo, selectedPessoa])

  // Carregar subcategorias quando a categoria mudar
  useEffect(() => {
    if (item?.categoria) {
      carregarSubCategorias(item.categoria)
    } else {
      setSubCategorias([])
    }
  }, [item?.categoria])

  const carregarSubCategorias = async (categoria: Categoria) => {
    setLoadingSubCategorias(true)
    try {
      const subs = await SubCategoriaService.listarPorCategoria(categoria)
      setSubCategorias(subs)
    } catch (error) {
      console.error("Erro ao carregar subcategorias:", error)
      setSubCategorias([])
    } finally {
      setLoadingSubCategorias(false)
    }
  }

  if (!item && modo === "edicao") return null

  const categorias: Categoria[] = [Categoria.ELETRONICO, Categoria.ELETRODOMESTICO, Categoria.MOVEL, Categoria.TEXTIL]

  const estadosConservacao = Object.values(EstadoConservacao)
  const estados = Object.values(Estado)
  let situacoesDisponiveisParaSelect: Situacao[] = []

  if (modo === "cadastro") {
    situacoesDisponiveisParaSelect = [Situacao.ABERTO]
  } else if (modo === "edicao") {
    situacoesDisponiveisParaSelect = Object.values(Situacao).filter(
      (situ) =>
        situ === Situacao.ABERTO ||
        situ === Situacao.EM_ANDAMENTO ||
        situ === Situacao.DEPOSITADO
    );
  }

  // Busca de pessoa usando a API
  const buscarPessoa = async () => {
    if (!searchTerm.trim()) return

    setIsSearching(true)
    try {
      const resultados = await PessoaService.buscar(searchTerm)
      setSearchResults(resultados)
    } catch (error) {
      console.error("Erro ao buscar pessoa:", error)
      setSearchResults([])
      alert("Erro ao buscar pessoa. Tente novamente.")
    } finally {
      setIsSearching(false)
    }
  }

  const selecionarPessoa = (pessoa: Pessoa) => {
    setSelectedPessoa(pessoa)
    setSearchResults([])
    setSearchTerm("")
  }

  const handleNovaPessoaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name.startsWith("endereco.")) {
      const enderecoField = name.split(".")[1]
      setNovaPessoa((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco!,
          [enderecoField]: enderecoField === "numero" ? Number(value) : value,
        },
      }))
    } else {
      setNovaPessoa((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Cadastro de pessoa usando a API
  const cadastrarNovaPessoa = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingPessoa(true)

    try {
      const pessoaCadastrada = await PessoaService.criar(novaPessoa)
      setSelectedPessoa(pessoaCadastrada)
      setShowModal(false)
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
      })
      alert("Pessoa cadastrada com sucesso!")
    } catch (error) {
      console.error("Erro ao cadastrar pessoa:", error)
      alert("Erro ao cadastrar pessoa. Verifique os dados e tente novamente.")
    } finally {
      setIsSubmittingPessoa(false)
    }
  }

  const removerPessoa = () => {
    setSelectedPessoa(null)
  }

  // Handle para mudança de subcategoria
  const handleSubCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subCategoriaId = Number(e.target.value)
    const subCategoria = subCategorias.find((sub) => sub.id === subCategoriaId)

    // Criar evento sintético para o onChange do componente pai
    const syntheticEvent = {
      target: {
        name: "subCategoria",
        value: subCategoria,
      },
    } as any

    onChange(syntheticEvent)
  }

  // Função para submeter o formulário com a pessoa selecionada
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPessoa) {
      alert("Por favor, selecione uma pessoa antes de continuar.")
      return
    }

    if (!item?.subCategoria) {
      alert("Por favor, selecione uma subcategoria.")
      return
    }

    const itemAtualizado: Item = {
      ...item,
      pessoadoador: selectedPessoa,
    }

    onSubmit(e, itemAtualizado) // envia item completo com pessoadoador
  }


  return (
    <>
      <form onSubmit={handleFormSubmit} className="card p-4">
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
                      {isSearching ? <span className="spinner-border spinner-border-sm" /> : <Search size={16} />}
                    </button>
                  </div>
                </div>

                <div className="col-md-4 mb-3 d-flex align-items-end">
                  <button type="button" className="btn btn-success w-100" onClick={() => setShowModal(true)}>
                    <UserPlus size={16} className="me-2" />
                    Cadastrar Nova Pessoa
                  </button>
                </div>

                {/* Resultados da busca */}
                {searchResults.length > 0 && (
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <small className="text-muted">Resultados encontrados:</small>
                      </div>
                      <div className="card-body p-2">
                        {searchResults.map((pessoadoador) => (
                          <div
                            key={pessoadoador.id}
                            className="d-flex justify-content-between align-items-center p-2 border-bottom cursor-pointer hover-bg-light"
                            onClick={() => selecionarPessoa(pessoadoador)}
                            style={{ cursor: "pointer" }}
                          >
                            <div>
                              <strong>{pessoadoador.nome}</strong>
                              <br />
                              <small className="text-muted">
                                CPF: {pessoadoador.cpf} | Email: {pessoadoador.email}
                              </small>
                              {pessoadoador.endereco && <br />}
                              <small className="text-muted">
                                {pessoadoador.endereco?.cidade} - {pessoadoador.endereco?.estado}
                              </small>
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-primary"
                              onClick={() => selecionarPessoa(pessoadoador)}
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
                  {selectedPessoa.endereco && (
                    <>
                      <br />
                      <small>
                        {selectedPessoa.endereco.cidade} - {selectedPessoa.endereco.estado}
                      </small>
                    </>
                  )}
                </div>
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={removerPessoa}>
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
              Descrição *
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
              Quantidade *
            </label>
            <input
              type="number"
              className="form-control"
              id="quantidade"
              name="quantidade"
              value={item?.quantidade && item.quantidade > 0 ? item.quantidade : ""}
              onChange={onChange}
              required
              min="1"
            />
          </div>

          {/* <div className="mb-3 col-12 col-md-6">
            <label htmlFor="valor" className="form-label">
              Valor (R$) *
            </label>
            <input
              type="text"
              className="form-control"
              id="valor"
              name="valor"
              value={item?.valor !== undefined && item?.valor !== null ? item.valor.toString().replace(".", ",") : ""}
              onChange={onChange}
              inputMode="decimal"
              required
            />
          </div> */}

          <div className="mb-3 col-12 col-md-6">
            <label htmlFor="caminhao" className="form-label">
              Necessita Caminhão?
            </label>
            <select
              className="form-select"
              id="caminhao"
              name="caminhao"
              value={item?.caminhao ? "true" : "false"}
              onChange={onChange}
            >
              <option value="false">Não</option>
              <option value="true">Sim</option>
            </select>
          </div>

          <div className="mb-3 col-12 col-md-6">
            <label htmlFor="categoria" className="form-label">
              Categoria *
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
                  {formatarTexto(cat)}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3 col-12 col-md-6">
            <label htmlFor="subCategoria" className="form-label">
              Subcategoria *
            </label>
            <select
              className="form-select"
              id="subCategoria"
              name="subCategoria"
              value={item?.subCategoria?.id || ""}
              onChange={handleSubCategoriaChange}
              required
              disabled={!item?.categoria || loadingSubCategorias}
            >
              <option value="">
                {!item?.categoria
                  ? "Selecione uma categoria primeiro"
                  : loadingSubCategorias
                    ? "Carregando..."
                    : "Selecione uma subcategoria"}
              </option>
              {subCategorias.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.descricao}
                </option>
              ))}
            </select>
            {item?.categoria && subCategorias.length === 0 && !loadingSubCategorias && (
              <small className="text-muted">Nenhuma subcategoria disponível para esta categoria.</small>
            )}
          </div>

          <div className="mb-3 col-12 col-md-6">
            <label htmlFor="estadoConservacao" className="form-label">
              Estado de Conservação *
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
                  {formatarTexto(estado)}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3 col-12 col-md-6">
            <label htmlFor="situacao" className="form-label">
              Situação *
            </label>
            <select
              className="form-select"
              id="situacao"
              name="situacao"
              // Define o valor padrão para "ABERTO" no cadastro, caso contrário usa o valor do item
              value={modo === "cadastro" ? Situacao.ABERTO : (item?.situacao || "")}
              onChange={onChange}
              required
              disabled={modo === "cadastro"}
            >
              {modo === "edicao" && <option value="">Selecione a situação</option>}
              {situacoesDisponiveisParaSelect.map((situ) => (
                <option key={situ} value={situ}>
                  {formatarTexto(situ)}
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
              <div className="alert alert-danger d-flex align-items-center" role="alert">
                <XCircle size={20} className="me-2" />
                <div>{error}</div>
              </div>
            </div>
          )}

          <div className="col-12 mt-4 text-center">
            <button
              type="submit"
              className="btn btn-primary d-inline-flex align-items-center gap-2"
              disabled={isSubmitting || !selectedPessoa || !item?.subCategoria}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  {modo === "cadastro" ? "Cadastrar" : "Atualizar"}
                </>
              )}
            </button>
            {(!selectedPessoa || !item?.subCategoria) && (
              <div className="text-muted mt-2">
                <small>* Selecione uma pessoa e subcategoria para continuar</small>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Modal para Cadastrar Nova Pessoa */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <UserPlus size={20} className="me-2" />
                  Cadastrar Nova Pessoa
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
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

                    <div className="col-12">
                      <h6 className="text-secondary mt-3 mb-2">Endereço</h6>
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
                        value={novaPessoa.endereco?.cidade || ""}
                        onChange={handleNovaPessoaChange}
                        required
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
                        value={novaPessoa.endereco?.cep || ""}
                        onChange={handleNovaPessoaChange}
                        placeholder="00000-000"
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="endereco.rua" className="form-label">
                        Rua *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="endereco.rua"
                        name="endereco.rua"
                        value={novaPessoa.endereco?.rua || ""}
                        onChange={handleNovaPessoaChange}
                        required
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
                        value={novaPessoa.endereco?.numero || ""}
                        onChange={handleNovaPessoaChange}
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
                        value={novaPessoa.endereco?.estado || ""}
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
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success" disabled={isSubmittingPessoa}>
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
  )
}

export default FormularioItem