import { AxiosError } from 'axios'

class InterceptResponse {}

/**
 * Intercept responses and errors
 * AxiosError should return only response and new property "ok" with false
 * AxiosResponse should return new property "ok" with true
 */
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return {
      ...response,
      ok: true,
    }
  },
  (error: AxiosError) => {
    return {
      ...error.response,
      ok: false,
    }
  }
)

export { api }
