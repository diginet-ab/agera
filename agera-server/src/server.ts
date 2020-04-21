import * as path from "path"
import { App } from "./App"

let host: string | undefined
let portHTTP: number | undefined
let portHTTPS: number | undefined
let webFiles: string | undefined

if (process.argv.length > 2) {
    host = process.argv[2]
}

if (process.argv.length > 3) {
    portHTTP = parseInt(process.argv[3], 10)
}

if (process.argv.length > 4) {
    portHTTPS = parseInt(process.argv[4], 10)
}

if (process.argv.length > 5) {
    webFiles = process.argv[5]
}

const start = async () => {
    await new Promise(r => setTimeout(r, 10000));
    const app = new App(host, portHTTP, portHTTPS, webFiles)
   
}
start()
