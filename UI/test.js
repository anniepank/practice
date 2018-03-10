window.client = (function () {
    let user = 'Anna Pankova'
    let isLoggedIn = false
    let filters = {
        author: 'anniepank',
        date: new Date('2018-02-28'),
    }
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

    function loadMore(numberOfPosts) {
        let additionalPosts = Oazis.getPosts(posts.length, numberOfPosts);
        posts = posts.concat(additionalPosts)
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

    loadMore(1)
    update()

/*

    let post = Oazis.addPost(
        {
            id: '20',
            description: 'food',
            createdAt: new Date('2018-02-28'),
            author: 'nikita',
            photoLink: 'https://placeimg.com/300/300/food/3?',
            hashtags: ['#cook'],
        })

    postElement = createPostElement(postList, post)

    removePost(post['id'], postList)

    editPost('1', {
        description: 'real adequate description',
        author: 'Anna Pankova',
    })
    */

    let userField = document.getElementById("user")
    userField.innerText = user

    function logIn() {
        isLoggedIn = true
        user = "Anna Pankova"

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
        reload
    }

})();