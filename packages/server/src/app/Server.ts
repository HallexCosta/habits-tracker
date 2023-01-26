interface HTTPServer {
  get(...rest: any[]): Promise<string> | string
  post(): Promise<string> | string
}

interface ServerDeps {
  httpServer: HTTPServer 
  port: number
}

export class Server {
  private readonly httpServer: HTTPServer
  private readonly port: number

  public constructor(deps: ServerDeps) {
    Object.assign(this, deps)
  }

  static initialize(dependencies: ServerDeps) {
    const server = new Server(dependencies) 
    return server
  }

  get(...rest: any) {
    this.httpServer.get(...rest)
  }

  onListen() {
    console.log('> Server listening at port', this.port)
  }

  listen() {
    this.httpServer.listen({
      port: this.port
    }, this.onListen.(bind(this)))
  }
}
