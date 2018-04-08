const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const multiparty = require('multiparty')

function validateObject(schema, object) {
    for (let item in schema.types) {
        if (!object.hasOwnProperty(item)) {
            throw new Error(`Missing field: ${item}`)
        }
        if (typeof object[item] === 'object') {
            if (object[item].constructor.name !== schema.types[item])
                throw new Error(`Invalid type: ${item} has to be ${schema.types[item]}, was ${object[item].constructor.name}`)
        } else {
            if (typeof object[item] !== schema.types[item]) {
                throw new Error(`Invalid type: ${item} has to be ${schema.types[item]}, was ${typeof object[item]}`)
            }
        }
    }

    for (let item in schema.minLengths) {
        if (object[item].length < schema.minLengths[item]) {
            throw new Error(`Too short: was ${object[item].length} needs to be ${schema.minLengths[item]}`)
        }
    }

    for (let item in schema.maxLengths) {
        if (object[item].length > schema.maxLengths[item]) {
            throw new Error(`Too long: was ${object[item].length} needs to be ${schema.maxLengths[item]}`)
        }
    }
    return true;
}
let photoSchema = {
    types: {
        id: 'string',
        description: 'string', //длина < 200 символов, обязательное поле
        author: 'string',
        createdAt: 'Date',
        photoLink: 'string' // обязательное поле, не должно быть пустым (ссылка на фотографию)
    },

    maxLengths: {
        description: 200
    },

    minLengths: {
        photoLink: 1
    }
}

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

router.post('/getPhotoPosts', (req, res) => {
    let offset = req.query.offset
    let limit = req.query.limit
    let filterConfig = req.body

    fs.readFile(path.join(__dirname, 'public/data.json'), (err, data) => {
        if (err) throw err
        let posts = JSON.parse(data)

        posts = posts.filter(x => !x.deleted)

        posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        if (filterConfig) {
            if (filterConfig.author) {
                posts = posts.filter(x => x.author === filterConfig.author)
            }
            if (filterConfig.dateFrom) {
                posts = posts.filter(x => new Date(x.createdAt).getTime() >= new Date(filterConfig.dateFrom).getTime())
            }
            if (filterConfig.dateTo) {
                posts = posts.filter(x => new Date(x.createdAt).getTime() < new Date(filterConfig.dateTo).getTime())
            }
            if (filterConfig.hashtags) {

                for (let hashtag of filterConfig.hashtags) {
                    posts = posts.filter(x => x.hashtags.includes(hashtag))
                }
            }
        }
        if (offset) {
            posts = posts.slice(offset)
        }
        if (limit !== undefined) {
            posts = posts.slice(0, limit)
        }

        res.writeHead(200, {'content-type': 'application/json'})
        res.write(JSON.stringify(posts))
        res.end()
    })
})

router.get('/users', (req, res) => {
    fs.readFile(path.join(__dirname, 'public/users.json'), (err, data) => {
        if (err) throw err
        res.writeHead(200, {'content-type': 'application/json'})
        res.write(data)
        res.end()
    })
})

router.get('/hashtags', (req, res) => {
    fs.readFile(path.join(__dirname, 'public/data.json'), (err, data) => {
        if (err) throw err
        let posts = JSON.parse(data)
        let hashtags = new Set()

        for (let post of posts) {
            for (let i = 0; i < post.hashtags.length; i++) {
                hashtags.add(post.hashtags[i])
            }
        }

        res.writeHead(200, {'content-type': 'application/json'})
        res.write(JSON.stringify(Array.from(hashtags)))
        res.end()
    })
})

router.post('/updatePosts', (req, res) => {
    fs.writeFile(path.join(__dirname, 'public/data.json'), JSON.stringify(req.body), (err) => {
        res.end()
    })
})

router.post('/upload', (req, res) => {
    let form = new multiparty.Form()

    form.parse(req, function (err, fields, files) {
        let newName = Date.now().toString() + '.' + files.file[0].originalFilename.split('.')[1]
        fs.rename(files.file[0].path, './public/images/' + newName, (err) => {
            if (err) {
                console.log('problems with renaming file ')
            }
            res.end(newName)
        })

        res.writeHead(200, {'content-type': 'text/plain'})
    })
})

router.post('/addPhotoPost', (req, res) => {
    let postToAdd = req.body
    postToAdd.id = Date.now().toString()
    postToAdd.deleted = false
    let date = new Date(postToAdd.createdAt)
    postToAdd.createdAt = date
    try {
        validateObject(photoSchema, postToAdd)
        fs.readFile(path.join(__dirname, 'public/data.json'), (err, data) => {
            if (err) throw err
            let posts = JSON.parse(data)
            posts.push(postToAdd)
            fs.writeFile(path.join(__dirname, 'public/data.json'), JSON.stringify(posts), () => {
                res.end()
            })
        })
    } catch (e) {
        res.writeHead(500)
        res.end()
    }

})

router.delete('/removePhotoPost', (req, res) => {
    let id = req.query.id

    fs.readFile(path.join(__dirname, 'public/data.json'), (err, data) => {
        if (err) throw err
        let posts = JSON.parse(data)
        for (let post of posts) {
            if (post.id === id) {
                post.deleted = true
            }
        }
        fs.writeFile(path.join(__dirname, 'public/data.json'), JSON.stringify(posts), () => {
            res.end()
        })
    })
})

router.put('/editPhotoPost', (req, res) => {
    let id = req.query.id
    let changes = req.body

    fs.readFile(path.join(__dirname, 'public/data.json'), (err, data) => {
        if (err) throw err
        let posts = JSON.parse(data)

        for (let post of posts) {
            if (post.id === id) {
                Object.assign(post, changes)
                fs.writeFile(path.join(__dirname, 'public/data.json'), JSON.stringify(posts), () => {
                    res.end()
                })
            }
        }

    })
})

router.get('/getPhotoPost', async (req, res) => {
    let id = req.query.id

    let posts = await readFile()
    for (let post of posts) {
        if (post.id === id) {
            res.writeHead(200, {'content-type': 'application/json'})
            res.write(JSON.stringify(post))
            return res.end()
        }
    }

    res.status(404)
    res.end()
})

function readFile() {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'public/data.json'), (err, data) => {
            if (err) {
                return reject(err)
            }
            let posts = JSON.parse(data)
            resolve(posts)
        })
    })
}

function writeFile(posts) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, 'public/data.json'), JSON.stringify(posts), (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}

router.post('/likePost', async (req, res) => {
    let id = req.query.id
    let user = req.query.user
    let posts = await readFile()
    let post = posts.find(x => x.id === id)

    if (!user) return

    if (post.likes) {
        let hasMyLike = !!post.likes.find(x => x.nickname === user)

        if (!hasMyLike) {
            post.likes.push({nickname: user})
        } else {
            post.likes = post.likes.filter(x => x.nickname !== user)
        }
    } else {
        post.likes = [{nickname: user}]
    }

    writeFile(posts)
    res.json(post.likes.length)
    res.end()
})

router.post('/validatePost', (req, res) => {
    let post = req.body
    try {
        validateObject(photoSchema, post)
        res.end('true')
    } catch (e) {
        res.end('false')
    }
})

module.exports = router