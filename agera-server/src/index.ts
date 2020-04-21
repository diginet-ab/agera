import Log from './Seq'
import { startServer } from "./Server"
import { startWebServer } from './WebServer'
import { connectToAiEngine } from './AiEngine'

async function init() {
    let rpc = {
        hej() {
            console.log('Hellow world!')
        }
    }

    const aiEngine = (await connectToAiEngine()).client

    let httpServer = startWebServer()
    startServer([{ name: 'test', rpc }], httpServer)
}

init().catch(reason => {
    Log.error('Initialization of agera-server failed. {error}', reason)
    setTimeout(() => {
        process.exit()
    }, 3000)
})
