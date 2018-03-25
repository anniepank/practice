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

    newPostPage.querySelector('.submit').addEventListener('click', () => {
        let post = {
            author: app.user,
            createdAt: new Date(),
            hashtags: hashtags,
            photoLink: 'https://placeimg.com/300/300/animals/1',
            description: newPostPage.querySelector('textarea').value
        }

        Oazis.addPost(post)
        router.navigate('')
    })


    return newPostPage
}
