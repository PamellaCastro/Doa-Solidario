import axios from "axios"
import type { Item } from "../types/Item"
import type { Categoria, Situacao } from "../types/Item"

const API_BASE_URL = "http://localhost:8080/api"

export class SocialService {
  private static baseURL = `${API_BASE_URL}/item`

  // Listar apenas itens DEPOSITADOS para página social
  static async listarItensDisponiveis(categoria?: Categoria): Promise<Item[]> {
    try {
      const params = new URLSearchParams()
      if (categoria) params.append("categoria", categoria)
      params.append("situacao", "DEPOSITADO") // Sempre filtrar por DEPOSITADO

      const url = `${this.baseURL}?${params.toString()}`
      const response = await axios.get(url)
      return response.data
    } catch (error) {
      console.error("Erro ao listar itens disponíveis:", error)
      throw error
    }
  }

  // Doar item (atualizar situação para DOADO)
  static async doarItem(id: number, beneficiario?: any): Promise<Item> {
    try {
      const item = await this.buscarPorId(id)
      const itemAtualizado = {
        ...item,
        situacao: "DOADO" as Situacao,
        pessoabeneficiario: beneficiario,
      }

      const response = await axios.put(`${this.baseURL}/${id}`, itemAtualizado)
      return response.data
    } catch (error) {
      console.error("Erro ao doar item:", error)
      throw error
    }
  }

  // Vender item (atualizar situação para VENDIDO)
  static async venderItem(id: number, beneficiario?: any): Promise<Item> {
    try {
      const item = await this.buscarPorId(id)
      const itemAtualizado = {
        ...item,
        situacao: "VENDIDO" as Situacao,
        pessoabeneficiario: beneficiario,
      }

      const response = await axios.put(`${this.baseURL}/${id}`, itemAtualizado)
      return response.data
    } catch (error) {
      console.error("Erro ao vender item:", error)
      throw error
    }
  }

  private static async buscarPorId(id: number): Promise<Item> {
    const response = await axios.get(`${this.baseURL}/${id}`)
    return response.data
  }
}
