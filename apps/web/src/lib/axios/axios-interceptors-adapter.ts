import { AxiosInterceptorResponseAdapter } from './axios-interceptor-response-adapter'
import { AxiosInterceptorRequestAdapter } from './axios-interceptor-request-adapter'

interface AxiosInterceptorsAdapterComputedProps {
  response: AxiosInterceptorResponseAdapter
  request: AxiosInterceptorRequestAdapter
}

export class AxiosInterceptorsAdapter
  implements AxiosInterceptorsAdapterComputedProps
{
  get response() {
    return new AxiosInterceptorResponseAdapter()
  }
  get request() {
    return new AxiosInterceptorRequestAdapter()
  }
}
