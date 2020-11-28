const initialize = function() {
    let devMode;

    if(window.location.hostname == 'localhost')
        devMode = true;
    else 
        devMode = false;

    let opts = { devMode };
    let skyidEventCallback = function(message) {
        switch(message) {
            case 'login_fail':
                console.log('Login failed')
                break;
            case 'login_success':
                console.log('Login succeed!')
                break;
            case 'destroy':
                console.log('Logout succeed!')
                break;
            default:
                console.log(message)
                break;
        }
	}

    return new SkyID('DubiDocs', skyidEventCallback, opts); 
}

const login = function() {
    return initialize()
    .then(skyid => {
        console.log('SKYID', skyid);
        return skyid.sessionStart();
    });
}

const logout = function() {
    let skyid = initialize();
    return skyid.sessionDestroy();
}

export { login, logout, initialize };
