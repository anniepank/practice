function likePost(postId) {
    if (!app.user) return;
    let post = Oazis.getPostById(postId)

    let hasMyLike = false;

    if (post.likes) {
        for (let item of post.likes) {
            if (item.nickname === app.user) {
                hasMyLike = true;
                break;
            }
        }
        if (!hasMyLike) {
            post.likes.push({nickname: app.user})
            return true;
        }
        return false;
    }
    Object.assign(post, {likes: [{nickname: app.user}]} )
    return true;
}


function removePost(post) {
    Oazis.removePost(post.id)
}

window.postComponent = function (postConfig) {
    if (postConfig.deleted) return;

    let postElement = document.getElementById('postTemplate').cloneNode(true)

    postElement.id = null

    postElement.querySelector('.nickname').innerText = postConfig['author']
    postElement.querySelector('.date').innerText = postConfig['createdAt'].toDateString()

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

    postElement.querySelector('.fa-heart').addEventListener('click', () => {
        if (app.user) {
            if (likePost(postConfig.id)) {
                let likes = likeElement.innerText
                likes++
                likeElement.innerText = likes
                postElement.querySelector('.fa-heart').style.color = 'red'
            }
        }
    })

    postElement.querySelector('.fa-trash').addEventListener('click', () => {
        //TODO if not logged in?
        removePost(postConfig)
        postElement.onDeleted(postConfig)

    })
    return postElement
}