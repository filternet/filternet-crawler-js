const http = require('http')
const net = require('net');

class Http {
    static check(hostname, mockServer = {host: '127.0.0.1', port: 8080}) {
        const options = {
            hostname: mockServer.host,
            port: mockServer.port || 80,
            headers: {
                host: hostname
            },
            timeout: 7
        }

        return new Promise((resolve, reject) => {
            http.get(options, res => {

                res.setEncoding('utf8');
                let rawData = '';

                res.on('data', (chunk) => { rawData += chunk; });
                res.on('end', () => {

                    let filtered = false

                    if (rawData.match(/10\.10\.34\./) && res.statusCode === 403) {
                        filtered = true
                    }

                    return resolve({
                        filtered,
                        status: res.statusCode,
                        body: rawData,
                        headers: res.headers
                    })
                });

            }).on('error', err => reject(err));
        })
    }
}

module.exports = Http