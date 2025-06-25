import type { Pessoa } from "./Pessoa"
import type { SubCategoria } from "./SubCategoria"

export interface Item {
  id?: number
  descricao: string
  data_cadastro?: string
  quantidade: number
  valor?: number // Agora opcional
  caminhao?: boolean
  anexo?: string
  categoria: Categoria
  estadoConservacao: EstadoConservacao
  situacao: Situacao
  subCategoria?: SubCategoria // Backend tem relacionamento obrigatório
  pessoadoador?: Pessoa // Nova estrutura do backend
  pessoabeneficiario?: Pessoa // Nova estrutura do backend

  // Manter compatibilidade temporária
  pessoa?: Pessoa
}

export enum Categoria {
  ELETRONICO = "ELETRONICO",
  ELETRODOMESTICO = "ELETRODOMESTICO",
  TEXTIL = "TEXTIL",
  MOVEL = "MOVEL",
}

export enum EstadoConservacao {
  BOM = "BOM",
  REGULAR = "REGULAR",
  RUIM = "RUIM",
}

export enum Situacao {
  ABERTO = "ABERTO",
  EM_ANDAMENTO = "EM_ANDAMENTO",
  DEPOSITADO = "DEPOSITADO",
  VENDIDO = "VENDIDO",
  SOLICITADO = "SOLICITADO",
  DOADO = "DOADO",
}
