const dns = require('dns')
const {promisify} = require('util')

class Dns {
    static check(hostname, servers = ['8.8.8.8', '9.9.9.9']) {
        dns.setServers(servers)

        return new Promise((resolve, reject) => {
            dns.resolve4(hostname, (err, addresses) => {
                if (err) return reject(err)

                let address = addresses[0]

                return resolve({
                    filtered: !!address.match(/^10\.10\.34\./),
                    ip: address
                })
            })
        })
    }
}

module.exports = Dns