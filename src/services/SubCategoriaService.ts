import api from "../../api"
import { Categoria } from "../types/Categoria"
import type { SubCategoria, } from "../types/SubCategoria"

export class SubCategoriaService {
  private static readonly BASE_URL = "/sub"

  static async listarTodos(): Promise<SubCategoria[]> {
    const response = await api.get(this.BASE_URL)
    return response.data
  }

    static async listarPorCategoria(categoria: Categoria): Promise<SubCategoria[]> {
    // Exemplo: se você tiver um endpoint como /api/sub?categoria=ELETRONICO
    const response = await api.get(`${this.BASE_URL}?categoria=${categoria}`);
    return response.data;
  }

  static async buscarPorId(id: number): Promise<SubCategoria> {
    const response = await api.get(`${this.BASE_URL}/${id}`)
    return response.data
  }

  static async criar(subCategoria: SubCategoria): Promise<SubCategoria> {
    const response = await api.post(this.BASE_URL, subCategoria)
    return response.data
  }

  static async atualizar(id: number, subCategoria: SubCategoria): Promise<SubCategoria> {
    const response = await api.put(`${this.BASE_URL}/${id}`, subCategoria)
    return response.data
  }

  static async deletar(id: number): Promise<void> {
    await api.delete(`${this.BASE_URL}/${id}`)
  }
}
