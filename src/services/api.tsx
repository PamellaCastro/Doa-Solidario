import axios from 'axios'

const api = axios.create({
  baseURL: 'localhost do backend',
  timeout: 10000,
})

export default api
