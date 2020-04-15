import { DbRef, MongoDbDatabases, MongoDbDatabase } from "@diginet/ds-mongodb"
import { NetworkNode, RpcServiceManager, SecureWebSocketTransport, TcpTransport, WebSocketTransport } from "@diginet/ds-nodes"
import { log, SeqLogger } from "@diginet/seq-logger"
import * as bodyParser from "body-parser"
import express from "express"
import nobots from "express-nobots"
import * as fs from "fs"
import * as https from "https"
import * as os from "os"
import * as path from "path"
import requestIp from "request-ip"
import { Authorization } from "./Authorization"
import { DataAccess } from "./DataAccess"

export class App {
    public node: NetworkNode
    public mongoDbDatabases?: MongoDbDatabases
    public app: express.Application
    public db?: DbRef
    public authorization?: Authorization
    public dataAccess?: DataAccess
    public logger: SeqLogger

    constructor(public host: string = "127.0.0.1", public portHTTP: number = 4080, public portHTTPS: number = 4443, public webFiles: string = path.join(__dirname, "../../agera-web/build")) {
        if (os.hostname() !== "Tokyo")
            this.webFiles = "./web"
        this.logger = new SeqLogger(os.hostname(), "agera-server", "1.0", "debug", process.env.EnvSeqLoggerApi ? process.env.EnvSeqLoggerApi : "http://" + host + ":5341")
        log.info("Using server host {host}", host)
        process
            .on("unhandledRejection", (reason, p) => {
                log.error("Unhandled Rejection at Promise", p)
            })
            .on("uncaughtException", err => {
                log.error("Uncaught exception: {error}", err)
            })
        this.app = express()
        this.config()
        this.app.use(nobots({ block: true }))

        const myLogger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const foo = () => {
                const clientIp = requestIp.getClientIp(req)
                log.debug("Request {Method}, URL {URL}, statusCode {statusCode}, client IP {clientIp}", req.method, req.url, res.statusCode, clientIp)
            }
            if (res.headersSent) {
                foo()
            } else {
                res.on("finish", () => {
                    foo()
                })
            }
            next()
        }
        this.app.use(myLogger)
        this.routes()

        const p80 = express()
        p80.use(nobots({ block: true }))
        // set up a route to redirect http root to https
        log.info("Redirecting port {http} to {https}", portHTTP, portHTTPS)
        p80.get("/", (req, res) => {
            if (req.protocol === "http") {
                // res.redirect("https://" + req.headers.host!.split(":")[0] + req.url)
                res.redirect("https://" + req.headers.host!.split(":")[0] + ":" + portHTTPS.toString() + req.url)
            }
        })
        p80.use("/.well-known/", express.static(".well-known"))
        log.info("HTTP server listening on port {port}", portHTTP)
        log.info("Using web files path \"{webFiles}\"", this.webFiles)
        p80.listen(portHTTP)

        log.info("Current dir {currentDir}", process.cwd())
        const server = https.createServer(
            {
                ca: fs.readFileSync(process.cwd() + "/chain.pem"),
                cert: fs.readFileSync(process.cwd() + "/cert.pem"),
                key: fs.readFileSync(process.cwd() + "/privkey.pem"),
            },
            this.app,
        )
        server.listen(portHTTPS, () => {
            log.info("HTTPS server listening on port {port}", portHTTPS)
        })

        /*
        const wsServer = https.createServer({
            ca: fs.readFileSync(process.cwd() + "/chain.pem"),
            cert: fs.readFileSync(process.cwd() + "/cert.pem"),
            key: fs.readFileSync(process.cwd() + "/privkey.pem"),
        })
        const webSocketPort = 4444
        wsServer.listen(webSocketPort, () => {
            log.info("WebSocket server listening on port {port}", webSocketPort)
        })
        */
        const networkNodeName = "server"
        log.info("Creating NetworkNode {networkNodeName}", networkNodeName)
        this.node = new NetworkNode(networkNodeName, [
            new SecureWebSocketTransport("0.0.0.0:" + portHTTPS, true, server)
        ])

        this.node.on("message", message => {
            log.debug("Message received: {message}", message)
        })
        this.node.on("sendMessage", message => {
            log.debug("Message sent: {message}", message)
        })
        this.node.on("connectRequest", (message, request) => {
            request.accept = true
            // request.rejectReason = "In bad mood!"
            log.debug("connectRequest with credentials {credentials}, accept: {accept}" + (request.rejectReason ? ", reject reason: {rejectReason}" : ""), request.credentials, request.accept, request.rejectReason)
        })
        this.init()
    }

    private async init() {
        if (os.hostname() !== "Tokyo")
            MongoDbDatabase.mongoUrl = "mongodb://mongo:27017"
        this.mongoDbDatabases = new MongoDbDatabases()
        const databaseName = "agera"
        try {
            log.info("Opening database \"{databaseName}\"", databaseName)
            if (true /* os.hostname() === "Tokyo" */) {
                this.db = await this.mongoDbDatabases.openDatabase(databaseName)
            } else {
                // this.db = await this.mongoDbDatabases.openDatabase(databaseName, "admin", "sumdum98")
            }
        } catch (ex) {
            log.error(ex, "Failed to open database")
        }
        if (this.db) {
            try {
                this.dataAccess = new DataAccess(this.db, this.mongoDbDatabases)
                await this.dataAccess.initDone
                this.dataAccess.AddOrUpdateItem("test", undefined, undefined, { hello: "world" })
                this.authorization = new Authorization(this.db, this.mongoDbDatabases)
                const rpcMan = new RpcServiceManager(this.node)
                rpcMan.addServiceProvider(this.mongoDbDatabases, { requireConnect: true })
                rpcMan.addServiceProvider(this.authorization!, { requireConnect: true })
                rpcMan.addServiceProvider(this.dataAccess!, { requireConnect: true })
                await this.node.open()
            } catch (ex) {
                log.error(ex, "Failed initialising database")
            }
        }
    }

    private config(): void {
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: false }))
    }

    private routes(): void {
        const router = express.Router()

        this.app.use("/json", router)
        this.app.use("/", /*jwt({secret: "Sunny98"}),*/ express.static(this.webFiles))
    }
}
