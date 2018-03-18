window.mainPageComponent = function () {
    let element = document.querySelector('#mainPageTemplate').cloneNode(true)
    element.id = null

    let filters = {}
    let posts = []
    let postList = element.querySelector('.post-list')

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
            postList.appendChild(postComponent(post))
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

    let userField = element.querySelector("#user")
    userField.innerText = app.user

    function logIn() {
        app.logIn()

        let logoutButton = element.querySelector('#logoutButton')
        let loginButton = element.querySelector('#loginButton')
        logoutButton.style.display = 'block'
        loginButton.style.display = 'none'


        let userName = element.querySelector('#user')
        userName.style.display = 'block'


        let addPostButton = element.querySelector('#addPostButton')
        addPostButton.style.display = 'block'

        update()
    }


    function logOut() {
        if (app.isLoggedIn) {
            app.logOut()

            let logoutButton = element.querySelector('#logoutButton');
            let loginButton = element.querySelector('#loginButton')
            logoutButton.style.display = 'none'
            loginButton.style.display = 'block'

            let userName = element.querySelector('#user')
            userName.style.display = 'none'

            let addPostButton = element.querySelector('#addPostButton')
            addPostButton.style.display = 'none'

            update()
        }
    }

    function likePost(postId) {
        if (!app.isLoggedIn) return;
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
            }
        }

        update()

    }

    function hints() {
        let authorsElement = element.querySelector('#authors')
        let authors = Oazis.getAuthors()

        for (let author of authors) {
            let option = document.createElement('option')
            option.value = author
            authorsElement.appendChild(option)
        }

        let hashtagsElement = element.querySelector('#hashtags')
        let hashtags = Oazis.getHashtags()

        for (let hashtag of hashtags) {
            let option = document.createElement('option')
            option.value = hashtag
            hashtagsElement.appendChild(option)
        }

    }

    hints()
    logIn()
    loadMore(9)

    element.querySelector('#loadMore').addEventListener('click', () => {
        loadMore(9, filters)
    })


    element.querySelector('#authorsInput').addEventListener('change', () => {
        filters.author = element.querySelector('#authorsInput').value
        filterPosts({
            author: element.querySelector('#authorsInput').value
        })
    })

    element.querySelector('#hashtagInput').addEventListener('change', () => {
        let value = element.querySelector('#hashtagInput').value
        if (value !== "") {
            filters.hashtags.push()
            filterPosts(filters)
        }
    })

    element.querySelector('#logoutButton').addEventListener('click', () => {
        logOut();
    })

    Object.assign(element, {
        posts: () => posts,
        logIn,
        logOut,
        loadMore,
        removePost,
        editPost,
        addPost,
        reload,
        update,
        filterPosts,
        likePost
    })
    return element;

}