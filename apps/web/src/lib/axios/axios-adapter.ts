import { CreateAxiosDefaults, AxiosStatic, AxiosInstance } from 'axios'
import { TupleInterceptResponseAdapter } from './axios-interceptor-response-adapter'

import { AxiosInterceptorsAdapter } from './axios-interceptors-adapter'

interface AxiosAdapterMethods {
  create(config: CreateAxiosDefaults): AxiosInstance
}

export class AxiosAdapter implements AxiosAdapterMethods {
  private readonly intecerptors = new AxiosInterceptorsAdapter()

  public constructor(private readonly axios: AxiosStatic) {}

  public create(config: CreateAxiosDefaults) {
    const api = this.axios.create(config)
    api.interceptors.response.use(
      this.intecerptors.response.onInterceptSuccess,
      this.intecerptors.response.onInterceptError
    )
    return api
  }
}
