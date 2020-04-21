import { IAiEngineRpc } from '@diginet/ai-engine'
import { RpcClient, JsonStringifier, WebSocketTransport, JsonParser } from '@diginet/ds-nodes'
import Logger from './Seq'

export async function connectToAiEngine(): Promise<{ client: IAiEngineRpc }> {
    Logger.info('Connecting to ai-engine..')

    let rpcClient = new RpcClient([])
    let stringifier = JsonStringifier([rpcClient])
    let transport = new WebSocketTransport([stringifier], {
        address: 'ws://ai-engine.default.svc.cluster.local:3000',
        wsOpenTimeout: 5000
    })
    let parser = JsonParser([transport])
    parser.pipe(rpcClient)

    await new Promise(resolve => {
        transport.on('ws_open', () => resolve())
    })

    Logger.info('Connected to ai-engine!')

    return { client: rpcClient.api('AiEngineRpc') }
}