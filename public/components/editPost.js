window.editPostComponent = function () {
    console.log('edit post page')
    let post = JSON.parse(window.localStorage.postToEdit)

    let editPostPage = document.getElementById('form-template').cloneNode(true)
    editPostPage.style.display = 'block'
    editPostPage.querySelector('input').style.display = 'none'

    let image  = document.createElement('img')
    image.src = post.photoLink
    image.className = 'image'
    editPostPage.querySelector('.image').appendChild(image)

    editPostPage.querySelector('.name').querySelector('input').value = post.author
    let date = new Date(post.createdAt)
    editPostPage.querySelector('.date').querySelector('input').value = date.toDateString()

    editPostPage.querySelector('textarea').value = post.description

    let hashtagList = editPostPage.querySelector('.hashtag-list')

    for (let hashtag of post.hashtags) {
        let hashtagElement = document.querySelector('.hashtag').cloneNode(true)
        hashtagElement.style.display = 'flex'

        hashtagElement.querySelector('span').innerText = hashtag
        hashtagList.appendChild(hashtagElement)

        hashtagElement.querySelector('.hashtag-icon').addEventListener('click', () => {
            hashtagList.removeChild(hashtagElement)
            post.hashtags = post.hashtags.filter(x => x !== hashtag)
        })
    }

    editPostPage.querySelector('#createHashtagsInput').addEventListener('change', () => {
        let value = editPostPage.querySelector('#createHashtagsInput').value
        if (value !== '') {
            editPostPage.querySelector('#createHashtagsInput').value = ''
            post.hashtags.push(value)

            hashtagElement.querySelector('span').innerText = value
            hashtagElement.style.display = 'flex'
            hashtagElement.querySelector('.hashtag-icon').addEventListener('click', () => {
                hashtagList.removeChild(hashtagElement)
                post.hashtags = post.hashtags.filter(x => x !== value)
            })
            hashtagList.appendChild(hashtagElement)
        }
    })

    let submitDiv = editPostPage.querySelector('.submit')
    submitDiv.querySelector('input').value = 'EDIT'
    submitDiv.addEventListener('click', () => {
        Object.assign(post, {
            description: editPostPage.querySelector('textarea').value
        })
        fetch('/getPhotoPost?id=' + post.id).then(res => {
            if (res.status !== 200) {
                return
            } else {
                if (post.author !== null) delete post.author
                if (post.createdAt !== null) delete post.createdAt

                res.json().then(postFromServer => {
                    fetch('/editPhotoPost?id=' + postFromServer.id, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(post)
                    }).then(() => {
                        router.navigate('')
                    })
                })
            }
        })
    })


    return editPostPage
}
