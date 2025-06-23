import type { Endereco } from "./Endereco"

// Interface corrigida para ser compatível com o backend
export interface Pessoa {
  id?: number
  nome: string
  cpf: string
  email: string
  endereco?: Endereco // OneToOne relationship
}
