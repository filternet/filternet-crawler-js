const dns = require('dns')
const {promisify} = require('util')

class Dns {
    static check(hostname, servers = ['8.8.8.8', '9.9.9.9']) {
        dns.setServers(servers)

        return new Promise((resolve, reject) => {
            dns.resolve4(hostname, (err, addresses) => {
                if (err) return reject(err)

                if (addresses.length === 0 || !addresses[0]) {
                    return reject(new Error(`Dns result is empty for ${hostname}`))
                }

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