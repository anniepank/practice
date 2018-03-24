class App {
    constructor() {
        this.user = 'anniepank'
        this.isLoggedIn = false
    }

    init () {
        router.add('^$', () => mainPageComponent())
        router.add('login', () => loginPageComponent())
        router.navigate()
        router.check()
        router.listen()
    }

    logIn(nickname) {
        if (!this.isLoggedIn) {
            let user = Oazis.getUsers().find(x => x === nickname)
            if (user) {
                this.isLoggedIn = true
                this.user = nickname

                return true;
            }
            return false;
        }
        return false;
    }


    logOut() {
        if (this.isLoggedIn) {
            this.isLoggedIn = false
            this.user = null
        }
    }
}

window.app = new App();

app.init();