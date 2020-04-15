import * as path from "path"
import { App } from "./App"

let host
let portHTTP
let portHTTPS
let webFiles

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

const app = new App(host, portHTTP, portHTTPS, webFiles)
