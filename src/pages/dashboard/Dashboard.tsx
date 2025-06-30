import type React from "react"
import { useState, useEffect } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts"
import { Package, DollarSign, Users, TrendingUp, Monitor, ShoppingBag, Sofa, Shirt } from "lucide-react"
import { ItemService } from "../../services/ItemService"
import { PessoaService } from "../../services/PessoaService"
import type { Item } from "../../types/Item"
import type { Pessoa } from "../../types/Pessoa"
import "./Dashboard.module.css"

interface DashboardStats {
  totalItens: number
  totalPessoas: number
  valorTotal: number
  itensPorCategoria: { categoria: string; quantidade: number; valor: number }[]
  itensPorSituacao: { situacao: string; quantidade: number }[]
  itensDoados: number
  itensVendidos: number
  itensDepositados: number
  valorVendidos: number
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalItens: 0,
    totalPessoas: 0,
    valorTotal: 0,
    itensPorCategoria: [],
    itensPorSituacao: [],
    itensDoados: 0,
    itensVendidos: 0,
    itensDepositados: 0,
    valorVendidos: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    setLoading(true)
    setError(null)
    try {
      const [itens, pessoas] = await Promise.all([ItemService.listarTodos(), PessoaService.listarTodos()])

      const statsCalculadas = calcularEstatisticas(itens, pessoas)
      setStats(statsCalculadas)
    } catch (err) {
      setError("Erro ao carregar dados do gráficos")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const calcularEstatisticas = (itens: Item[], pessoas: Pessoa[]): DashboardStats => {
    const totalItens = itens.reduce((acc, item) => acc + item.quantidade, 0)
    // const valorTotal = itens.reduce((acc, item) => acc + (item.valor || 0), 0) REMOVIDO PARA CALCULAR DE OUTRA FORMA ABAIXO

    // Itens por categoria
    const categorias = ["ELETRONICO", "ELETRODOMESTICO", "MOVEL", "TEXTIL"]
    const itensPorCategoria = categorias.map((categoria) => {
      const itensCategoria = itens.filter((item) => item.categoria === categoria)
      return {
        categoria: formatarCategoria(categoria),
        quantidade: itensCategoria.reduce((acc, item) => acc + item.quantidade, 0),
        valor: itensCategoria.reduce((acc, item) => acc + (item.valor || 0), 0),
      }
    })

    // Itens por situação
    const situacoes = ["ABERTO", "EM_ANDAMENTO", "DEPOSITADO", "VENDIDO", "DOADO", "SOLICITADO"]
    const itensPorSituacao = situacoes
      .map((situacao) => {
        const itensSituacao = itens.filter((item) => item.situacao === situacao)
        return {
          situacao: formatarSituacao(situacao),
          quantidade: itensSituacao.reduce((acc, item) => acc + item.quantidade, 0),
        }
      })
      .filter((item) => item.quantidade > 0) // Filtra situações sem itens para não aparecer no gráfico

    // Métricas específicas solicitadas
    const itensDoados = itens
      .filter((item) => item.situacao === "DOADO")
      .reduce((acc, item) => acc + item.quantidade, 0)

    const itensVendidos = itens
      .filter((item) => item.situacao === "VENDIDO")
      .reduce((acc, item) => acc + item.quantidade, 0)

    const itensDepositados = itens
      .filter((item) => item.situacao === "DEPOSITADO")
      .reduce((acc, item) => acc + item.quantidade, 0)

    const valorVendidos = itens
      .filter((item) => item.situacao === "VENDIDO")
      .reduce((acc, item) => acc + (item.valor || 0), 0)

      // ATUALIZADO CAETANO - NOVO CALCULO
      const valorTotal = itens
      .filter((item) => item.situacao === "DEPOSITADO")
      .reduce((acc, item) => acc + (item.valor || 0), 0)

    return {
      totalItens,
      totalPessoas: pessoas.length,
      valorTotal,
      itensPorCategoria,
      itensPorSituacao,
      itensDoados,
      itensVendidos,
      itensDepositados,
      valorVendidos,
    }
  }

  const formatarCategoria = (categoria: string): string => {
    const nomes: Record<string, string> = {
      ELETRONICO: "Eletrônicos",
      ELETRODOMESTICO: "Eletrodomésticos",
      MOVEL: "Móveis",
      TEXTIL: "Têxteis",
    }
    return nomes[categoria] || categoria
  }

  const formatarSituacao = (situacao: string): string => {
    const nomes: Record<string, string> = {
      ABERTO: "Aberto",
      EM_ANDAMENTO: "Em Andamento",
      DEPOSITADO: "Depositado",
      VENDIDO: "Vendido",
      DOADO: "Doado",
      SOLICITADO: "Solicitado",
    }
    return nomes[situacao] || situacao
  }

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  // Dados para o gráfico de barras de "Situação de Itens Específicos"
  const situacoesEspecificasData = [
    { name: "Itens Doados", quantidade: stats.itensDoados },
    { name: "Itens Vendidos", quantidade: stats.itensVendidos },
    { name: "Itens Depositados", quantidade: stats.itensDepositados },
  ]

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando gráficos...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        <h4>Erro ao carregar gráficos</h4>
        <p>{error}</p>
        <button className="btn btn-outline-danger" onClick={carregarDados}>
          Tentar Novamente
        </button>
      </div>
    )
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 text-primary mb-0">Gráficos</h1>
        <button className="btn btn-outline-primary" onClick={carregarDados}>
          Atualizar Dados
        </button>
      </div>

      {/* Seção de Resumo Principal - Menos "quadradona" */}
      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">Visão Geral das Estatísticas</h5>
        </div>
        <div className="card-body">
          <div className="row text-center">
            <div className="col-md-3 border-end py-2">
              <Package size={30} className="text-primary mb-2" />
              <h6 className="text-muted mb-0">Total de Itens</h6>
              <h4 className="mb-0 text-primary">{stats.totalItens}</h4>
            </div>
            <div className="col-md-3 border-end py-2">
              <DollarSign size={30} className="text-success mb-2" />
              <h6 className="text-muted mb-0">Valor Total</h6>
              <h4 className="mb-0 text-success">{formatCurrency(stats.valorTotal)}</h4>
            </div>
            <div className="col-md-3 border-end py-2">
              <Users size={30} className="text-info mb-2" />
              <h6 className="text-muted mb-0">Total de Pessoas</h6>
              <h4 className="mb-0 text-info">{stats.totalPessoas}</h4>
            </div>
            <div className="col-md-3 py-2">
              <TrendingUp size={30} className="text-warning mb-2" />
              <h6 className="text-muted mb-0">Valor Vendidos</h6>
              <h4 className="mb-0 text-warning">{formatCurrency(stats.valorVendidos)}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="row">
        <div className="col-lg-8 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-header">
              <h5 className="card-title mb-0">Itens por Categoria (Quantidade e Valor)</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.itensPorCategoria}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoria" />
                  <YAxis />


                  <Tooltip // ATUALIZADO CAETANO
                    formatter={(value, name) => [
                      name === "Quantidade"
                        ? `${value} unidade${Number(value) !== 1 ? "s" : ""}`
                        : formatCurrency(Number(value)),
                      name, 
                    ]}
                  /> 
                  



                  <Legend /> {/* Adicionado Legend para BarChart */}
                  <Bar dataKey="quantidade" fill="#8884d8" name="Quantidade" />
                  <Bar dataKey="valor" fill="#82ca9d" name="Valor" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-header">
              <h5 className="card-title mb-0">Distribuição da Situação dos Itens</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  
                  <Pie
                    data={stats.itensPorSituacao}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ situacao, quantidade }) => `${situacao}: ${quantidade}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="quantidade"
                  >
                    {stats.itensPorSituacao.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>





                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Novo Gráfico: Itens por Situações Específicas (Doados, Vendidos, Depositados) */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card h-100 shadow-sm">
            <div className="card-header">
              <h5 className="card-title mb-0">Itens por Tipo de Operação (Doados, Vendidos, Depositados)</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={situacoesEspecificasData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantidade" fill="#ffc658" name="Quantidade de Itens" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo por Categoria */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="card-title mb-0">Resumo Detalhado por Categoria</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped table-hover"> {/* Adicionado table-hover */}
                  <thead>
                    <tr>
                      <th>Categoria</th>
                      <th>Quantidade de Itens</th>
                      <th>Valor Total</th>
                      <th>Valor Médio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.itensPorCategoria.map((categoria, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center">
                            {categoria.categoria === "Eletrônicos" && <Monitor size={20} className="me-2 text-primary" />}
                            {categoria.categoria === "Eletrodomésticos" && <ShoppingBag size={20} className="me-2 text-success" />}
                            {categoria.categoria === "Móveis" && <Sofa size={20} className="me-2 text-info" />}
                            {categoria.categoria === "Têxteis" && <Shirt size={20} className="me-2 text-warning" />}
                            {categoria.categoria}
                          </div>
                        </td>
                        <td>{categoria.quantidade}</td>
                        <td>{formatCurrency(categoria.valor)}</td>
                        <td>
                          {categoria.quantidade > 0
                            ? formatCurrency(categoria.valor / categoria.quantidade)
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

export default Dashboard