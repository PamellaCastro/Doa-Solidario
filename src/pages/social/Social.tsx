import type React from "react"

import { useState, useEffect } from "react"
import { MessageSquare, Check, X, AlertCircle } from "lucide-react"

//pedidos sociais
const mockPedidos = [
  {
    id: 1,
    familia: "Silva",
    responsavel: "Maria Silva",
    contato: "(48) 99999-1111",
    categoria: "Têxteis",
    descricao: "Precisamos de roupas infantis para crianças de 5-8 anos",
    prioridade: "Alta",
    status: "Pendente",
    data_solicitacao: "2023-08-10",
  },
  {
    id: 2,
    familia: "Santos",
    responsavel: "João Santos",
    contato: "(48) 99999-2222",
    categoria: "Eletrodomésticos",
    descricao: "Necessitamos de um fogão para a família",
    prioridade: "Média",
    status: "Em análise",
    data_solicitacao: "2023-08-15",
  },
  {
    id: 3,
    familia: "Oliveira",
    responsavel: "Ana Oliveira",
    contato: "(48) 99999-3333",
    categoria: "Móveis",
    descricao: "Precisamos de uma cama de casal e duas camas de solteiro",
    prioridade: "Alta",
    status: "Atendido",
    data_solicitacao: "2023-08-05",
  },
]

function Social() {
  const [pedidos, setPedidos] = useState<any[]>([])
  const [novoPedido, setNovoPedido] = useState({
    familia: "",
    responsavel: "",
    contato: "",
    categoria: "",
    descricao: "",
    prioridade: "Média",
  })
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  useEffect(() => {
    //busca na API
    setPedidos(mockPedidos)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNovoPedido({
      ...novoPedido,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    //envio para API
    const novoPedidoCompleto = {
      ...novoPedido,
      id: pedidos.length + 1,
      status: "Pendente",
      data_solicitacao: new Date().toISOString().split("T")[0],
    }

    setPedidos([...pedidos, novoPedidoCompleto])
    setNovoPedido({
      familia: "",
      responsavel: "",
      contato: "",
      categoria: "",
      descricao: "",
      prioridade: "Média",
    })
    setMostrarFormulario(false)
    alert("Pedido registrado com sucesso!")
  }

  const handleAprovar = (id: number) => {
    setPedidos(pedidos.map((pedido) => (pedido.id === id ? { ...pedido, status: "Aprovado" } : pedido)))
    alert("Pedido aprovado com sucesso!")
  }

  const handleRejeitar = (id: number) => {
    setPedidos(pedidos.map((pedido) => (pedido.id === id ? { ...pedido, status: "Rejeitado" } : pedido)))
    alert("Pedido rejeitado.")
  }

  const handleAtender = (id: number) => {
    setPedidos(pedidos.map((pedido) => (pedido.id === id ? { ...pedido, status: "Atendido" } : pedido)))
    alert("Pedido marcado como atendido!")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente":
        return "bg-orange-500"
      case "Em análise":
        return "bg-blue-500"
      case "Aprovado":
        return "bg-green-500"
      case "Rejeitado":
        return "bg-red-500"
      case "Atendido":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Área Social - Pedidos</h1>
        <button
          className="form-button success flex items-center gap-2"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          <MessageSquare size={18} />
          {mostrarFormulario ? "Cancelar" : "Novo Pedido"}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="form-container mb-6">
          <h2 className="form-title">Registrar Novo Pedido</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Família</label>
                <input
                  type="text"
                  name="familia"
                  className="form-input"
                  value={novoPedido.familia}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Responsável</label>
                <input
                  type="text"
                  name="responsavel"
                  className="form-input"
                  value={novoPedido.responsavel}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contato</label>
                <input
                  type="text"
                  name="contato"
                  className="form-input"
                  value={novoPedido.contato}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Categoria</label>
                <select
                  name="categoria"
                  className="form-select"
                  value={novoPedido.categoria}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Eletrônicos">Eletrônicos</option>
                  <option value="Eletrodomésticos">Eletrodomésticos</option>
                  <option value="Móveis">Móveis</option>
                  <option value="Têxteis">Têxteis</option>
                </select>
              </div>

              <div className="form-group col-span-2">
                <label className="form-label">Descrição do Pedido</label>
                <textarea
                  name="descricao"
                  className="form-input"
                  value={novoPedido.descricao}
                  onChange={handleChange}
                  required
                  rows={4}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Prioridade</label>
                <select
                  name="prioridade"
                  className="form-select"
                  value={novoPedido.prioridade}
                  onChange={handleChange}
                  required
                >
                  <option value="Baixa">Baixa</option>
                  <option value="Média">Média</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button type="button" className="form-button secondary" onClick={() => setMostrarFormulario(false)}>
                Cancelar
              </button>
              <button type="submit" className="form-button success">
                Registrar Pedido
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Família</th>
              <th>Responsável</th>
              <th>Categoria</th>
              <th>Descrição</th>
              <th>Prioridade</th>
              <th>Status</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length > 0 ? (
              pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>{pedido.id}</td>
                  <td>{pedido.familia}</td>
                  <td>
                    {pedido.responsavel}
                    <div className="text-xs text-gray-600">{pedido.contato}</div>
                  </td>
                  <td>{pedido.categoria}</td>
                  <td>{pedido.descricao}</td>
                  <td>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs text-white ${
                        pedido.prioridade === "Alta"
                          ? "bg-red-500"
                          : pedido.prioridade === "Média"
                            ? "bg-orange-500"
                            : "bg-blue-500"
                      }`}
                    >
                      {pedido.prioridade}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs text-white ${getStatusColor(pedido.status)}`}
                    >
                      {pedido.status}
                    </span>
                  </td>
                  <td>{pedido.data_solicitacao}</td>
                  <td>
                    <div className="actions">
                      {pedido.status === "Pendente" && (
                        <>
                          <button
                            className="action-button edit"
                            onClick={() => handleAprovar(pedido.id)}
                            title="Aprovar"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            className="action-button delete"
                            onClick={() => handleRejeitar(pedido.id)}
                            title="Rejeitar"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                      {pedido.status === "Aprovado" && (
                        <button
                          className="action-button view"
                          onClick={() => handleAtender(pedido.id)}
                          title="Marcar como Atendido"
                        >
                          <AlertCircle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center">
                  Nenhum pedido encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Social
