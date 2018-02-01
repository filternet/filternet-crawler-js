const dns = require('./checkers/dns')
const http = require('./checkers/http')
const sni = require('./checkers/sni')
const fs = require('fs')

const ca = fs.readFileSync(`${__dirname}/ca.pem`)
const hostname = process.argv[2]
const server = process.env.MOCK_SERVER || '127.0.0.1'

dns.check(hostname, [server])
    .then(result => console.log('dns:', result))

http.check(hostname, {host: server})
    .then(result => console.log('http:', result))

sni.check(hostname, ca, {host: server})
    .then(result => console.log('sni:', result))
