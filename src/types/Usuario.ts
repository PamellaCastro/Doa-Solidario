export interface Usuario {
  id?: number
  nome: string
  cpf: number
  dataNascimento: string
  email: string
  senha: string
  perfilAcesso: PerfilAcesso
}

export enum PerfilAcesso {
  ADMIN = "ADMIN",
  MD_ELETRONICO = "MD_ELETRONICO",
  MD_ELETRODOMESTICO = "MD_ELETRODOMESTICO",
  MD_TEXTIL = "MD_TEXTIL",
  MD_MOVEL = "MD_MOVEL",
  MD_SOCIAL = "MD_SOCIAL",
}
