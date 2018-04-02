window.editPostComponent = function () {
    console.log('edit post page')
    let post = JSON.parse(window.localStorage.postToEdit)

    let editPostPage = document.getElementById('form-template').cloneNode(true)
    editPostPage.style.display = 'block'

    editPostPage.querySelector('.name').querySelector('input').value = post.author
    let date = new Date(post.createdAt)
    editPostPage.querySelector('.date').querySelector('input').value = date.toDateString()

    let hashtagList = editPostPage.querySelector('.hashtag-list')
    let hashtagElement = document.querySelector('.hashtag').cloneNode(true)
    hashtagElement.style.display = 'flex'

    for (let hashtag of post.hashtags) {
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
        Oazis.editPost(post.id, post)
        router.navigate('')
    })


    return editPostPage
}
