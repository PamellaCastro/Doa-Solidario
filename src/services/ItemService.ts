import api from "./api"
import type { Item, Categoria } from "../types/Item"

export class ItemService {
  private static readonly BASE_URL = "/item"

  static async listarTodos(categoria?: Categoria): Promise<Item[]> {
    const url = categoria ? `${this.BASE_URL}?categoria=${categoria}` : this.BASE_URL
    const response = await api.get(url)
    return response.data
  }

  static async buscarPorId(id: number): Promise<Item> {
    const response = await api.get(`${this.BASE_URL}/${id}`)
    return response.data
  }

  static async criar(item: Item): Promise<Item> {
    const response = await api.post(this.BASE_URL, item)
    return response.data
  }

  static async atualizar(id: number, item: Item): Promise<Item> {
    const response = await api.put(`${this.BASE_URL}/${id}`, item)
    return response.data
  }

  static async deletar(id: number): Promise<void> {
    await api.delete(`${this.BASE_URL}/${id}`)
  }
}
