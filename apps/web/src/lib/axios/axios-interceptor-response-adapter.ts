import {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosResponseHeaders,
  RawAxiosResponseHeaders,
} from 'axios'

export interface AxiosResponseErrorAdapter {
  ok: boolean
  data?: any
  status?: number
  statusText?: string
  headers?: AxiosResponseHeaders
  config?: AxiosRequestConfig
  request?: any
}

export interface AxiosResponseSuccessAdapter<T = any, D = any> {
  ok: boolean
  data: T
  status: number
  statusText: string
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders
  config: AxiosRequestConfig<D>
  request?: any
}

interface AxiosInterceptorResponseAdapterMethods {
  onInterceptSuccess(response: AxiosResponse): AxiosResponseSuccessAdapter
  onInterceptError(error: AxiosError): AxiosResponseErrorAdapter
}

export type TupleInterceptResponseAdapter = [
  (response: AxiosResponse) => AxiosResponseSuccessAdapter,
  (error: AxiosError) => AxiosResponseErrorAdapter
]

export class AxiosInterceptorResponseAdapter
  implements AxiosInterceptorResponseAdapterMethods
{
  public onInterceptSuccess(
    response: AxiosResponse
  ): AxiosResponseSuccessAdapter {
    return {
      ...response,
      ok: true,
    }
  }
  public onInterceptError(error: AxiosError): AxiosResponseErrorAdapter {
    const response = error?.response || {}
    return {
      ...response,
      ok: false,
    }
  }
}
