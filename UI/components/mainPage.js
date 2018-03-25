const mainPageTemplate = document.querySelector('#mainPageTemplate')
document.body.removeChild(mainPageTemplate)
window.mainPageComponent = function () {
    let element = mainPageTemplate.cloneNode(true)
    element.id = null

    let filters = {
        hashtags: [],
        dateFrom: null,
        dateTo: null
    }
    let posts = []
    let limit = 9
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
            let postElement = postComponent(post)
            postElement.onDeleted = () => {
                postList.removeChild(postElement)
                posts = posts.filter(x => x !== post)
                loadMore(1)
            }
            postList.appendChild(postElement)
        }

        if (app.user) {
            let logoutButton = element.querySelector('#logoutButton')
            let loginButton = element.querySelector('#loginButton')
            logoutButton.style.display = 'block'
            loginButton.style.display = 'none'


            let userName = element.querySelector('#user')
            userName.style.display = 'block'


            let addPostButton = element.querySelector('#addPostButton')
            addPostButton.style.display = 'block'
        } else {
            let logoutButton = element.querySelector('#logoutButton');
            let loginButton = element.querySelector('#loginButton')
            logoutButton.style.display = 'none'
            loginButton.style.display = 'block'

            let userName = element.querySelector('#user')
            userName.style.display = 'none'

            let addPostButton = element.querySelector('#addPostButton')
            addPostButton.style.display = 'none'
        }

    }

    function loadMore(numberOfPosts, filters) {
        //TODO check this
        limit = numberOfPosts
        let additionalPosts = Oazis.getPosts(posts.length, numberOfPosts, filters);
        posts = posts.concat(additionalPosts)
        update()
    }

    function filterPosts(filterConfig) {
        posts = Oazis.getPosts(0, 9, filterConfig)
        update()
    }

    function editPost(post, changes) {
        Oazis.editPost(post.id, changes)
        update()
    }

    let userField = element.querySelector("#user")
    userField.innerText = app.user

    function hints() {
        let authorsElement = element.querySelector('#authors')
        let authors = Oazis.getAuthors()

        for (let author of authors) {
            let option = document.createElement('option')
            //option.value = author
            option.innerText = author
            authorsElement.appendChild(option)
        }

        let hashtagsElement = element.querySelector('#hashtags')
        let hashtags = Oazis.getHashtags()

        for (let hashtag of hashtags) {
            let option = document.createElement('option')
            option.value = hashtag
            option.innerText = hashtag
            hashtagsElement.appendChild(option)
        }

    }

    hints()
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
        if (value !== '') {
            filters.hashtags.push(value)
            element.querySelector('#hashtagInput').value = ''
            let hashtagElement = document.querySelector('.hashtag').cloneNode(true)
            let hashtagList = element.querySelector('.hashtag-list')
            hashtagElement.querySelector('span').innerText = value
            hashtagElement.style.display = 'flex'
            hashtagElement.querySelector('.hashtag-icon').addEventListener('click', () => {
                filters.hashtags = filters.hashtags.filter(x => x !== value)
                hashtagList.removeChild(hashtagElement)
                filterPosts(filters)
            })
            hashtagList.appendChild(hashtagElement)
            filterPosts(filters)
        }
    })

    element.querySelector('#dateFrom').addEventListener('change', () => {
        // TODO when date removed
        let value = new Date(element.querySelector('#dateFrom').value)
        filters.dateFrom = value
        filterPosts(filters)
    })

    element.querySelector('#dateTo').addEventListener('change', () => {
        let value = new Date(element.querySelector('#dateTo').value)
        filters.dateTo = value
        filterPosts(filters)
    })

    element.querySelector('#logoutButton').addEventListener('click', () => {
        app.logOut()
        update()
    })

    element.querySelector('#addPostButton').addEventListener('click', () => {

    })

    Object.assign(element, {
        posts: () => posts,
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