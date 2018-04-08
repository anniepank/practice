let image
let link = ''

function preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
}

function handleFiles(files) {
    files = [...files]
    files.forEach(uploadFile)
    files.forEach(previewFile)
}

function handleDrop(e) {
    let data = e.dataTransfer
    let files = data.files;
    handleFiles(files)
}


function uploadFile(file) {
    let url = '/upload'
    let formData = new FormData()

    image.file = file

    formData.append('file', file)

    fetch(url, {
        method: 'POST',
        body: formData
    }).then((res) => {
        res.text().then(text => {
            link = '/images/' + text
        })
    })
}

function previewFile(file) {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function() {
        let img = document.createElement('img')
        img.height = 300
        img.width = 300
        img.src = reader.result
        image.appendChild(img)
    }
}


window.newPostComponent = function () {
    console.log('create post page')
    let newPostPage = document.getElementById('form-template').cloneNode(true)
    newPostPage.style.display = 'block'

    newPostPage.querySelector('.name').querySelector('input').value = app.user
    newPostPage.querySelector('.date').querySelector('input').value = new Date().toDateString()

    let hashtags = []

    newPostPage.querySelector('#createHashtagsInput').addEventListener('change', () => {
        let value = newPostPage.querySelector('#createHashtagsInput').value
        if (value !== '') {
            newPostPage.querySelector('#createHashtagsInput').value = ''
            hashtags.push(value)
            let hashtagElement = document.querySelector('.hashtag').cloneNode(true)
            let hashtagList = newPostPage.querySelector('.hashtag-list')
            hashtagElement.querySelector('span').innerText = value
            hashtagElement.style.display = 'flex'
            hashtagElement.querySelector('.hashtag-icon').addEventListener('click', () => {
                hashtagList.removeChild(hashtagElement)
                hashtags = hashtags.filter(x => x !== value)
            })
            hashtagList.appendChild(hashtagElement)
        }
    })

    let dropArea = newPostPage.querySelector(".drop-area");
    image = newPostPage.querySelector('.image');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false)
        document.body.addEventListener(eventName, preventDefaults, false)
    })

    dropArea.addEventListener('drop', handleDrop, false)

    newPostPage.querySelector('.submit').addEventListener('click', () => {
        let post = {
            author: app.user,
            createdAt: new Date(),
            hashtags: hashtags,
            photoLink: link,
            description: newPostPage.querySelector('textarea').value,
            likes: []
        }

        fetch('/addPhotoPost', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(post)
        }).then(() => {
            router.navigate('')
        })
    })


    return newPostPage
}
