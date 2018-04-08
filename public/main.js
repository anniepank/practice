class App {
    constructor() {
        this.user = window.localStorage.login
    }

    init () {
        router.add('^$', () => mainPageComponent())
        router.add('login', () => loginPageComponent())
        router.add('newPost', () => newPostComponent())
        router.add('editPost', () => editPostComponent())
        router.navigate()
        router.render('')
        router.listen()

        //window.localStorage.posts = JSON.stringify(Oazis.getPosts())
    }

    logIn(nickname) {
        if (!this.user) {
            let user = Oazis.getUsers().find(x => x === nickname)
            if (user) {
                this.user = nickname
                window.localStorage.login = user
                return true;
            }
            return false;
        }
        return false;
    }


    logOut() {
        if (this.user) {
            this.user = null

            window.localStorage.login = ''
        }
    }
}

window.app = new App();

app.init();