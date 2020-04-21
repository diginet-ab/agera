import express from 'express'
import * as https from 'https'
import * as fs from 'fs'
import * as path from 'path'
import * as bodyParser from 'body-parser'
import nobots from 'express-nobots'
import log from './Seq'
import requestIp from 'request-ip'

export function startWebServer() {
    let portHTTP = 4080
    let portHTTPS = 4443

    const app = express()
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(nobots({ block: true }))

    const myLogger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const foo = () => {
            const clientIp = requestIp.getClientIp(req)
            log.debug(
                'Request {Method}, URL {URL}, statusCode {statusCode}, client IP {clientIp}',
                req.method,
                req.url,
                res.statusCode,
                clientIp
            )
        }
        if (res.headersSent) {
            foo()
        } else {
            res.on('finish', () => {
                foo()
            })
        }
        next()
    }
    app.use(myLogger)

    const router = express.Router()

    const webFiles = path.join(__dirname, '../../agera-web/build')

    app.use('/json', router)
    app.use('/', /*jwt({secret: "Sunny98"}),*/ express.static(webFiles))

    const p80 = express()
    p80.use(nobots({ block: true }))
    // set up a route to redirect http root to https
    log.info('Redirecting port {http} to {https}', portHTTP, portHTTPS)
    p80.get('/', (req, res) => {
        if (req.protocol === 'http') {
            // res.redirect("https://" + req.headers.host!.split(":")[0] + req.url)
            res.redirect('https://' + req.headers.host!.split(':')[0] + ':' + portHTTPS.toString() + req.url)
        }
    })
    p80.use('/.well-known/', express.static('.well-known'))
    log.info('HTTP server listening on port {port}', portHTTP)
    log.info('Using web files path "{webFiles}"', webFiles)
    p80.listen(portHTTP)

    log.info('Current dir {currentDir}', process.cwd())
    const server = https.createServer(
        {
            ca: fs.readFileSync(process.cwd() + '/chain.pem'),
            cert: fs.readFileSync(process.cwd() + '/cert.pem'),
            key: fs.readFileSync(process.cwd() + '/privkey.pem')
        },
        app
    )
    server.listen(portHTTPS, () => {
        log.info('HTTPS server listening on port {port}', portHTTPS)
    })

    return server
}
