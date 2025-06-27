import api from "../../api"
import type { Item, Categoria, Situacao } from "../types/Item"

export class SocialService {
  private static readonly BASE_URL = "/item"

  // Listar apenas itens DEPOSITADOS para doação/venda
  static async listarItensDisponiveis(categoria?: Categoria): Promise<Item[]> {
    try {
      let url = this.BASE_URL
      const params = new URLSearchParams()

      if (categoria) {
        params.append("categoria", categoria)
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await api.get(url)

      // Filtrar apenas itens DEPOSITADOS no frontend
      const itensDepositados = response.data.filter((item: Item) => item.situacao === "DEPOSITADO")
      return itensDepositados
    } catch (error) {
      console.error("Erro ao listar itens disponíveis:", error)
      throw error
    }
  }

  // Listar itens já DOADOS para histórico
  static async listarItensDoados(categoria?: Categoria): Promise<Item[]> {
    try {
      let url = this.BASE_URL
      const params = new URLSearchParams()

      if (categoria) {
        params.append("categoria", categoria)
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await api.get(url)

      // Filtrar apenas itens DOADOS no frontend
      const itensDoados = response.data.filter((item: Item) => item.situacao === "DOADO")
      return itensDoados
    } catch (error) {
      console.error("Erro ao listar itens doados:", error)
      throw error
    }
  }

  // Doar item (atualizar situação para DOADO e adicionar beneficiário)
  static async doarItem(id: number, pessoabeneficiario: any): Promise<Item> {
    try {
      const item = await this.buscarPorId(id)
      const itemAtualizado = {
        ...item,
        situacao: "DOADO" as Situacao,
        pessoabeneficiario: pessoabeneficiario,
      }

      const response = await api.put(`${this.BASE_URL}/${id}`, itemAtualizado)
      return response.data
    } catch (error) {
      console.error("Erro ao doar item:", error)
      throw error
    }
  }

  // Vender item (atualizar situação para VENDIDO e adicionar beneficiário)
  static async venderItem(id: number, pessoabeneficiario?: any): Promise<Item> {
    try {
      const item = await this.buscarPorId(id)
      const itemAtualizado = {
        ...item,
        situacao: "VENDIDO" as Situacao,
        pessoabeneficiario: pessoabeneficiario,
      }

      const response = await api.put(`${this.BASE_URL}/${id}`, itemAtualizado)
      return response.data
    } catch (error) {
      console.error("Erro ao vender item:", error)
      throw error
    }
  }

  private static async buscarPorId(id: number): Promise<Item> {
    const response = await api.get(`${this.BASE_URL}/${id}`)
    return response.data
  }
}
