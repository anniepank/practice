const http = require('http')
const fs = require('fs')
const path = require('path')
const pathExists = require('path-exists')

function onRequest(req, res) {
    console.log(req.url)
    let filePath = ''

    if (req.url === '/?') {
        filePath = 'public/index.html'
    } else {
        filePath = 'public' + req.url
    }

    res.write(fs.readFileSync(filePath, 'utf8'))

    res.end()
}

let server = http.createServer(onRequest).listen(3000)
