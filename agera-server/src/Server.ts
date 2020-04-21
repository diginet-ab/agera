import { WebSocketServer, RpcServer, Converter, TryCatch } from '@diginet/ds-nodes'

import * as jsonBuffer from 'json-buffer'

import * as https from 'https'

let server: WebSocketServer

export function startServer(services: { rpc: any; name: string }[], httpServer: https.Server) {
    server = new WebSocketServer([], { wsOptions: { host: '0.0.0.0', port: 4443, server: httpServer } })
    let parser = new Converter([server], message => {
        try {
            return { source: message.source, message: jsonBuffer.parse(message.message.toString()) }
        } catch {
            return
        }
    })

    let rpcServer = new RpcServer([parser])
    let stringifier = new Converter([rpcServer], message => {
        return { target: message.target, message: jsonBuffer.stringify(message.message) }
    })
    // Try to send the message back. If we fail (the client disconnected), do nothing.
    let tryCatch = new TryCatch([stringifier])
    tryCatch.pipe(server)

    function expose(instance: any, serviceName: string) {
        // When an event is emitted, send it over the RPC channel
        if (instance.emit) {
            let oldEmit = instance.emit ? instance.emit.bind(instance) : null
            instance.emit = (event: string, ...params: any[]) => {
                server.getTargets().forEach(target => {
                    rpcServer.sendEvent(serviceName, target, event, params)
                })
                if (oldEmit) {
                    return oldEmit(event, ...params)
                }
                return true
            }
        }

        if (instance.constructor.name === 'Object') {
            rpcServer.rpc.exposeObject(instance, serviceName)
        } else {
            rpcServer.rpc.exposeClassInstance(instance, serviceName)
        }
    }

    services.forEach(service => {
        expose(service.rpc, service.name)
    })
}

export function closeServer() {
    server && server.close()
}
