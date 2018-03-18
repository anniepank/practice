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

    let likeElement = postElement.querySelector('#likes')
    if (postConfig.likes) {
        if (postConfig.likes.length === 0) {
            likeElement.innerText = 0
        } else {
            likeElement.innerText = postConfig.likes.length
        }
    }
    return postElement
}