<template>
  <div id="app">

    <div>
      <b-navbar toggleable="sm" type="dark" variant="info">
        <b-navbar-brand to="/">MetArt</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/">Home</b-nav-item>

            <b-nav-item-dropdown text="Kategorije">
              <b-dropdown-item v-for="ctgr in categories" :key="ctgr.id" :to="`/category/${ctgr.id}/${ctgr.name}`">
                {{ ctgr.name }}
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>

          <b-navbar-nav class="ml-auto">
            <b-nav-item v-if="!token" to="/register">Register</b-nav-item>
            <b-nav-item v-if="!token" to="/login">Log In</b-nav-item>
            <b-nav-item v-else @click="logout()">Log Out</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>

    <router-view class="stranica" />
  </div>
</template>

<script>

  import { mapActions, mapState, mapMutations } from 'vuex';

  export default {
    name: 'App',


    computed: {
      ...mapState([
        'categories',
        'token'
      ])
    },

    mounted() {
      this.fetchCategories();
      
      if (localStorage.token) {
        this.setToken(localStorage.token);
      }
    },

    methods: {
      ...mapActions([
        'fetchCategories'
      ]),

      ...mapMutations([
        'removeToken',
        'setToken'
      ]),

      logout() {
        this.removeToken();
      }
    },

    sockets: {
      error(err) {
        alert(err);
      }
    }
  }
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    padding-bottom: 10px;
  }

  .stranica {
    width: 80%;
    margin-left: 10%;
  }
</style>
