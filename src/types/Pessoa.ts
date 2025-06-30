import type { Endereco } from "./Endereco"

export interface Pessoa {
  id?: number
  nome: string
  cpf: string
  email: string
  endereco?: Endereco // OneToOne
}
