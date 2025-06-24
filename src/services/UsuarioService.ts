import api from "../../api"
import type { Usuario } from "../types/Usuario"

export class UsuarioService {
  private static readonly BASE_URL = "/usuario"

  static async listarTodos(): Promise<Usuario[]> {
    const response = await api.get(this.BASE_URL)
    return response.data
  }

  static async buscarPorId(id: number): Promise<Usuario> {
    const response = await api.get(`${this.BASE_URL}/${id}`)
    return response.data
  }

  static async criar(usuario: Usuario): Promise<Usuario> {
    const response = await api.post(this.BASE_URL, usuario)
    return response.data
  }

  static async atualizar(id: number, usuario: Usuario): Promise<Usuario> {
    const response = await api.put(`${this.BASE_URL}/${id}`, usuario)
    return response.data
  }

  static async deletar(id: number): Promise<void> {
    await api.delete(`${this.BASE_URL}/${id}`)
  }

  // Métodos adicionais úteis
  static async buscarPorEmail(email: string): Promise<Usuario | null> {
    try {
      const usuarios = await this.listarTodos()
      return usuarios.find((u) => u.email === email) || null
    } catch (error) {
      console.error("Erro ao buscar usuário por email:", error)
      return null
    }
  }

  static async buscarPorCpf(cpf: number): Promise<Usuario | null> {
    try {
      const usuarios = await this.listarTodos()
      return usuarios.find((u) => u.cpf === cpf) || null
    } catch (error) {
      console.error("Erro ao buscar usuário por CPF:", error)
      return null
    }
  }

  static async validarLogin(email: string, senha: string): Promise<Usuario | null> {
    try {
      const usuario = await this.buscarPorEmail(email)
      if (usuario && usuario.senha === senha) {
        return usuario
      }
      return null
    } catch (error) {
      console.error("Erro ao validar login:", error)
      return null
    }
  }
}
