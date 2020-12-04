<template>
    <div id="nav" v-if = '$route.name !== "Editor"'>
        <router-link to="/">Home</router-link>
         | <router-link to="/about">About</router-link>
    </div>

    <div v-if = 'skyid !== null'>
        <div v-if = 'loggedIn == true'>
            <router-view>
                <template v-slot:logoutButton>
                    <button class = 'logout-bar' @click = 'logout'>Logout</button>
                </template>
            </router-view>

                <button class = 'logout-bar' @click = 'logout'>Logout</button>
        </div>

        <div v-else>
            <h2>You need to be logged in using <a href="https://sky-id.hns.siasky.net">SkyID</a></h2>

            <!-- Button for login -->
            <button @click = 'login' class="skyid-button imageButton">
                <img src="@/assets/SkyID_Logo_128.png" alt="SkyID" class="skyid-logo">
                Sign in with SkyID
            </button>
        </div>

    </div>

    <div v-else>
        <h2 class="big-margin">Initializing SkyID...</h2>
    </div>

</template>

<script>
import connect from '@/components/idx/connect';
import * as skyidIntegration from '@/components/skyid-integration';

export default {
    data() {
        return {
            skyid: null,
            loggedIn: false
        }
    },
    methods: {
        setAuthState(message) {
            console.log('IN SKYID CONSTRUCTOR');

            switch(message) {
                case 'login_fail':
                    console.log('Login failed');
                    break;
                case 'login_success':
                    console.log('Login succeed!')
                    this.loggedIn = true;
                    break;
                case 'destroy':
                    console.log('Logout succeed!')
                    this.loggedIn = false;
                    break;
                default:
                    console.log(message);
                    break;
            }
        },

        login() {
            return skyidIntegration.login(this.skyid)
        },

        logout() {
            return skyidIntegration.logout(this.skyid)
        }
    },
    mounted() {
        localStorage.setItem('portal', 'https://siasky.net/');
        console.log('MOUNTING APP');
        let skyid =  skyidIntegration.initialize(this.setAuthState)

        if(skyid.seed != '')
            this.loggedIn = true;

        this.skyid = skyid;
        this.$store.state.skyid = skyid;
    }
}
</script>
<style src = '@/assets/fontawesome/css/fontawesome.min.css'></style>
<style src = '@/assets/fontawesome/css/solid.min.css'></style>
<style src = '@/assets/fontawesome/css/brands.min.css'></style>
<style src = '@/assets/styles/main.css'></style>
<style src = '@/assets/styles/skyid.css'></style>
<style>
html, body {
    margin: 0;
    padding: 0;
}
html, body, div, p {
    box-sizing: border-box;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

button img {
    height: 20px;
    margin-right: 1em;
}

#nav {
    padding: 30px;
}

#nav a {
    font-weight: bold;
    color: #2c3e50;
}

#nav a.router-link-exact-active {
    color: #42b983;
}
div#overlay {
    position: absolute;
    top: 0;
    left: 0;

    width: 100vw;
    height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;

    background: rgba(0, 0, 0, 0.4);

}
.err, #err {
    background: red;
    font-size: 1.3rem;
    padding: 1em 2em;
    color: white;
    position: fixed;
    top: 0;
    right: 0;

    z-index: 10;

    border-radius: 6px;
}
</style>
