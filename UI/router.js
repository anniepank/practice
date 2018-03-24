(function () {
    class Router {
        constructor() {
            this.currentComponent = null
            this.routes = []
            this.route = ''
        }

        getFragment() {
            let fragment = ''
            let match = window.location.href.match(/#(.*)$/)
            fragment = match ? match[1] : ''
            return fragment
        }

        add(regexp, handler) {
            this.routes.push({regexp, handler})
            return this
        }
        /*

        remove(param) {
            this.routes = this.routes.filter(r => r.handler !== param && r.regexp.toString() !== param.toString())
            return this
        }
        */

        check() {
            let fragment = this.getFragment()
            for (let i = 0; i < this.routes.length; i++) {
                let match = fragment.match(this.routes[i].regexp)
                if (match) {
                    match.shift()
                    if (this.currentComponent) {
                        document.body.removeChild(this.currentComponent)
                    }
                    this.currentComponent = this.routes[i].handler(...match)
                    document.body.appendChild(this.currentComponent)
                    return this
                }
            }
            return this
        }

        listen() {
            window.addEventListener('hashchange', () => {
                this.check()
            })
        }

        navigate(path) {
            path = path ? path : ''
            window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path
            this.route = window.location.href
        }
    }

    window.router = new Router()
})();