import axios, { AxiosResponse } from 'axios'

declare module 'axios' {
  interface AxiosResponse {
    ok: boolean
  }
}
