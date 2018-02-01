const dnsd = require('dnsd')
const http = require('http')
const tls = require('tls')
const fs = require('fs')

const config = {
    dns: {
        port: process.env.DNS_PORT || 53,
        host: process.env.DNS_HOST || '0.0.0.0',
    },
    http: {
        port: process.env.HTTP_PORT || 80,
        host: process.env.HTTP_HOST || '0.0.0.0',
    },
    tls: {
        port: process.env.TLS_PORT || 443,
        host: process.env.TLS_HOST || '0.0.0.0',
    }
}

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt'),
}

// run dns server
dnsd.createServer((req, res) => {
    res.end('1.2.3.4')
}).listen(config.dns.port, config.dns.host, () => {
    console.log(`DNS server is listening on ${config.dns.host}:${config.dns.port}`)
})

// run http server
http.createServer((req, res) => {
    console.log('connected:', req.connection.remoteAddress)
    console.log('host:', req.headers.host)
    res.end('OK')
}).listen(config.http.port, config.http.host, () => {
    console.log(`HTTP server is listening on ${config.http.host}:${config.http.port}`)
})

// run tls server
tls.createServer(options, (socket) => {
    socket.end('OK');
}).listen(config.tls.port, config.tls.host, () => {
    console.log(`TLS server is listening on ${config.tls.host}:${config.tls.port}`)
})