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
        fetch('/addPhotoPost', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(post)
        }).then((res) => {
            loadMore(1)
            reload()
        })
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

    async function loadMore(numberOfPosts, filters) {
        let value = await fetch('/getPhotoPosts?offset=' + posts.length + '&limit=' + numberOfPosts, {
            method: 'POST',
            body: filters,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        let additionalPosts = await value.json()
        posts = posts.concat(additionalPosts)
        update()
    }

    async function filterPosts(filterConfig) {
        let value = await fetch('/getPhotoPosts?offset=0&limit=9', {
            method: 'POST',
            body: JSON.stringify(filterConfig),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        posts = await value.json()
        update()
    }

    function editPost(post, changes) {
        fetch('/getPhotoPost?id=' + id).then(res => {
            if (res.status !== 200) {
                return
            } else {
                if (changes.author !== null) delete changes.author
                if (changes.createdAt !== null) delete changes.createdAt

                res.json().then(post => {
                    post = Object.assign(post, changes)
                    fetch('/editPhotoPost?id=' + id, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(post)
                    })
                })
            }
        }).then(() => {
            update()
        })
    }

    let userField = element.querySelector("#user")
    userField.innerText = app.user

    function hints() {
        let hashtagsElement = element.querySelector('#hashtags')
        fetch('/hashtags').then(result => {
            result.json().then((hashtags) => {
                let a = 5
                for (let hashtag of hashtags) {
                    let option = document.createElement('option')
                    option.value = hashtag
                    option.innerText = hashtag
                    hashtagsElement.appendChild(option)
                }
            })
        })

        let authorsElement = element.querySelector('#authors')
        fetch('/users').then(res => {
            res.json().then((authors) => {
                for (let author of authors) {
                    let option = document.createElement('option')
                    option.innerText = author
                    authorsElement.appendChild(option)
                }
            })
        })

    }

    loadMore(9).then( () => {
        hints()
    })


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
        let value = element.querySelector('#dateFrom').value
        let date = value ? new Date(value) : null
        filters.dateFrom = date
        filterPosts(filters)
    })

    element.querySelector('#dateTo').addEventListener('change', () => {
        let value = element.querySelector('#dateTo').value
        let date = value ? new Date(value) : null
        filters.dateTo = date
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
        editPost,
        addPost,
        reload,
        update,
        filterPosts,
    })
    return element;

}