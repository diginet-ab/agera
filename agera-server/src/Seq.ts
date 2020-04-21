import { SeqLogger } from '@diginet/seq-logger'
import * as os from 'os'

export default new SeqLogger(
    os.hostname(),
    'agera-server',
    '1.0',
    'debug',
    process.env.EnvSeqLoggerApi ? process.env.EnvSeqLoggerApi : 'http://127.0.0.1:5341'
)
