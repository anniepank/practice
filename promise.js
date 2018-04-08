class Promise {
    constructor (fx) {
        this.state = 'new'
        fx((value) => {
            this.value = value
            this._resolve()
        }, (value) => {
            this.value = value
            this._reject()
        })
        this.thenHandlers = []
    }

    then (fx) {
        this.thenHandlers.push(fx)

    }

    catch (fx) {

    }

    _resolve () {
        for (let h of this.thenHandlers) {
            h(this.value)
        }
        this.state = 'resolved'
    }

    _reject () {
        this.state = 'rejected'
    }
}