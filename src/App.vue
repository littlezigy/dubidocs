<template>
  <div id="nav" v-if = '$route.name !== "Editor"'>
    <router-link to="/">Home</router-link>
     | <router-link to="/about">About</router-link>
     | <router-link :to= '{ name: "Editor" }'>Editor</router-link>
  </div>
  <router-view/>
</template>

<style src = '@/assets/fontawesome/css/all.min.css'></style>
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
</style>
