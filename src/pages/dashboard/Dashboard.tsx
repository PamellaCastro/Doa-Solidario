import type React from "react"
import { useEffect, useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts"
import { ItemService } from "../../services/ItemService"
import { Categoria, Item } from "../../types/Item"
import { Package, TrendingUp, Users, DollarSign } from "lucide-react"

const cores = ["#007BFF", "#28A745", "#FFC107", "#DC3545"]

const nomesCategoria: Record<Categoria, string> = {
  [Categoria.ELETRONICO]: "Eletrônicos",
  [Categoria.ELETRODOMESTICO]: "Eletrodomésticos",
  [Categoria.MOVEL]: "Móveis",
  [Categoria.TEXTIL]: "Têxteis",
}

interface DadosEstatisticas {
  totalItens: number
  totalValor: number
  totalPessoas: number
  categoriaComMaisItens: string
}

const DashboardIntegrado: React.FC = () => {
  const [dadosGrafico, setDadosGrafico] = useState<
    { name: string; value: number; quantidade: number }[]
  >([])
  const [estatisticas, setEstatisticas] = useState<DadosEstatisticas>({
    totalItens: 0,
    totalValor: 0,
    totalPessoas: 0,
    categoriaComMaisItens: "",
  })
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const categorias: Categoria[] = Object.values(Categoria)

        const resultados = await Promise.all(
          categorias.map(async (categoria) => {
            const itens: Item[] = await ItemService.listarTodos(categoria)
            const quantidade = itens.reduce((acc, item) => acc + item.quantidade, 0)
            const valor = itens.reduce((acc, item) => acc + (item.valor || 0), 0)
            return {
              categoria,
              name: nomesCategoria[categoria],
              value: valor,
              quantidade,
              itens,
            }
          }),
        )

        const dadosPizza = resultados.map((r) => ({
          name: r.name,
          value: r.value,
          quantidade: r.quantidade,
        }))

        const totalItens = resultados.reduce((acc, r) => acc + r.quantidade, 0)
        const totalValor = resultados.reduce((acc, r) => acc + r.value, 0)

        const pessoasUnicas = new Set<number>()
        resultados.forEach((r) => {
          r.itens.forEach((item) => {
            if (item.pessoa?.id) {
              pessoasUnicas.add(item.pessoa.id)
            }
          })
        })

        const categoriaComMaisItens = resultados.reduce((max, current) =>
          current.quantidade > max.quantidade ? current : max,
        ).name

        setDadosGrafico(dadosPizza)
        setEstatisticas({
          totalItens,
          totalValor,
          totalPessoas: pessoasUnicas.size,
          categoriaComMaisItens,
        })
      } catch (error) {
        console.error(error)
        setErro("Erro ao carregar dados do dashboard.")
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando gráficos...</span>
        </div>
      </div>
    )
  }

  if (erro) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        {erro}
      </div>
    )
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 text-primary mb-0">Gráficos - Visão Geral</h1>
        <small className="text-muted">Última atualização: {new Date().toLocaleString("pt-BR")}</small>
      </div>

      {/* Cards de Estatísticas */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white h-100">
            <div className="card-body d-flex align-items-center">
              <Package size={40} className="me-3" />
              <div>
                <h5 className="card-title mb-1">Total de Itens</h5>
                <h3 className="mb-0">{estatisticas.totalItens.toLocaleString("pt-BR")}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body d-flex align-items-center">
              <DollarSign size={40} className="me-3" />
              <div>
                <h5 className="card-title mb-1">Valor Total</h5>
                <h3 className="mb-0">
                  {estatisticas.totalValor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white h-100">
            <div className="card-body d-flex align-items-center">
              <Users size={40} className="me-3" />
              <div>
                <h5 className="card-title mb-1">Doadores</h5>
                <h3 className="mb-0">{estatisticas.totalPessoas.toLocaleString("pt-BR")}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white h-100">
            <div className="card-body d-flex align-items-center">
              <TrendingUp size={40} className="me-3" />
              <div>
                <h5 className="card-title mb-1">Categoria Líder</h5>
                <h6 className="mb-0">{estatisticas.categoriaComMaisItens}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">Distribuição por Valor (R$)</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dadosGrafico}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={({ name, value }) =>
                      `${name}: ${value.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}`
                    }
                  >
                    {dadosGrafico.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      value.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }),
                      "Valor",
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">Quantidade de Itens por Categoria</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosGrafico}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [value.toLocaleString("pt-BR"), "Quantidade"]} />
                  <Bar dataKey="quantidade" fill="#007BFF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela Resumo */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Resumo por Categoria</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Categoria</th>
                      <th>Quantidade de Itens</th>
                      <th>Valor Total</th>
                      <th>Valor Médio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dadosGrafico.map((item, index) => (
                      <tr key={item.name}>
                        <td>
                          <span
                            className="badge me-2"
                            style={{ backgroundColor: cores[index % cores.length] }}
                          >
                            ●
                          </span>
                          {item.name}
                        </td>
                        <td>{item.quantidade.toLocaleString("pt-BR")}</td>
                        <td>
                          {item.value.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </td>
                        <td>
                          {item.quantidade > 0
                            ? (item.value / item.quantidade).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })
                            : "R$ 0,00"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardIntegrado
