<template>
    <div id="nav">
        <router-link to="/">Home</router-link>
         | <router-link to="/about">About</router-link>
    </div>

  <router-view/>
</template>

<script>
import connect from '@/components/idx/connect';
export default {
    mounted() {
        console.log('MOUNING APP');
        /*
        return connect()
        */
        return window.ethereum.enable()
        .then(res => {
            let account = res[0];
            this.$store.state.user = account;
            window.localStorage.setItem('portal', 'https://siasky.net');
        });
    }
}
</script>
<style src = '@/assets/fontawesome/css/fontawesome.min.css'></style>
<style src = '@/assets/fontawesome/css/solid.min.css'></style>
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
</style>
