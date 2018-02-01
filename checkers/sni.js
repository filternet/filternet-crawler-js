const tls = require('tls')
const fs = require('fs')

class Sni {
    static check(hostname, ca, mockServer = undefined) {
        if (!mockServer) {
            mockServer = {
                host: '127.0.0.1',
                port: 8443,
            }
        }

        let cn = '';

        const options = {
            host: mockServer.host,
            port: mockServer.port || 443,
            rejectUnauthorized: false,
            servername: hostname,
            checkServerIdentity: (servername, cert) => {
                cn = cert.subject.CN

                return undefined
            },
            ca: ca,
            handshakeTimeout: 7000,
        }

        return new Promise((resolve, reject) => {
            const socket = tls.connect(options, () => {
                socket.end()

                return resolve({
                    cn: cn,
                    filtered: false,
                })
            })

            socket.on('error', err => {
                if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') {
                    return resolve({
                        filtered: true,
                        error: err.code
                    })
                }

                return reject(err)
            })
        })
    }
}

module.exports = Sni