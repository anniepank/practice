(function () {
    let posts = [
        {
            id: '1',
            description: 'lol',
            createdAt: new Date('2018-02-23'),
            author: 'Misha',
            photoLink: 'https://placeimg.com/300/300/animals',
            hashtags: 'some hashtags',
            deleted: false,
        },
/*
        {
            id: '2',
            description: 'kek',
            createdAt: new Date('2018-02-20'),
            author: 'Ivan',
            photoLink: 'https://placeimg.com/300/300/animals/1?',
            hashtags: 'some hashtags',
        },

        {
            id: '3',
            description: 'cat',
            createdAt: new Date('2018-02-28'),
            author: 'Ivan',
            photoLink: 'https://placeimg.com/300/300/animals/2?',
            hashtags: 'some hashtags',
        },
        {
            id: '4',
            description: 'dog',
            createdAt: new Date('2018-02-24'),
            author: 'Ivan',
            photoLink: 'https://placeimg.com/300/300/animals/3?',
            hashtags: 'some hashtags',

        },
        {
            id: '5',
            description: 'dog',
            createdAt: new Date('2018-02-24'),
            author: 'Ivan',
            photoLink: 'https://placeimg.com/300/300/animals/3?',
            hashtags: 'some hashtags',

        },
        {
            id: '6',
            description: 'dog',
            createdAt: new Date('2018-02-24'),
            author: 'Ivan',
            photoLink: 'https://placeimg.com/300/300/animals/3?',
            hashtags: 'some hashtags',

        },

        {
            id: '7',
            description: 'dog',
            createdAt: new Date('2018-02-24'),
            author: 'Ivan',
            photoLink: 'https://placeimg.com/300/300/animals/3?',
            hashtags: 'some hashtags',

        },

        */
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

            if (filterConfig) {
                if (filterConfig.author) {
                    results = results.filter(x => x.author === filterConfig.author)
                }
                if (filterConfig.date) {
                    results = results.filter(x => x.date === filterConfig.date)
                }
            }
            if (offset) {
                results = results.slice(offset)
            }
            if (limit) {
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
            try {
                this.validatePost(post)

            } catch (error) {
                return false
            }

            this.posts.push(post)

            return post
        }

        editPost(id, changes) {
            return Object.assign(this.getPostById(id), changes)
        }

        removePost(id) {
            this.getPostById(id).deleted = true
        }
    }

    window.Oazis = new Oazis(posts);
})();
