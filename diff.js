const LineByLineReader = require('line-by-line')
const csvWriter = require('csv-write-stream')
const fs = require('fs')

const allPath = process.argv[2]
const donePath = process.argv[3]
const diffPath = process.argv[4]

const doneLr = new LineByLineReader(donePath)

const writer = csvWriter({sendHeaders: false})
writer.pipe(fs.createWriteStream(diffPath))

const done = []

doneLr.on('line', line => {
    const csv = line.split(',')

    const rank = csv[0].trim()
    const hostname = csv[1]

    if (!rank.match(/\d+/)) {
        console.warn('invalid line:', line)
        return
    }

    done[rank] = hostname
})

doneLr.on('end', () => {
    const allLr = new LineByLineReader(allPath)
    
    allLr.on('line', line => {
        const csv = line.split(',')
        const rank = csv[0]
        const hostname = csv[1]

        if (!rank || !hostname) {
            console.warn('invalid line:', line)
            return
        }

        if (!done[rank]) {
            writer.write({rank, hostname})
        }
    })
})