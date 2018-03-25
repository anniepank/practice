class App {
    constructor() {
        this.user = window.localStorage.login
        this.isLoggedIn = false
    }

    init () {
        router.add('^$', () => mainPageComponent())
        router.add('login', () => loginPageComponent())
        router.add('newPost', () => newPostComponent())
        router.add('editPost', () => editPostComponent())
        router.navigate()
        router.render('')
        router.listen()
    }

    logIn(nickname) {
        if (!this.user) {
            let user = Oazis.getUsers().find(x => x === nickname)
            if (user) {
                this.isLoggedIn = true
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
            this.isLoggedIn = false
            this.user = null
            window.localStorage.login = ''
        }
    }
}

window.app = new App();

app.init();