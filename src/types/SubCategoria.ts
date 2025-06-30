import type { Categoria } from "./Categoria"

export interface SubCategoria {
  id?: number
  descricao: string
  categoria: Categoria
}
