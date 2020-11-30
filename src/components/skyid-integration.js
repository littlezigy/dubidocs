const initialize = function(skyidEventCallback) {
    let devMode;

    if(window.location.hostname == 'localhost')
        devMode = true;
    else 
        devMode = false;

    let opts = { devMode };
            
            let skyid = new SkyID('DubiDocs', skyidEventCallback, opts);
            console.log('SKYIDD', skyid);

            // Check if logged in
            if (skyid.seed != '') { // if user logged in
                console.log('Already logged in');
            }

            return skyid;
}

const login = function(skyid) {
        return skyid.sessionStart();
}

const logout = function(skyid) {
    return skyid.sessionDestroy();
}

export { login, logout, initialize };
