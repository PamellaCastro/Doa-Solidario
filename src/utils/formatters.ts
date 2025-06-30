export const formatCpf = (cpf: string): string => {
  return cpf
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1")
}

export const formatCep = (cep: string): string => {
  return cep
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1")
}

export const formatCurrency = (value: string): string => {
  // Remove tudo que não é dígito
  const onlyNumbers = value.replace(/\D/g, "")

  // Converte para número e divide por 100 para ter centavos
  const numericValue = Number(onlyNumbers) / 100

  // Formata como moeda brasileira
  return numericValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

export const parseCurrencyToNumber = (value: string): number => {
  const onlyNumbers = value.replace(/\D/g, "")
  return Number(onlyNumbers) / 100
}

export const formatCategoryName = (category: string): string => {
  const categoryMap: Record<string, string> = {
    ELETRONICO: "Eletrônico",
    ELETRODOMESTICO: "Eletrodoméstico",
    MOVEL: "Móvel",
    TEXTIL: "Têxtil",
  }

  return categoryMap[category] || category
}
