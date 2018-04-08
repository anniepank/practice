function removePost(post) {
    fetch('/removePhotoPost?id=' + post.id, {
        method: 'DELETE'
    })
}

window.postComponent = function (postConfig) {
    if (postConfig.deleted) return

    let postElement = document.getElementById('postTemplate').cloneNode(true)

    postElement.id = null

    postElement.querySelector('.nickname').innerText = postConfig['author']
    postElement.querySelector('.date').innerText = new Date(postConfig['createdAt']).toDateString()
    postElement.querySelector('img').src = postConfig.photoLink
    postElement.querySelector('.post-description').innerText = postConfig['description']
    postElement.querySelector('.post-hashtags').innerText = postConfig['hashtags']

    if (app.user === null || postConfig.author !== app.user) {
        postElement.querySelector('.to-the-right').querySelector('.fa-trash').style.display = 'none'
        postElement.querySelector('.to-the-right').querySelector('.fa-pencil-alt').style.display = 'none'
    }


    if (postConfig.likes && app.user) {
        for (let item of postConfig.likes) {
            if (item.nickname === app.user) {
                postElement.querySelector('.fa-heart').style.color = 'red'
            }
        }
    }

    let likeElement = postElement.querySelector('#likes')
    if (postConfig.likes) {
        if (postConfig.likes.length === 0) {
            likeElement.innerText = 0
        } else {
            likeElement.innerText = postConfig.likes.length
        }
    }

    postElement.querySelector('.like-button').addEventListener('click', async () => {
        if (app.user) {
            let numberOfLikesBefore = postConfig.likes.length
            let numberOfLikes = await (await fetch('/likePost?id=' + postConfig.id + '&user=' + app.user, {
                method: 'POST'
            })).json()

            likeElement.innerText = numberOfLikes
            if (numberOfLikes - numberOfLikesBefore > 0) {
                postElement.querySelector('.fa-heart').style.color = 'red'
            } else {
                postElement.querySelector('.fa-heart').style.color = '#555'
            }
        }
    })

    postElement.querySelector('.delete-button').addEventListener('click', () => {
        removePost(postConfig)
        postElement.onDeleted(postConfig)

    })

    postElement.querySelector('.edit-button').addEventListener('click', () => {
        window.localStorage.postToEdit = JSON.stringify(postConfig)
        router.navigate('editPost')
    })
    return postElement
}