import type { Categoria } from "./Item"

export interface SubCategoria {
  id?: number
  descricao: string
  categoria: Categoria
}
