/*
client.loadMore(9)
client.update()


let filters = {
    hashtags: [],
}

let loadMoreButton = document.getElementById('loadMore').addEventListener('click', () => {
    client.loadMore(9, filters)
})


let userInput = document.getElementById('authorsInput').addEventListener('change', () => {
    filters.author = document.getElementById('authorsInput').value
    client.filterPosts({
        author: document.getElementById('authorsInput').value
    })
})

let hashtagInput = document.getElementById('hashtagInput').addEventListener('change', () => {
    let value = document.getElementById('hashtagInput').value
    if (value !== "") {
        filters.hashtags.push()
        client.filterPosts(filters)
    }
})

let logoutButton = document.getElementById('logoutButton').addEventListener('click', () => {
    client.logOut();
})


router.router.navigate()

router.router
    .add(/login/, function() {
        console.log('login');
    })

router.router.listen()
 */