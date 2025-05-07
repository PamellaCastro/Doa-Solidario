import api from "./api"

export const getEletronicos = async () => {
  const response = await api.get("/eletronicos")
  return response.data
}

export const createEletronico = async (item: any) => {
  const response = await api.post("/eletronicos", item)
  return response.data
}

export const updateEletronico = async (id: number, item: any) => {
  const response = await api.put(`/eletronicos/${id}`, item)
  return response.data
}

export const deleteEletronico = async (id: number) => {
  const response = await api.delete(`/eletronicos/${id}`)
  return response.data
}

export const getEletronicoById = async (id: number) => {
  const response = await api.get(`/eletronicos/${id}`)
  return response.data
}

// ELETRODOMÉSTICOS

export const getEletrodomesticos = async () => {
  const response = await api.get("/eletrodomesticos")
  return response.data
}

export const createEletrodomestico = async (item: any) => {
  const response = await api.post("/eletrodomesticos", item)
  return response.data
}

export const updateEletrodomestico = async (id: number, item: any) => {
  const response = await api.put(`/eletrodomesticos/${id}`, item)
  return response.data
}

export const deleteEletrodomestico = async (id: number) => {
  const response = await api.delete(`/eletrodomesticos/${id}`)
  return response.data
}

export const getEletrodomesticoById = async (id: number) => {
  const response = await api.get(`/eletrodomesticos/${id}`)
  return response.data
}
