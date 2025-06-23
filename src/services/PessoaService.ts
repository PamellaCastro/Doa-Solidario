import api from "./api"
import type { Pessoa } from "../types/Pessoa"

export class PessoaService {
  private static readonly BASE_URL = "/pessoa"

  static async listarTodos(): Promise<Pessoa[]> {
    const response = await api.get(this.BASE_URL)
    return response.data
  }

  static async buscarPorId(id: number): Promise<Pessoa> {
    const response = await api.get(`${this.BASE_URL}/${id}`)
    return response.data
  }

  static async buscarPorCpf(cpf: string): Promise<Pessoa> {
    const response = await api.get(`${this.BASE_URL}/filtro?cpf=${cpf}`)
    return response.data
  }

  static async criar(pessoa: Pessoa): Promise<Pessoa> {
    const response = await api.post(this.BASE_URL, pessoa)
    return response.data
  }

  static async atualizar(id: number, pessoa: Pessoa): Promise<Pessoa> {
    const response = await api.put(`${this.BASE_URL}/${id}`, pessoa)
    return response.data
  }

  static async deletar(id: number): Promise<void> {
    await api.delete(`${this.BASE_URL}/${id}`)
  }

  // Método para buscar pessoas por nome ou CPF
  static async buscar(termo: string): Promise<Pessoa[]> {
    try {
      // Primeiro tenta buscar por CPF exato
      const pessoaPorCpf = await this.buscarPorCpf(termo)
      return [pessoaPorCpf]
    } catch {
      // Se não encontrar por CPF, busca todas e filtra por nome
      const todasPessoas = await this.listarTodos()
      return todasPessoas.filter(
        (pessoa) => pessoa.nome.toLowerCase().includes(termo.toLowerCase()) || pessoa.cpf.includes(termo),
      )
    }
  }
}
