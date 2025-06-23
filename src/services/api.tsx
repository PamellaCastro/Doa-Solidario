import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error)

    if (error.response?.status === 404) {
      throw new Error("Recurso não encontrado")
    } else if (error.response?.status === 500) {
      throw new Error("Erro interno do servidor")
    } else if (error.code === "ECONNABORTED") {
      throw new Error("Timeout na requisição")
    } else if (!error.response) {
      throw new Error("Erro de conexão com o servidor")
    }

    throw error
  },
)

export default api
