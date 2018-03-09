(function () {
    function createPostElement(postList, postConfig) {
        let postElement = document.createElement('article')
        postElement.classList.add('post')

        let postTop = document.createElement('div')
        postTop.classList.add('post-top')
        let postBottom = document.createElement('div')
        postBottom.classList.add('post-bottom')

        postElement.appendChild(postTop)
        postElement.appendChild(postBottom)

        let postHeader = document.createElement('div')
        postHeader.classList.add('post-header')
        postTop.appendChild(postHeader)

        let postInfo = document.createElement('div')
        postInfo.classList.add('post-info')
        postHeader.appendChild(postInfo)

        let nicknameField = document.createElement('div')
        nicknameField.classList.add('nickname')
        nicknameField.innerHTML = postConfig['author']
        postInfo.appendChild(nicknameField)

        let dateField = document.createElement('div')
        dateField.classList.add('date')
        dateField.innerHTML = postConfig['createdAt'].toDateString()
        postInfo.appendChild(dateField)

        let toTheRightStyle = document.createElement('div')
        toTheRightStyle.classList.add('to-the-right')

        postHeader.appendChild(toTheRightStyle)

        let deleteButton = document.createElement('button')
        deleteButton.classList.add('post-button')
        toTheRightStyle.appendChild(deleteButton)

        let deleteIcon = document.createElement('i')
        deleteIcon.classList.add('fas', 'fa-trash')
        deleteButton.appendChild(deleteIcon)


        let editButton = document.createElement('button')
        editButton.classList.add('post-button')
        toTheRightStyle.appendChild(editButton)

        let editIcon = document.createElement('i')
        editIcon.classList.add('fas', 'fa-pencil-alt')
        editButton.appendChild(editIcon)

        let postImage = document.createElement('img')
        postImage.src = postConfig['photoLink']
        postTop.appendChild(postImage)

        let containerForText = document.createElement('div')
        postBottom.appendChild(containerForText)

        let description = document.createElement('div')
        description.classList.add('post-description')
        description.innerHTML = postConfig['description']
        containerForText.appendChild(description)

        let hashtags = document.createElement('div')
        hashtags.classList.add('post-hashtags')
        hashtags.innerHTML = postConfig['hashtags']
        containerForText.appendChild(hashtags)

        let anothertoTheRightStyle = document.createElement('div')
        anothertoTheRightStyle.classList.add('to-the-right')
        postBottom.appendChild(anothertoTheRightStyle)

        let likeButton = document.createElement('button')
        likeButton.classList.add('post-button')
        anothertoTheRightStyle.appendChild(likeButton)


        let likeIcon = document.createElement('i')
        likeIcon.classList.add('fas', 'fa-heart')
        likeButton.appendChild(likeIcon)

        postList.appendChild(postElement)

        return postElement
    }

    function loadMore(currentNumberOfPosts, postList) {
        let additionalPosts = Oazis.getPosts(currentNumberOfPosts, 9);
        for (let post of additionalPosts) {
            createPostElement(postList, post)
        }
    }

    function removePost(post, postElement, postList) {
        Oazis.removePost(post['id'])
        postList.removeChild(postElement)
    }

    let document = window.document

    let postList = document.getElementsByClassName('post-list')[0]

    let postElement = createPostElement(postList, {
        author: 'anniepank',
        createdAt: new Date(2018, 3, 12),
        decription: 'some description',
        hashtags: 'some hashtags',
        photoLink: 'https://placeimg.com/300/300/animals?1'
    })

    let posts = Oazis.getPosts(0, 8)

    for (let i = 0; i < 9; i++) {
        if (posts[i] == null) {
            break;
        }
        let post = posts[i];
        createPostElement(postList, post)
    }

    let currentNumberOfPosts = 9;
    loadMore(currentNumberOfPosts, postList)

    let post = Oazis.addPost(
        {
            id: '20',
            description: 'food',
            createdAt: new Date('2018-03-08'),
            author: 'anniepank',
            photoLink: 'https://placeimg.com/300/300/food/3?',
            hashtags: 'cook',
        })
    postElement = createPostElement(postList, post)

    removePost(post, postElement , postList)

    try {
        console.log('Validating post with wrong id')
        Oazis.validatePost({
            id: 4,
            description: 'dog',
            createdAt: new Date('2018-02-24'),
            author: 'Ivan',
            photoLink: 'fhcgjhbjj;lk'
        })
    }
    catch (error) {
        console.warn(error)
    }

    try {
        console.log('Validating post with wrong date')
        Oazis.validatePost({
            id: '4',
            description: 'dog',
            createdAt: [1, 2, 3],
            author: 'Ivan',
            photoLink: 'fgjklj;k'
        })
    }
    catch (error) {
        console.warn(error)
    }

    console.log('Adding new post')
    console.log(Oazis.addPost({
        id: '11',
        description: 'doggy',
        createdAt: new Date('2018-03-03'),
        author: 'Anna',
        photoLink: 'https://placeimg.com/300/300/animals'
    }))
    console.log(Oazis.getPosts())

    console.log('Removing post with id = 1')
    Oazis.removePost('1')
    console.log(Oazis.getPosts())

})();