window.loginPageComponent = function () {
    console.log('LOGIN')
    let loginPage = document.querySelector('.login-page').cloneNode(true)
    loginPage.style.display = 'block'

    loginPage.querySelector('button').addEventListener('click', () => {
        let username = loginPage.querySelector('#login-user-name').value
        if (username !== '') {
            if (app.logIn(username)) {
                router.navigate('')
            }
        }
    })
    return loginPage
}
