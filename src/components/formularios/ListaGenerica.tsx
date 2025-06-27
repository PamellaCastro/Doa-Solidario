import type React from "react"
import { useState, useEffect } from "react"
import { Edit, Trash2, Eye, Plus, Search, Package } from "lucide-react"
import { ItemService } from "../../services/ItemService"
import type { Item, Categoria } from "../../types/Item"

interface ListaGenericaProps {
  categoria: Categoria
  titulo: string
  onEdit: (item: Item) => void
  onView: (item: Item) => void
  onAdd: () => void
}

const ListaGenerica: React.FC<ListaGenericaProps> = ({ categoria, titulo, onEdit, onView, onAdd }) => {
  const [itens, setItens] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    carregarItens()
  }, [categoria])

  const carregarItens = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await ItemService.listarTodos()

      // Filtrar por categoria E por situações permitidas nas páginas de categoria
      const situacoesPermitidas = ["ABERTO", "EM_ANDAMENTO", "DEPOSITADO"]
      const itensFiltrados = data.filter(
        (item) => item.categoria === categoria && situacoesPermitidas.includes(item.situacao),
      )

      setItens(itensFiltrados)
    } catch (err) {
      setError(`Erro ao carregar ${titulo.toLowerCase()}`)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm(`Tem certeza que deseja excluir este ${titulo.toLowerCase().slice(0, -1)}?`)) {
      return
    }

    try {
      await ItemService.deletar(id)
      alert(`${titulo.slice(0, -1)} excluído com sucesso!`)
      await carregarItens()
    } catch (err) {
      alert(`Erro ao excluir ${titulo.toLowerCase().slice(0, -1)}`)
      console.error(err)
    }
  }

  const filteredItens = itens.filter(
    (item) =>
      item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pessoadoador?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.situacao.toLowerCase().includes(searchTerm.toLowerCase()),
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

  const getSituacaoBadgeClass = (situacao: string): string => {
    const classes: Record<string, string> = {
      ABERTO: "bg-primary",
      EM_ANDAMENTO: "bg-warning",
      DEPOSITADO: "bg-info",
      VENDIDO: "bg-success",
      SOLICITADO: "bg-secondary",
      DOADO: "bg-success",
    }
    return classes[situacao] || "bg-secondary"
  }

  const getEstadoConservacaoClass = (estado: string): string => {
    const classes: Record<string, string> = {
      BOM: "text-success",
      REGULAR: "text-warning",
      RUIM: "text-danger",
    }
    return classes[estado] || "text-secondary"
  }

  const formatarTexto = (texto: string): string => {
    return texto
      .toLowerCase()
      .split("_")
      .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join(" ")
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando {titulo.toLowerCase()}...</span>
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
        <h1 className="h2 text-primary mb-0">{titulo}</h1>
        <button className="btn btn-success d-flex align-items-center gap-2" onClick={onAdd}>
          <Plus size={18} />
          Adicionar {titulo.slice(0)}
        </button>
      </div>

      {/* Busca */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder={`Buscar ${titulo.toLowerCase()} por descrição, pessoa ou situação...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6 text-end">
          <small className="text-muted">
            Total: {filteredItens.length} {filteredItens.length === 1 ? "item" : "itens"}
          </small>
        </div>
      </div>

      {/* Tabela */}
      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Ações</th>
                  <th>Descrição</th>
                  <th>Pessoa</th>
                  <th>Quantidade</th>
                  <th>Valor</th>
                  <th>Estado</th>
                  <th>Situação</th>
                  <th>Data Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {filteredItens.length > 0 ? (
                  filteredItens.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() => onView(item)}
                            title="Visualizar"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => onEdit(item)}
                            title="Editar"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(item.id!)}
                            title="Excluir"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>{item.descricao}</strong>
                          {item.caminhao && (
                            <span className="badge bg-warning text-dark ms-2" title="Necessita caminhão">
                              🚛
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        {item.pessoadoador ? (
                          <div>
                            <div>{item.pessoadoador.nome}</div>
                            <small className="text-muted">{item.pessoadoador.email}</small>
                          </div>
                        ) : (
                          <span className="text-muted">Não informado</span>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">{item.quantidade}</span>
                      </td>
                      <td>{formatCurrency(item.valor || 0)}</td>
                      <td>
                        <span className={`fw-bold ${getEstadoConservacaoClass(item.estadoConservacao)}`}>
                          {formatarTexto(item.estadoConservacao)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getSituacaoBadgeClass(item.situacao)} text-white`}>
                          {formatarTexto(item.situacao)}
                        </span>
                      </td>
                      <td>{formatDate(item.data_cadastro)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-5">
                      <div className="text-muted">
                        <Package size={48} className="mb-3 opacity-50" />
                        <h5>Nenhum item encontrado</h5>
                        <p>
                          {searchTerm
                            ? `Nenhum resultado para "${searchTerm}"`
                            : `Não há ${titulo.toLowerCase()} com situação Aberto, Em Andamento ou Depositado.`}
                        </p>
                        {!searchTerm && (
                          <button className="btn btn-primary" onClick={onAdd}>
                            <Plus size={16} className="me-2" />
                            Adicionar Primeiro {titulo.slice(0, -1)}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      {filteredItens.length > 0 && (
        <div className="row mt-4 row-cols-1 row-cols-md-4 g-2">
          <div className="col">
            <div className="card bg-primary text-white">
              <div className="card-body text-center py-1 px-0">
                <h6 className="mb-0 smaller-text">Total de Itens</h6>
                <strong className="fs-6">{filteredItens.reduce((acc, item) => acc + item.quantidade, 0)}</strong>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card bg-success text-white">
              <div className="card-body text-center py-1 px-0">
                <h6 className="mb-0 smaller-text">Valor Total</h6>
                <strong className="fs-6">
                  {formatCurrency(filteredItens.reduce((acc, item) => acc + (item.valor || 0), 0))}
                </strong>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card bg-info text-white">
              <div className="card-body text-center py-1 px-0">
                <h6 className="mb-0 smaller-text">Pessoas</h6>
                <strong className="fs-6">
                  {new Set(filteredItens.map((item) => item.pessoadoador?.id).filter(Boolean)).size}
                </strong>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card bg-warning text-white">
              <div className="card-body text-center py-1 px-0">
                <h6 className="mb-0 smaller-text">Valor Médio</h6>
                <strong className="fs-6">
                  {filteredItens.length > 0
                    ? formatCurrency(
                        filteredItens.reduce((acc, item) => acc + (item.valor || 0), 0) / filteredItens.length,
                      )
                    : "R$ 0,00"}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ListaGenerica
