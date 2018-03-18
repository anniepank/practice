class App {
    constructor() {
        this.user = 'anniepank'
        this.isLoggedIn = false
    }

    init () {
        router.add('', () => mainPageComponent())
        router.navigate()
        router.check()

    }

    logIn() {
        if (!this.isLoggedIn) {
            this.isLoggedIn = true
            this.user = 'anniepank'
        }
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