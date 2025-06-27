import type React from "react"
import { useState, useEffect } from "react"
import { Search, Package, User, MapPin, Gift, ShoppingCart, Filter, UserPlus, X } from "lucide-react"
import { SocialService } from "../../services/SocialService"
import { PessoaService } from "../../services/PessoaService"
import type { Item, Categoria } from "../../types/Item"
import type { Pessoa } from "../../types/Pessoa"
import { Estado } from "../../types/Endereco"

const Social: React.FC = () => {
  const [itensDisponiveis, setItensDisponiveis] = useState<Item[]>([])
  const [itensDoados, setItensDoados] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriaFiltro, setCategoriaFiltro] = useState<Categoria | "">("")
  const [abaSelecionada, setAbaSelecionada] = useState<"disponiveis" | "doados">("disponiveis")

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [itemSelecionado, setItemSelecionado] = useState<Item | null>(null)
  const [tipoAcao, setTipoAcao] = useState<"doar" | "vender">("doar")
  const [searchPessoa, setSearchPessoa] = useState("")
  const [pessoasSugeridas, setPessoasSugeridas] = useState<Pessoa[]>([])
  const [pessoaSelecionada, setPessoaSelecionada] = useState<Pessoa | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Cadastro de nova pessoa
  const [showCadastroPessoa, setShowCadastroPessoa] = useState(false)
  const [isSubmittingPessoa, setIsSubmittingPessoa] = useState(false)
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

  useEffect(() => {
    carregarItens()
  }, [categoriaFiltro])

  const carregarItens = async () => {
    setLoading(true)
    setError(null)
    try {
      const [disponiveis, doados] = await Promise.all([
        SocialService.listarItensDisponiveis(categoriaFiltro || undefined),
        SocialService.listarItensDoados(categoriaFiltro || undefined),
      ])

      setItensDisponiveis(disponiveis)
      setItensDoados(doados)
    } catch (err) {
      setError("Erro ao carregar itens")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const buscarPessoas = async (termo: string) => {
    if (termo.length < 2) {
      setPessoasSugeridas([])
      return
    }

    try {
      const pessoas = await PessoaService.buscar(termo)
      setPessoasSugeridas(pessoas.slice(0, 5))
    } catch (error) {
      console.error("Erro ao buscar pessoas:", error)
      setPessoasSugeridas([])
    }
  }

  const handleSearchPessoa = (valor: string) => {
    setSearchPessoa(valor)
    buscarPessoas(valor)
  }

  const selecionarPessoa = (pessoa: Pessoa) => {
    setPessoaSelecionada(pessoa)
    setSearchPessoa(pessoa.nome)
    setPessoasSugeridas([])
    setShowCadastroPessoa(false)
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

  const cadastrarNovaPessoa = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingPessoa(true)

    try {
      const pessoaCadastrada = await PessoaService.criar(novaPessoa)
      selecionarPessoa(pessoaCadastrada)

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
      })

      alert("Pessoa cadastrada com sucesso!")
    } catch (error) {
      console.error("Erro ao cadastrar pessoa:", error)
      alert("Erro ao cadastrar pessoa. Verifique os dados e tente novamente.")
    } finally {
      setIsSubmittingPessoa(false)
    }
  }

  const abrirModal = (item: Item, acao: "doar" | "vender") => {
    setItemSelecionado(item)
    setTipoAcao(acao)
    setShowModal(true)
    setPessoaSelecionada(null)
    setSearchPessoa("")
    setPessoasSugeridas([])
    setShowCadastroPessoa(false)
  }

  const fecharModal = () => {
    setShowModal(false)
    setItemSelecionado(null)
    setPessoaSelecionada(null)
    setSearchPessoa("")
    setPessoasSugeridas([])
    setShowCadastroPessoa(false)
  }

  const confirmarAcao = async () => {
    if (!itemSelecionado || !pessoaSelecionada) {
      alert("Por favor, selecione uma pessoa")
      return
    }

    setIsProcessing(true)
    try {
      if (tipoAcao === "doar") {
        await SocialService.doarItem(itemSelecionado.id!, pessoaSelecionada)
        alert("Item doado com sucesso!")
      } else {
        await SocialService.venderItem(itemSelecionado.id!, pessoaSelecionada)
        alert("Item vendido com sucesso!")
      }

      await carregarItens()
      fecharModal()
    } catch (error) {
      console.error(`Erro ao ${tipoAcao} item:`, error)
      alert(`Erro ao ${tipoAcao} item. Tente novamente.`)
    } finally {
      setIsProcessing(false)
    }
  }

  const itensParaExibir = abaSelecionada === "disponiveis" ? itensDisponiveis : itensDoados

  const filteredItens = itensParaExibir.filter(
    (item) =>
      item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pessoadoador?.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const formatarCategoria = (categoria: string): string => {
    const nomes: Record<string, string> = {
      ELETRONICO: "Eletrônico",
      ELETRODOMESTICO: "Eletrodoméstico",
      MOVEL: "Móvel",
      TEXTIL: "Têxtil",
    }
    return nomes[categoria] || categoria
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando itens...</span>
        </div>
      </div>
    )
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
    )
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
          <div className="badge bg-info text-white fs-6">{itensDisponiveis.length} disponíveis</div>
          <div className="badge bg-success text-white fs-6">{itensDoados.length} doados</div>
        </div>
      </div>

      {/* Abas */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${abaSelecionada === "disponiveis" ? "active" : ""}`}
            onClick={() => setAbaSelecionada("disponiveis")}
          >
            <Package size={16} className="me-2" />
            Itens Disponíveis ({itensDisponiveis.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${abaSelecionada === "doados" ? "active" : ""}`}
            onClick={() => setAbaSelecionada("doados")}
          >
            <Gift size={16} className="me-2" />
            Itens Doados ({itensDoados.length})
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
              onChange={(e) => setCategoriaFiltro(e.target.value as Categoria | "")}
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
          <button className="btn btn-outline-primary w-100" onClick={carregarItens}>
            Atualizar
          </button>
        </div>
      </div>

      {/* Lista de Itens */}
      {filteredItens.length > 0 ? (
        <div className="row">
          {filteredItens.map((item) => (
            <div key={item.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span className="badge bg-primary">{formatarCategoria(item.categoria)}</span>
                  <span className={`badge ${abaSelecionada === "disponiveis" ? "bg-info" : "bg-success"}`}>
                    {abaSelecionada === "disponiveis" ? "DEPOSITADO" : "DOADO"}
                  </span>
                </div>
                <div className="card-body">
                  <h5 className="card-title">{item.descricao}</h5>

                  <div className="mb-3">
                    <div className="row g-2">
                      <div className="col-6">
                        <small className="text-muted">Quantidade:</small>
                        <div className="fw-bold">{item.quantidade}</div>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Valor:</small>
                        <div className="fw-bold text-success">{formatCurrency(item.valor || 0)}</div>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Estado:</small>
                        <div className="fw-bold">{item.estadoConservacao}</div>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Caminhão:</small>
                        <div className="fw-bold">{item.caminhao ? "Sim" : "Não"}</div>
                      </div>
                    </div>
                  </div>

                  {item.pessoadoador && (
                    <div className="mb-3 p-2 bg-light rounded">
                      <small className="text-muted d-flex align-items-center mb-1">
                        <User size={14} className="me-1" />
                        Doador:
                      </small>
                      <div className="fw-bold">{item.pessoadoador.nome}</div>
                      <small className="text-muted">{item.pessoadoador.email}</small>
                      {item.pessoadoador.endereco && (
                        <div className="d-flex align-items-center mt-1">
                          <MapPin size={12} className="me-1" />
                          <small>
                            {item.pessoadoador.endereco.cidade} - {item.pessoadoador.endereco.estado}
                          </small>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Beneficiário (apenas para itens doados) */}
                  {abaSelecionada === "doados" && item.pessoabeneficiario && (
                    <div className="mb-3 p-2 bg-success bg-opacity-10 rounded">
                      <small className="text-muted d-flex align-items-center mb-1">
                        <Gift size={14} className="me-1" />
                        Beneficiário:
                      </small>
                      <div className="fw-bold">{item.pessoabeneficiario.nome}</div>
                      <small className="text-muted">{item.pessoabeneficiario.email}</small>
                    </div>
                  )}

                  <small className="text-muted">Cadastrado em: {formatDate(item.data_cadastro)}</small>
                </div>

                {/* Botões apenas para itens disponíveis */}
                {abaSelecionada === "disponiveis" && (
                  <div className="card-footer">
                    <div className="d-flex gap-2">
                      <button className="btn btn-success flex-fill" onClick={() => abrirModal(item, "doar")}>
                        <Gift size={16} className="me-1" />
                        Doar
                      </button>
                      <button className="btn btn-primary flex-fill" onClick={() => abrirModal(item, "vender")}>
                        <ShoppingCart size={16} className="me-1" />
                        Vender
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{tipoAcao === "doar" ? "Doar Item" : "Vender Item"}</h5>
                <button type="button" className="btn-close" onClick={fecharModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <h6>Item: {itemSelecionado.descricao}</h6>
                  <p className="text-muted">
                    Quantidade: {itemSelecionado.quantidade} | Valor: {formatCurrency(itemSelecionado.valor || 0)}
                  </p>
                </div>

                {!showCadastroPessoa ? (
                  <>
                    <div className="mb-3">
                      <label className="form-label">
                        Selecionar {tipoAcao === "doar" ? "Beneficiário" : "Comprador"}:
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
                      <button type="submit" className="btn btn-success" disabled={isSubmittingPessoa}>
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
                    <strong>Pessoa Selecionada:</strong> {pessoaSelecionada.nome}
                    <br />
                    <small>
                      CPF: {pessoaSelecionada.cpf} | Email: {pessoaSelecionada.email}
                    </small>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={fecharModal}>
                  Cancelar
                </button>
                <button
                  type="button"
                  className={`btn ${tipoAcao === "doar" ? "btn-success" : "btn-primary"}`}
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
    </div>
  )
}

export default Social