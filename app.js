const http = require('http')
const fs = require('fs')
const url = require('url')
const multiparty = require('multiparty')
const express = require('express')
const app = express()
const router = require('./router.js')
const bodyParser = require('body-parser')

app.listen(3000, () => {
    console.log('app started')
})

app.use(bodyParser.json())
app.use('/', router)
app.use(express.static(__dirname + '/public'))


/*
function onRequest(req, res) {
    console.log(req.url)

    let filePath = ''
    let path = new url.URL('http://host' + req.url).pathname

    if (path === '/') {
        filePath = 'public/index.html'
    } else if (path === '/upload') {
        let form = new multiparty.Form();

        form.parse(req, function (err, fields, files) {
            let newName = Date.now().toString() + '.' + files.file[0].originalFilename.split('.')[1]
            fs.rename(files.file[0].path, './public/images/' + newName, (err) => {
                if (err) {
                    console.log("problems with renaming file ")
                }
                res.end(newName)
            })

            res.writeHead(200, {'content-type': 'text/plain' })
        });

        return
    } else {
        filePath = 'public' + path
    }

    if (!filePath.split('.')[1]) {
        res.writeHead(500)
        res.end()
    }

    let extension = filePath.split('.')[1].toLowerCase()
    let contentType = {
        png: 'image/png',
        jpeg: 'image/jpeg',
        jpg: 'image/jpeg',
        html: 'text/html',
        js: 'text/javascript',
        css: 'text/css',

    }[extension]

    if (contentType) {
        res.writeHead(200, {'content-type' : contentType })
    }
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404)
            res.end()
            return
        }
        res.write(data)
        res.end()
    })

}

let server = http.createServer(onRequest).listen(3000)
*/