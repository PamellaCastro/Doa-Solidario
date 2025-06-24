import api from "../../api"
import type { Beneficiario } from "../types/Beneficiario"

export class BeneficiarioService {
  private static readonly BASE_URL = "/beneficiario"

  static async listarTodos(): Promise<Beneficiario[]> {
    const response = await api.get(this.BASE_URL)
    return response.data
  }

  static async buscarPorId(id: number): Promise<Beneficiario> {
    const response = await api.get(`${this.BASE_URL}/${id}`)
    return response.data
  }

  static async buscarPorCpf(cpf: string): Promise<Beneficiario> {
    const response = await api.get(`${this.BASE_URL}/filtro?cpf=${cpf}`)
    return response.data
  }

  static async criar(beneficiario: Beneficiario): Promise<Beneficiario> {
    const response = await api.post(this.BASE_URL, beneficiario)
    return response.data
  }

  static async atualizar(id: number, beneficiario: Beneficiario): Promise<Beneficiario> {
    const response = await api.put(`${this.BASE_URL}/${id}`, beneficiario)
    return response.data
  }

  static async deletar(id: number): Promise<void> {
    await api.delete(`${this.BASE_URL}/${id}`)
  }

  static async buscar(termo: string): Promise<Beneficiario[]> {
    try {
      const beneficiarioPorCpf = await this.buscarPorCpf(termo)
      return [beneficiarioPorCpf]
    } catch {
      const todosBeneficiarios = await this.listarTodos()
      return todosBeneficiarios.filter(
        (beneficiario) =>
          beneficiario.nome.toLowerCase().includes(termo.toLowerCase()) ||
          beneficiario.cpf.includes(termo) ||
          (beneficiario.telefone && beneficiario.telefone.includes(termo)),
      )
    }
  }
}
