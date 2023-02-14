import { AxiosAdapter } from './axios-adapter'
import axios from 'axios'

export * from './axios-interceptor-response-adapter'

const axiosAdapter = new AxiosAdapter(axios)
console.log(import.meta.env.VITE_API_HOST)
export const api = axiosAdapter.create({
  baseURL: import.meta.env.VITE_API_HOST,
})
