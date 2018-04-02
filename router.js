const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

router.get('/data.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/data.json'))
})

router.post('/updatePosts', (req, res) => {
    fs.writeFile(path.join(__dirname, 'public/data.json'), JSON.stringify(req.body), (err) => {
        res.end()
    })
})
module.exports = router;