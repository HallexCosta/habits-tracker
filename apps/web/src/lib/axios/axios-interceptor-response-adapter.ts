import {
  AxiosError,
  AxiosResponse,
  AxiosResponseHeaders,
  RawAxiosResponseHeaders,
} from 'axios'

export interface AxiosResponseErrorAdapter<T = any> extends AxiosError {
  ok: boolean
  data: T
  status: number
  statusText: string
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders
  request?: any
}

export interface AxiosResponseSuccessAdapter<T = any> extends AxiosResponse {
  ok: boolean
  data: T
  status: number
  statusText: string
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders
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
    const response = error.response || {}
    return {
      ...response,
      ok: false,
    } as AxiosResponseErrorAdapter
  }
}
