(function () {
    let posts = [

        {
            id: '1',
            description: 'lol',
            createdAt: new Date('2018-03-12'),
            author: 'Misha',
            photoLink: 'http://placeimg.com/300/300/animals',
            hashtags: ['#some',  '#hashtags'],
            deleted: false,
            likes: [ {nickname: 'Ivan'}],
        },

        {
            id: '2',
            description: 'kek',
            createdAt: new Date('2018-01-28'),
            author: 'anniepank',
            photoLink: 'https://placeimg.com/300/300/animals/1?',
            hashtags: ['#some',  '#hashtags'],
            deleted: false,
            likes: [{nickname: 'anniepank'}, {nickname: 'Ivan'}]
        },

        {
            id: '3',
            description: 'cat',
            createdAt: new Date('2018-02-28'),
            author: 'anniepank',
            photoLink: 'https://placeimg.com/300/300/animals/2?',
            hashtags: ['#some #hashtags'],
            deleted: false,
            likes: [{nickname: 'anniepank'}, {nickname: 'Ivan'}]
        },


        {
            id: '4',
            description: 'dog',
            createdAt: new Date('2018-02-24'),
            author: 'Ivan',
            photoLink: 'https://placeimg.com/300/300/animals/3?',
            hashtags: ['#doggy',  '#kitten'],
            deleted: false,
            likes: [{nickname: 'anniepank'}, {nickname: 'Ivan'}, {nickname: ''}]
        },
        {
            id: '5',
            description: 'dog',
            createdAt: new Date('2018-02-24'),
            author: 'Ivan',
            photoLink: 'https://placeimg.com/300/300/animals/3?',
            hashtags: ['#esthetic',  '#art'],
            deleted: false
        },
        {
            id: '6',
            description: 'dog',
            createdAt: new Date('2018-02-24'),
            author: 'Ivan',
            photoLink: 'https://placeimg.com/300/300/animals/3?',
            hashtags: ['#classic',  '#beauty'],
            deleted: false,
            likes: [{nickname: 'anniepank'}, {nickname: 'Ivan'}, {nickname: 'nikita'}]
        },

        {
            id: '7',
            description: 'dog',
            createdAt: new Date('2018-02-24'),
            author: 'Petya',
            photoLink: 'https://placeimg.com/300/300/animals/3?',
            hashtags: ['#gothic',  '#nature'],
            deleted: false,
        },

        {
            id: '8',
            description: 'lol',
            createdAt: new Date('2018-02-23'),
            author: 'Misha',
            photoLink: 'https://placeimg.com/300/300/animals',
            hashtags: ['#some',  '#hashtags'],
            deleted: false,
            likes: [{nickname: 'anniepank'}, {nickname: 'Ivan'}]
        },

        {
            id: '9',
            description: 'kek',
            createdAt: new Date('2018-01-28'),
            author: 'anniepank',
            photoLink: 'https://placeimg.com/300/300/animals/1?',
            hashtags: ['#some',  '#hashtags'],
            deleted: false,
            likes: [{nickname: 'anniepank'}]
        },

        {
            id: '10',
            description: 'cat',
            createdAt: new Date('2018-02-28'),
            author: 'anniepank',
            photoLink: 'https://placeimg.com/300/300/animals/2?',
            hashtags: ['#some #hashtags'],
            deleted: false,
            likes: [{nickname: 'anniepank'}]

        },

        {
            id: '11',
            description: 'dog',
            createdAt: new Date('2018-02-24'),
            author: 'Ivan',
            photoLink: 'https://placeimg.com/300/300/animals/3?',
            hashtags: ['#doggy',  '#kitten'],
            deleted: false,
        },
        {
            id: '12',
            description: 'dog',
            createdAt: new Date('2018-02-24'),
            author: 'Ivan',
            photoLink: 'https://placeimg.com/300/300/animals/3?',
            hashtags: ['#esthetic',  '#art'],
            deleted: false
        },
        {
            id: '13',
            description: 'dog',
            createdAt: new Date('2018-02-24'),
            author: 'Ivan',
            photoLink: 'https://placeimg.com/300/300/animals/3?',
            hashtags: ['#classic',  '#beauty'],
            deleted: false,
            likes: [{nickname: 'Misha'}]
        },

        {
            id: '14',
            description: 'dog',
            createdAt: new Date('2018-02-24'),
            author: 'Petya',
            photoLink: 'https://placeimg.com/300/300/animals/3?',
            hashtags: ['#gothic',  '#nature'],
            deleted: false,
            likes: []
        },

    ]

    let users = [
        'anniepank',
        'batsila',
        'valera',
        'misha',
        'nikita',
        'natasha'
    ]

    class Oazis {

        constructor(posts) {
            this.posts = posts
            this.photoSchema = {
                types: {
                    id: 'string',
                    description: 'string', //длина < 200 символов, обязательное поле
                    author: 'string',
                    createdAt: 'Date',
                    photoLink: 'string' // обязательное поле, не должно быть пустым (ссылка на фотографию)
                },

                maxLengths: {
                    description: 200
                },

                minLengths: {
                    photoLink: 1
                }
            }
            this.users = users
        }

        validateObject(schema, object) {
            for (let item in schema.types) {
                if (!object.hasOwnProperty(item)) {
                    throw new Error(`Missing field: ${item}`)
                }
                if (typeof object[item] === 'object') {
                    if (object[item].constructor.name !== schema.types[item])
                        throw new Error(`Invalid type: ${item} has to be ${schema.types[item]}, was ${object[item].constructor.name}`)
                } else {
                    if (typeof object[item] !== schema.types[item]) {
                        throw new Error(`Invalid type: ${item} has to be ${schema.types[item]}, was ${typeof object[item]}`)
                    }
                }
            }

            for (let item in schema.minLengths) {
                if (object[item].length < schema.minLengths[item]) {
                    throw new Error(`Too short: was ${object[item].length} needs to be ${schema.minLengths[item]}`)
                }
            }

            for (let item in schema.maxLengths) {
                if (object[item].length > schema.maxLengths[item]) {
                    throw new Error(`Too long: was ${object[item].length} needs to be ${schema.maxLengths[item]}`)
                }
            }
        }

        getPosts(offset, limit, filterConfig) {
            let results = this.posts.filter(x => !x.deleted)

            results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

            if (filterConfig) {
                if (filterConfig.author) {
                    results = results.filter(x => x.author === filterConfig.author)
                }
                if (filterConfig.date) {
                    results = results.filter(x => x.createdAt.getTime() === filterConfig.date.getTime())
                }
                if (filterConfig.hashtags) {
                    for (let hashtag of filterConfig.hashtags) {
                        results = results.filter(x => {
                            for (let h of x.hashtags) {
                                if (h === hashtag) return true;
                            }
                            return false;
                        })
                    }
                }
            }
            if (offset) {
                results = results.slice(offset)
            }
            if (limit !== undefined) {
                results = results.slice(0, limit)
            }
            return results
        }

        getPostById(id) {
            return this.posts.find(x => x.id === id)
        }

        validatePost(post) {
            this.validateObject(this.photoSchema, post)
        }

        addPost(post) {
            post.id = "id"
            post.deleted = false
            this.validatePost(post)
            this.posts.push(post)

            return post
        }

        editPost(id, changes) {
            if (!this.getPostById(id)) return;
            if (changes.author !== null) changes.author = null;
            if (changes.createdAt !== null) changes.creattAt = null;
            return Object.assign(this.getPostById(id), changes)
        }

        removePost(id) {
            this.getPostById(id).deleted = true
        }

        getAuthors() {
            let authors = new Set()
            for (let post of posts) {
                authors.add(post.author)
            }

            return authors
        }

        getHashtags() {
            let hashtags = new Set()
            for (let post of posts) {
                for (let i = 0; i < post.hashtags.length; i++) {
                    hashtags.add(post.hashtags[i])
                }
            }

            return hashtags
        }

        getUsers() {
            return this.users;
        }
    }

    window.Oazis = new Oazis(posts);
})();
