(function () {
    let posts = Oazis.getPosts(0, 5, {author: 'Ivan'})
    console.log('Getting all posts: ', posts)

    let post = Oazis.getPostById('1')
    console.log('Getting post with id = 1', post)

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