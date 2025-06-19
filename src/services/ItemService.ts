import axios from "axios";

const API_URL = "http://localhost:8080/api/item";

// Tipo para categoria
export type Categoria = "ELETRONICO" | "MOVEL" | "ELETRODOMESTICO" | "TEXTIL";

export interface Item {
  id?: number;
  descricao: string;
  data_cadastro?: string;
  quantidade: number;
  valor: number;
  caminhao: string;
  categoria: Categoria;
  estadoConservacao: string;
  situacao: string;
}

// Obter todos os itens de uma categoria específica
export const getItens = async (categoria: Categoria): Promise<Item[]> => {
  const response = await axios.get(`${API_URL}?categoria=${categoria}`);
  return response.data;
};

// Obter item por ID
export const getItemById = async (id: number): Promise<Item> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Criar novo item (agora aceita um objeto Item diretamente)
export const createItem = async (item: Item): Promise<Item> => {
  // axios já define Content-Type: application/json automaticamente quando envia um objeto JS
  const response = await axios.post(API_URL, item);
  return response.data;
};

// Atualizar item
export const updateItem = async (id: number, item: Item): Promise<Item> => {
  const response = await axios.put(`${API_URL}/${id}`, item);
  return response.data;
};

// Excluir item
export const deleteItem = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};