(function () {

    let users = [
        'anniepank',
        'batsila',
        'valera',
        'misha',
        'nikita',
        'natasha',
        'djadjka'
    ]

    class Oazis {
        async load() {
            if (!localStorage.posts) {
                let resultFromFetch = await fetch('/data.json')
                let data = await resultFromFetch.json()
                this.posts = data
            } else {
                this.posts = JSON.parse(localStorage.posts)
            }
            for (let post of this.posts) {
                post.createdAt = new Date(post.createdAt)
            }
        }

        constructor() {
            this.promise = this.load()
            //this.posts = JSON.parse(window.localStorage.posts)
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

        async getPosts(offset, limit, filterConfig) {
            await this.promise
            let results = this.posts.filter(x => !x.deleted)

            results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

            if (filterConfig) {
                if (filterConfig.author) {
                    results = results.filter(x => x.author === filterConfig.author)
                }
                if (filterConfig.dateFrom) {
                    results = results.filter(x => x.createdAt.getTime() >= filterConfig.dateFrom.getTime())
                }
                if (filterConfig.dateTo) {
                    results = results.filter(x => x.createdAt.getTime() < filterConfig.dateTo.getTime())
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
            post.id = Date.now().toString()
            post.deleted = false
            this.validatePost(post)
            this.posts.push(post)
            this.save()
            return post
        }

        editPost(id, changes) {
            if (!this.getPostById(id)) return;
            if (changes.author !== null) delete changes.author
            if (changes.createdAt !== null) delete changes.createdAt
            let post = Object.assign(this.getPostById(id), changes)
            this.save()
            return post
        }

        removePost(id) {
            this.getPostById(id).deleted = true
            this.save()
        }

        getAuthors() {
            let authors = new Set()
            for (let post of this.posts) {
                authors.add(post.author)
            }

            return authors
        }

        getHashtags() {
            let hashtags = new Set()
            for (let post of this.posts) {
                for (let i = 0; i < post.hashtags.length; i++) {
                    hashtags.add(post.hashtags[i])
                }
            }

            return hashtags
        }

        getUsers() {
            return this.users;
        }

        likePost(postId) {
            if (!app.user) return
            let post = this.getPostById(postId)

            let hasMyLike = false

            if (post.likes) {
                for (let item of post.likes) {
                    if (item.nickname === app.user) {
                        hasMyLike = true
                        break
                    }
                }
                if (!hasMyLike) {
                    post.likes.push({nickname: app.user})
                } else {
                    post.likes = post.likes.filter(x => x.nickname !== app.user)
                }
            } else {
                Object.assign(post, {likes: [{nickname: app.user}]})
            }
            this.save()
            return post.likes.length
        }

        save() {
            window.localStorage.posts = JSON.stringify(this.posts)
        }
    }

    window.Oazis = new Oazis();
})();
