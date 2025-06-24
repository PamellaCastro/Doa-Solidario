import api from "../../api"
import type { Endereco } from "../types/Endereco"

export class EnderecoService {
  private static readonly BASE_URL = "/endereco"

  static async listarTodos(): Promise<Endereco[]> {
    const response = await api.get(this.BASE_URL)
    return response.data
  }

  static async buscarPorId(id: number): Promise<Endereco> {
    const response = await api.get(`${this.BASE_URL}/${id}`)
    return response.data
  }

  static async criar(endereco: Endereco): Promise<Endereco> {
    const response = await api.post(this.BASE_URL, endereco)
    return response.data
  }

  static async atualizar(id: number, endereco: Endereco): Promise<Endereco> {
    const response = await api.put(`${this.BASE_URL}/${id}`, endereco)
    return response.data
  }

  static async deletar(id: number): Promise<void> {
    await api.delete(`${this.BASE_URL}/${id}`)
  }
}
