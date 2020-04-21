import * as fs from 'fs'

let mongoUrl = fs.readFileSync('/etc/mongodb-connection-string/mongodb-connection-string').toString()

// Connect to mongo