const dns = require('./checkers/dns')
const http = require('./checkers/http')
const sni = require('./checkers/sni')
const fs = require('fs')
const PQueue = require('p-queue')
const LineByLineReader = require('line-by-line')
const csvWriter = require('csv-write-stream')

const filePath = process.argv[2]
const concurrencyLimit = parseInt(process.argv[3] || 10)
const concurrencyPendingLimit = concurrencyLimit * 10
const reportPath = process.argv[4] || `${__dirname}/out.csv`

const queue = new PQueue({ concurrency: concurrencyLimit })
const ca = fs.readFileSync(`${__dirname}/ca.pem`)

const lr = new LineByLineReader(filePath)

const writer = csvWriter()
writer.pipe(fs.createWriteStream(reportPath))

lr.on('line', (line) => {
    const csv = line.split(',')
    const rank = csv[0]
    const hostname = csv[1]

    if (!rank || !hostname) {
        console.warn(`invalid line ${rank},${hostname}`)
        return
    }

    queue.add(createTask(rank, hostname))

    if (queue.size >= concurrencyPendingLimit) {
        console.log('reader is paused')
        lr.pause()
    }
})

let interval = setInterval(() => {
    if (queue.size < concurrencyPendingLimit) {
        console.log('reader is resumed')
        lr.resume();
    }
}, 500)

lr.on('end', () => {
    console.log('All lines are read, file is closed now.')
    clearInterval(interval)
})

function createTask(rank, hostname) {
    return async () => {
        try {
            const result = await Promise.all([
                dns.check(hostname, [process.env.DNS_HOST]),
                http.check(hostname, { host: process.env.HTTP_HOST }),
                sni.check(hostname, ca, { host: process.env.TLS_HOST })
            ])

            const dnsResult = result[0]
            const httpResult = result[1]
            const sniResult = result[2]

            const data = {
                rank,
                hostname,
                dns: !dnsResult.filtered && dnsResult.ip === '1.2.3.4',
                dns_ip: dnsResult.filtered ? dnsResult.ip : '',
                http: !httpResult.filtered && httpResult.body === 'OK',
                http_status: httpResult.status,
                sni: !sniResult.filtered && sniResult.cn === '1.2.3.4',
                sni_error: sniResult.error || '',
            }

            console.log(data)
            writer.write(data)
        } catch (err) {
            queue.pause()
            console.log('queue is paused:', err);

            queue.add(createTask(rank, hostname))

            setTimeout(() => {
                queue.start()
                console.log('queue is resumed')
            }, 5000)
        }
    }
}