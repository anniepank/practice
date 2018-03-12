window.client = (function () {
    let user = 'anniepank'
    let isLoggedIn = false
    let filters = {}
    let posts = []
    let postList = document.getElementsByClassName('post-list')[0]

    function createPostElement(postConfig) {
        if (postConfig.deleted) return;

        let postElement = document.getElementById('templatePost').cloneNode(true)

        postElement.id = null

        postElement.querySelector('.nickname').innerText = postConfig['author']
        postElement.querySelector('.date').innerText = postConfig['createdAt'].toDateString()

        postElement.querySelector('.post-description').innerText = postConfig['description']
        postElement.querySelector('.post-hashtags').innerText = postConfig['hashtags']

        if ((user === null) || (postConfig.author !== user)) {
            postElement.querySelector('.to-the-right').querySelector('.fa-trash').style.display = 'none'
            postElement.querySelector('.to-the-right').querySelector('.fa-pencil-alt').style.display = 'none'
        }

        if (postConfig.likes)
        postElement.querySelector('#likes').innerText = postConfig.likes

        postList.appendChild(postElement)

        return postElement
    }

    function addPost(post) {
        Oazis.addPost(post)
        loadMore(1)
        reload()
    }

    function reload() {
        let n = posts.length
        posts = []
        loadMore(n)
        update()
    }


    function update() {
        while (postList.firstChild) {
            postList.removeChild(postList.firstChild);
        }

        for (let post of posts) {
            createPostElement(post)
        }

    }

    function loadMore(numberOfPosts, filters) {
        let additionalPosts = Oazis.getPosts(posts.length, numberOfPosts, filters);
        posts = posts.concat(additionalPosts)
        update()
    }

    function filterPosts(filterConfig) {
        let limit = posts.length
        posts = Oazis.getPosts(0, limit, filterConfig)
        update()
    }

    function removePost(post) {
        Oazis.removePost(post.id)
        posts = posts.filter(x => x !== post)
        reload()
    }

    function editPost(post, changes) {
        Oazis.editPost(post.id, changes)
        update()
    }

    let userField = document.getElementById("user")
    userField.innerText = user

    function logIn() {
        isLoggedIn = true
        user = "anniepank"

        let logoutButton = document.getElementById('logoutButton')
        let loginButton = document.getElementById('loginButton')
        logoutButton.style.display = 'block'
        loginButton.style.display = 'none'
    }

    function logOut() {
        isLoggedIn = false
        user = null

        let logoutButton = document.getElementById('logoutButton')
        let loginButton = document.getElementById('loginButton')
        logoutButton.style.display = 'none'
        loginButton.style.display = 'block'
    }

    function hints() {
        let authorsElement = document.getElementById('authors')
        let authors = Oazis.getAuthors()

        for (let author of authors) {
            let option = document.createElement('option')
            option.value = author
            authorsElement.appendChild(option)
        }

        let hashtagsElement = document.getElementById('hashtags')
        let hashtags = Oazis.getHashtags()

        for (let hashtag of hashtags) {
            let option = document.createElement('option')
            option.value = hashtag
            hashtagsElement.appendChild(option)
        }

    }

    hints()
    logIn()

    return {
        posts: () => posts,
        logIn,
        logOut,
        loadMore,
        removePost,
        editPost,
        addPost,
        reload,
        update,
        filterPosts
    }

})();