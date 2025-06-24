import type { Endereco } from "../types/Endereco"

export interface Beneficiario {
  id?: number
  nome: string
  cpf: string
  email?: string
  telefone: string
  endereco?: Endereco
  observacoes?: string
  data_cadastro?: string
}

// Para histórico de doações
export interface HistoricoDoacao {
  id?: number
  item_id: number
  beneficiario_id: number
  data_doacao: string
  observacoes?: string
  responsavel_social?: string
}
